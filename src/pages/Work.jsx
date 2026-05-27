import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { client } from '@/sanity/lib/client';
import { caseStudiesV2Query } from '@/sanity/lib/queries';
import { ChevronDown } from "lucide-react";
import Seo from '@/components/Seo';
import CaseStudyCard from '@/components/CaseStudyCard';
import CaseStudyCardSkeleton from '@/components/skeletons/CaseStudyCardSkeleton';
import { TextAnimate } from '@/components/ui/text-animate';

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
    const pageRef = useRef(null);
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categoryOptions = useMemo(() => {
        const names = caseStudies.flatMap(s => s.categories?.map(c => c.name) || []);
        return [...new Set(names)].sort();
    }, [caseStudies]);


    useEffect(() => {
        let isMounted = true;
        const fetchWorks = async () => {
            setLoading(true);
            try {
                const results = await client.fetch(caseStudiesV2Query);
                if (isMounted) setCaseStudies(results || []);
            } catch (error) {
                console.error("Error fetching case studies:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchWorks();

        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.work-card', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo('.work-card',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
            );
        }, pageRef);
        return () => ctx.revert();
    }, [loading, selectedCategory]);

    const filteredAndSortedStudies = caseStudies
        .filter((study) => selectedCategory === "all" || study.categories?.some(c => c.name === selectedCategory))
        .sort((a, b) => a.priority - b.priority);

    return (
        <main ref={pageRef} className="min-h-screen bg-surface text-text pt-36 pb-20 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title="AI Automation Case Studies: Real Client Results | RSL/A"
                description="Real results from real clients. See how RSL/A uses AI automation, custom websites, and CRM systems to drive measurable growth for B2B companies."
                keywords="AI automation case studies, marketing automation results, AI lead generation results, business automation ROI"
                canonical="https://rsla.io/work"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Case Studies',
                    url: 'https://rsla.io/work',
                    description: 'Real results from real clients. See how RSL/A uses AI automation, paid ads, and CRM systems to drive measurable growth.',
                    isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: 'https://rsla.io' },
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: caseStudies.map((cs, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            url: `https://rsla.io/work/${cs.slug}`,
                            name: cs.title,
                        })),
                    },
                }}
            />
            {/* Hero Section */}
            <section className="mb-14 text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-5xl font-sans font-bold text-text mb-4 tracking-tight leading-[1.1]">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        Our work.
                    </TextAnimate>
                </h1>
                <p className="font-sans text-textMuted max-w-2xl mx-auto text-lg leading-relaxed">
                    We don't sell promises. We sell engineered outcomes. Here is the proof.
                </p>
            </section>

            {/* Filters */}
            <section className="mb-10 border-b border-accent-border pb-6 relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none min-h-[44px] pl-4 pr-10 rounded-full bg-surfaceAlt border border-accent-border text-text font-sans text-sm uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                            >
                                <option value="all">All Categories</option>
                                {categoryOptions.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                        </div>
                    </div>
                    {!loading && (
                        <div className="font-sans text-sm text-textMuted">
                            Showing [{filteredAndSortedStudies.length}] result{filteredAndSortedStudies.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CaseStudyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredAndSortedStudies.length === 0 ? (
                    <div className="text-center py-20 font-sans text-textMuted">
                        No case studies found for this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredAndSortedStudies.map((study) => (
                            <CaseStudyCard data={study} key={study.slug} />
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}
