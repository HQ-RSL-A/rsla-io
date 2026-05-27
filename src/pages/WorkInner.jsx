import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ZoomIn } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { caseStudyBySlugV2Query, relatedCaseStudiesQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { PortableTextComponents } from '@/components/blog/PortableTextRenderer';
import Seo from '@/components/Seo';
import { TextAnimate } from '@/components/ui/text-animate';
import ShareBar from '@/components/ShareBar';
import CaseStudyCard from '@/components/CaseStudyCard';
import MediaLightbox from '@/components/MediaLightbox';

gsap.registerPlugin(ScrollTrigger);

export default function WorkInner() {
    const { slug } = useParams();
    const [caseStudy, setCaseStudy] = useState(null);
    const [relatedCases, setRelatedCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const articleRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedStudy = await client.fetch(caseStudyBySlugV2Query, { slug });

                if (!fetchedStudy) {
                    if (isMounted) {
                        setCaseStudy(null);
                        setLoading(false);
                    }
                    return;
                }

                if (isMounted) setCaseStudy(fetchedStudy);

                let cases = fetchedStudy.relatedCases;
                if (!cases || cases.length === 0) {
                    const categorySlugs = (fetchedStudy.categories || []).map(c => c.slug);
                    cases = await client.fetch(relatedCaseStudiesQuery, {
                        slug,
                        categorySlugs,
                    });
                }

                if (isMounted) setRelatedCases(cases || []);

            } catch (error) {
                console.error("Error fetching case study:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [slug]);

    useEffect(() => {
        if (loading || !caseStudy) return;
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.sidebar-metric', { opacity: 1, y: 0 });
                gsap.set('.cs-section', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo('.sidebar-metric',
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
            );
            gsap.fromTo('.cs-section',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out',
                    scrollTrigger: { trigger: '.cs-body', start: 'top 85%', once: true }
                }
            );
        }, articleRef);
        return () => ctx.revert();
    }, [loading, caseStudy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
                <div className="font-sans text-accent animate-pulse">[FETCHING_CASE_STUDY...]</div>
            </div>
        );
    }

    if (!caseStudy) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-sans font-bold text-text mb-4">404 - Case Study Not Found</h1>
                <Link to="/work" className="text-accent hover:underline font-sans">Back to Case Studies</Link>
            </div>
        );
    }

    const seoTitle = caseStudy.seo?.metaTitle ? `${caseStudy.seo.metaTitle} | RSL/A` : `${caseStudy.title} | RSL/A`;
    const seoDescription = caseStudy.seo?.metaDescription || caseStudy.tldr || '';
    const seoImage = caseStudy.seo?.socialImage?.asset?.url || 'https://rsla.io/og-image.png';

    const resultsMediaImages = (caseStudy.resultsMedia || [])
        .filter(img => img?.asset)
        .map(img => ({
            url: urlForImage(img.asset)?.width(1600).url(),
            thumbUrl: urlForImage(img.asset)?.width(400).height(300).url(),
            alt: img.alt || '',
            caption: img.caption || '',
        }));

    return (
        <article ref={articleRef} className="min-h-screen bg-surface text-text pb-28 lg:pb-24 relative">
            <Seo
                title={seoTitle}
                description={seoDescription}
                canonical={`https://rsla.io/work/${slug}`}
                ogImage={seoImage}
                ogType="article"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: caseStudy.title,
                    description: caseStudy.tldr || caseStudy.description || '',
                    datePublished: caseStudy.publishedAt || undefined,
                    author: { '@type': 'Person', name: 'Rahul Lalia' },
                    publisher: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        logo: { '@type': 'ImageObject', url: 'https://rsla.io/images/logo/lockup-nobg.webp' },
                    },
                    mainEntityOfPage: `https://rsla.io/work/${slug}`,
                }}
            />

            <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12 pt-32">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-10">
                    <Link to="/work" className="font-sans text-[15px] font-medium text-accent hover:text-text transition-colors duration-150 ease-out">
                        Case Studies
                    </Link>
                    <span className="text-gray-300 text-[15px]">/</span>
                    <span className="font-sans text-[15px] font-medium text-text">
                        {caseStudy.clientName || caseStudy.title}
                    </span>
                </nav>

                {/* Heading + intro - spans full width of both columns */}
                <h1 className="cs-section opacity-0 text-[32px] md:text-[56px] font-sans font-bold leading-[1.2] tracking-[-0.02em] text-text mb-6">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        {caseStudy.title}
                    </TextAnimate>
                </h1>

                <p className="cs-section opacity-0 text-[18px] text-text/80 font-sans font-normal leading-[28px] max-w-2xl mb-12">
                    {caseStudy.tldr || caseStudy.description}
                </p>
                {/* Mobile metrics - horizontal scroll */}
                {caseStudy.metrics?.length > 0 && (
                    <div className="lg:hidden flex gap-5 overflow-x-auto scrollbar-hide pb-6 mb-8 -mx-6 px-6 border-b border-gray-200">
                        {caseStudy.metrics.map((metric, idx) => (
                            <div key={idx} className="shrink-0 pr-5 border-r border-gray-200 last:border-r-0 last:pr-0">
                                <strong className="text-2xl font-sans font-bold text-accent block mb-0.5">
                                    {metric.value}
                                </strong>
                                <span className="font-sans text-[13px] text-gray-600 whitespace-nowrap">
                                    {metric.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Two-column layout with structural lines */}
                <div className="flex flex-col lg:flex-row lg:gap-0 border-t border-dashed border-gray-200 pt-10">

                    {/* ===== STICKY SIDEBAR ===== */}
                    <aside className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0 border-r border-dashed border-gray-200 pr-10 xl:pr-12">
                        <div className="sticky top-24">
                            {/* Metrics */}
                            {caseStudy.metrics?.length > 0 && (
                                <div className="space-y-5 mb-8">
                                    {caseStudy.metrics.map((metric, idx) => (
                                        <div key={idx} className="sidebar-metric opacity-0 pl-3 border-l border-accent">
                                            <strong className="text-[24px] font-sans font-medium text-text block leading-[32px] tracking-tight">
                                                {metric.value}
                                            </strong>
                                            <span className="font-sans text-[15px] font-normal text-[#425466] leading-snug block mt-0.5">
                                                {metric.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Meta info */}
                            {caseStudy.industry && (
                                <div className="border-t border-dashed border-gray-200 pt-6 mb-8 font-sans">
                                    <span className="text-[15px] font-normal text-[#727F96] block mb-0.5">Industry</span>
                                    <span className="text-[15px] font-medium text-text">{caseStudy.industry}</span>
                                </div>
                            )}

                            {/* CTA */}
                            <Link
                                to="/contact"
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-sans font-medium text-[15px] rounded-xl hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 ease-out shadow-[0_0_20px_rgba(0,112,243,0.25)] mb-6"
                            >
                                Book a Call <span className="text-white/60">→</span>
                            </Link>

                            {/* Share */}
                            <div className="flex items-center justify-center">
                                <ShareBar title={caseStudy.title} url={`https://rsla.io/work/${slug}`} />
                            </div>
                        </div>
                    </aside>

                    {/* ===== BODY ===== */}
                    <div className="cs-body flex-1 min-w-0 max-w-[720px] lg:pl-10 xl:pl-12">

                        {/* Before / After */}
                        {caseStudy.beforeAfter && (caseStudy.beforeAfter.before || caseStudy.beforeAfter.after) && (
                            <div className="cs-section opacity-0 grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                                {caseStudy.beforeAfter.before && (
                                    <div className="p-6 rounded-xl border border-red-200 bg-red-50/60">
                                        <h3 className="text-[12px] font-bold font-sans text-red-700 uppercase tracking-widest mb-3">Before</h3>
                                        <p className="text-[16px] font-normal text-text leading-[26px] font-sans">{caseStudy.beforeAfter.before}</p>
                                    </div>
                                )}
                                {caseStudy.beforeAfter.after && (
                                    <div className="p-6 rounded-xl border border-green-200 bg-green-50/60">
                                        <h3 className="text-[12px] font-bold font-sans text-green-800 uppercase tracking-widest mb-3">After</h3>
                                        <p className="text-[16px] font-normal text-text leading-[26px] font-sans">{caseStudy.beforeAfter.after}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Challenge */}
                        {caseStudy.problemStatement && (
                            <section className="cs-section opacity-0 mb-12">
                                <h2 className="text-[34px] font-sans font-bold text-text mb-4 leading-[44px]">The Challenge</h2>
                                <p className="text-[18px] font-medium text-text leading-[28px] font-sans">
                                    {caseStudy.problemStatement}
                                </p>
                            </section>
                        )}

                        {/* Solution */}
                        {caseStudy.solutionApproach && (
                            <section className="cs-section opacity-0 mb-12">
                                <h2 className="text-[34px] font-sans font-bold text-text mb-4 leading-[44px]">The Solution</h2>
                                <p className="text-[18px] font-medium text-text leading-[28px] font-sans">
                                    {caseStudy.solutionApproach}
                                </p>
                            </section>
                        )}

                        {/* Results */}
                        {caseStudy.resultsOutcome && (
                            <section className="cs-section opacity-0 mb-14">
                                <h2 className="text-[34px] font-sans font-bold text-text mb-4 leading-[44px]">The Results</h2>
                                <p className="text-[18px] font-medium text-text leading-[28px] font-sans">
                                    {caseStudy.resultsOutcome}
                                </p>
                                {resultsMediaImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
                                        {resultsMediaImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                                            >
                                                <img
                                                    src={img.thumbUrl}
                                                    alt={img.alt}
                                                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                                    <ZoomIn size={20} className="text-white drop-shadow-md opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Testimonial */}
                        {caseStudy.testimonialText && (
                            <blockquote className="cs-section opacity-0 border-l border-gray-300 pl-6 py-4 mb-14">
                                <p className="text-[18px] md:text-[20px] font-sans font-normal text-text leading-[30px] italic">
                                    "{caseStudy.testimonialText}"
                                </p>
                                {caseStudy.testimonialAuthor && (
                                    <cite className="font-sans text-[15px] font-medium text-text mt-3 block not-italic">
                                        {caseStudy.testimonialAuthor}
                                    </cite>
                                )}
                            </blockquote>
                        )}

                        {/* Body content (PortableText) */}
                        {caseStudy.content && (
                            <div className="cs-section opacity-0 prose-container max-w-none mb-14 case-study-prose">
                                <PortableText value={caseStudy.content} components={PortableTextComponents} />
                            </div>
                        )}

                        {/* Related case studies */}
                        {relatedCases.length > 0 && (
                            <aside className="mt-14">
                                <h3 className="text-[24px] font-sans font-semibold text-text mb-8">
                                    More results
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {relatedCases.slice(0, 2).map((related) => (
                                        <CaseStudyCard
                                            key={related.slug}
                                            data={related}
                                        />
                                    ))}
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>

            {/* Media lightbox */}
            {lightboxIndex !== null && (
                <MediaLightbox
                    images={resultsMediaImages}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}

            {/* Mobile sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-accent-border px-6 py-3 safe-area-pb">
                <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-sans font-bold text-sm rounded-full shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                >
                    Book a Call <span className="text-white/70">→</span>
                </Link>
            </div>
        </article>
    );
}
