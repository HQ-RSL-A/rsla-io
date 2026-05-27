import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { client } from '@/sanity/lib/client';
import { caseStudyBySlugV2Query, relatedCaseStudiesQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { PortableTextComponents } from '@/components/blog/PortableTextRenderer';
import Seo from '@/components/Seo';
import { TextAnimate } from '@/components/ui/text-animate';
import ShareBar from '@/components/ShareBar';
import CaseStudyCard from '@/components/CaseStudyCard';

gsap.registerPlugin(ScrollTrigger);

function getVideoEmbedUrl(url) {
    if (!url) return null;
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const wistia = url.match(/wistia\.com\/medias\/([^&?/]+)/);
    if (wistia) return `https://fast.wistia.net/embed/iframe/${wistia[1]}`;
    return null;
}

export default function WorkInner() {
    const { slug } = useParams();
    const [caseStudy, setCaseStudy] = useState(null);
    const [relatedCases, setRelatedCases] = useState([]);
    const [loading, setLoading] = useState(true);
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
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
            );
            gsap.fromTo('.cs-hero',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
            );
            gsap.fromTo('.cs-section',
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out', delay: 0.15 }
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
    const seoImage = caseStudy.seo?.socialImage?.asset?.url
        || (caseStudy.thumbnailBackground?.asset ? urlForImage(caseStudy.thumbnailBackground.asset)?.width(1200).height(630).url() : null)
        || 'https://rsla.io/og-image.png';

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
                    description: caseStudy.tldr || '',
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

            <div className="max-w-6xl mx-auto relative z-10 px-5 md:px-12 pt-28 md:pt-32">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 md:mb-10">
                    <Link to="/work" className="font-sans text-[14px] md:text-[16px] font-normal text-accent hover:text-text transition-colors duration-200">
                        Case Studies
                    </Link>
                    <span className="text-gray-300 text-[14px] md:text-[16px]">/</span>
                    <span className="font-sans text-[14px] md:text-[16px] font-normal text-text" aria-current="page">
                        {caseStudy.clientName || caseStudy.title}
                    </span>
                </nav>

                {/* Heading + intro */}
                <h1 className="cs-hero opacity-0 text-[48px] md:text-[56px] font-sans font-bold leading-[56px] md:leading-[68px] tracking-[-0.02em] text-text mb-6">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        {caseStudy.title}
                    </TextAnimate>
                </h1>

                <p className="cs-hero opacity-0 text-[16px] md:text-[18px] text-text/80 font-sans font-normal leading-[26px] md:leading-[28px] max-w-2xl mb-8 md:mb-12">
                    {caseStudy.tldr}
                </p>
                {/* Mobile metrics - vertical stack */}
                {caseStudy.metrics?.length > 0 && (
                    <div className="cs-hero opacity-0 lg:hidden space-y-4 pb-6 mb-6 border-b border-gray-200">
                        {caseStudy.metrics.map((metric, idx) => (
                            <div key={idx} className="pl-3 border-l-2 border-accent">
                                <strong className="text-[24px] font-sans font-medium text-text block leading-[32px]">
                                    {metric.value}
                                </strong>
                                <span className="font-sans text-[14px] md:text-[15px] font-normal text-gray-500">
                                    {metric.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Two-column layout */}
                <div className="flex flex-col lg:flex-row lg:gap-0 lg:border-t lg:border-dashed lg:border-gray-200 lg:pt-10">

                    {/* ===== STICKY SIDEBAR ===== */}
                    <aside className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0 border-r border-dashed border-gray-200 pr-10 xl:pr-12">
                        <div className="sticky top-24">
                            {/* Metrics */}
                            {caseStudy.metrics?.length > 0 && (
                                <div className="space-y-5 mb-8">
                                    {caseStudy.metrics.map((metric, idx) => (
                                        <div key={idx} className="sidebar-metric opacity-0 pl-3 border-l border-accent">
                                            <strong className="text-[24px] font-sans font-medium text-text block leading-[32px]">
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
                            {(caseStudy.industry || caseStudy.categories?.length > 0) && (
                                <div className="border-t border-dashed border-gray-200 pt-6 mb-8 font-sans space-y-4">
                                    {caseStudy.industry && (
                                        <div>
                                            <span className="text-[15px] font-normal text-[#727F96] block mb-0.5">Industry</span>
                                            <span className="text-[15px] font-medium text-text">{caseStudy.industry}</span>
                                        </div>
                                    )}
                                    {caseStudy.categories?.length > 0 && (
                                        <div>
                                            <span className="text-[15px] font-normal text-[#727F96] block mb-1">Services Used</span>
                                            {caseStudy.categories.map((cat) => (
                                                <span key={cat._id} className="text-[15px] font-medium text-text block leading-relaxed">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CTA */}
                            <Link
                                to="/contact"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-sans font-medium text-[15px] rounded-xl hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_20px_rgba(0,112,243,0.25)] mb-4"
                            >
                                Book a Call <span className="text-white/60">→</span>
                            </Link>

                            {/* Share */}
                            <div className="flex items-center justify-center">
                                <ShareBar title={caseStudy.title} url={`https://rsla.io/work/${slug}`} showLabel={false} />
                            </div>
                        </div>
                    </aside>

                    {/* ===== BODY ===== */}
                    <div className="cs-body flex-1 min-w-0 max-w-[720px] lg:pl-10 xl:pl-12">

                        {/* Body content (PortableText) */}
                        {caseStudy.content && (
                            <div className="cs-section opacity-0 prose-container max-w-none mb-14 case-study-prose">
                                <PortableText value={caseStudy.content} components={PortableTextComponents} />
                            </div>
                        )}

                        {/* Testimonial */}
                        {caseStudy.testimonialText && (
                            <blockquote className="cs-section opacity-0 border-l border-gray-300 pl-6 py-4 mb-14">
                                <p className="text-[16px] md:text-[18px] font-sans font-normal text-text leading-[26px] md:leading-[28px] italic">
                                    "{caseStudy.testimonialText}"
                                </p>
                                {caseStudy.testimonialAuthor && (
                                    <cite className="font-sans text-[15px] md:text-[16px] font-medium text-text mt-3 block not-italic">
                                        {caseStudy.testimonialAuthor}
                                    </cite>
                                )}
                            </blockquote>
                        )}

                        {/* Testimonial Media */}
                        {caseStudy.testimonialMedia?.length > 0 && (
                            <div className="cs-section opacity-0 mb-14 space-y-6">
                                {caseStudy.testimonialMedia.map((item) => {
                                    if (item._type === 'testimonialVideo') {
                                        const embedUrl = getVideoEmbedUrl(item.url);
                                        if (!embedUrl) return null;
                                        return (
                                            <div key={item._key}>
                                                <div className={`relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm ${item.orientation === 'vertical' ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video'}`}>
                                                    <iframe
                                                        src={embedUrl}
                                                        title={item.caption || 'Video'}
                                                        className="absolute inset-0 w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        loading="lazy"
                                                    />
                                                </div>
                                                {item.caption && (
                                                    <p className="font-sans text-[14px] font-normal text-[#727F96] text-center mt-3">{item.caption}</p>
                                                )}
                                            </div>
                                        );
                                    }
                                    if (item._type === 'testimonialPhoto' && item.asset?.asset) {
                                        const photoUrl = urlForImage(item.asset.asset)?.width(1200).url();
                                        if (!photoUrl) return null;
                                        return (
                                            <div key={item._key}>
                                                <img
                                                    src={photoUrl}
                                                    alt={item.alt || ''}
                                                    className="w-full rounded-2xl border border-gray-200 shadow-sm"
                                                    loading="lazy"
                                                />
                                                {item.caption && (
                                                    <p className="font-sans text-[14px] font-normal text-[#727F96] text-center mt-3">{item.caption}</p>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        )}

                        {/* Related blog posts */}
                        {caseStudy.relatedBlogPosts?.length > 0 && (
                            <aside className="cs-section opacity-0 mt-14 border-t border-dashed border-gray-200 pt-10">
                                <h3 className="text-[24px] font-sans font-bold text-text mb-6">
                                    Related articles
                                </h3>
                                <div className="space-y-4">
                                    {caseStudy.relatedBlogPosts.map((post) => (
                                        <Link
                                            key={post._id}
                                            to={`/blog/${post.slug?.current || post.slug}`}
                                            className="flex gap-4 items-start group"
                                        >
                                            {post.featuredImage?.asset && (
                                                <img
                                                    src={urlForImage(post.featuredImage.asset)?.width(160).height(100).url()}
                                                    alt={post.featuredImage.alt || post.title}
                                                    className="w-[120px] h-[75px] object-cover rounded-lg shrink-0"
                                                    loading="lazy"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-sans text-[16px] font-medium text-text group-hover:text-accent transition-colors duration-200 leading-snug">
                                                    {post.title}
                                                </h4>
                                                {post.excerpt && (
                                                    <p className="font-sans text-[15px] font-normal text-[#727F96] mt-1 line-clamp-2 leading-relaxed">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </aside>
                        )}

                        {/* Related case studies */}
                        {relatedCases.length > 0 && (
                            <aside className="cs-section opacity-0 mt-14">
                                <h3 className="text-[24px] font-sans font-bold text-text mb-8">
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

            {/* Mobile sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-t border-gray-200 px-5 pt-3" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
                <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-sans font-medium text-[15px] rounded-xl active:scale-[0.97] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_16px_rgba(0,112,243,0.25)]"
                >
                    Book a Call <span className="text-white/60">→</span>
                </Link>
            </div>
        </article>
    );
}
