import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanity/lib/client';
import { blogPostBySlugV2Query, relatedBlogPostsByCategoryQuery } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import { PortableTextComponents, slugify } from '../components/blog/PortableTextRenderer';
import Seo from '../components/Seo';
import InlineNewsletterCta from '../components/blog/InlineNewsletterCta';
import ShareBar from '../components/ShareBar';

function ReadingProgressBar() {
    const barRef = useRef(null);

    useEffect(() => {
        let raf = 0;
        const handleScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const article = document.querySelector('article');
                if (!article || !barRef.current) return;
                const { top, height } = article.getBoundingClientRect();
                const scrollable = height - window.innerHeight;
                if (scrollable <= 0) return;
                const pct = Math.min(Math.max(-top / scrollable, 0), 1) * 100;
                barRef.current.style.width = `${pct}%`;
                barRef.current.parentElement.style.opacity = pct > 0 ? '1' : '0';
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(raf); };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none opacity-0">
            <div ref={barRef} className="h-full bg-accent" style={{ width: '0%' }} />
        </div>
    );
}

function useActiveHeading(headingIds) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (!headingIds.length) return;
        let raf = 0;

        const handleScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                let current = headingIds[0];
                for (const id of headingIds) {
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= 140) {
                        current = id;
                    }
                }
                setActiveId((prev) => prev === current ? prev : current);
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(raf); };
    }, [headingIds]);

    return activeId;
}

export default function BlogInner() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [headings, setHeadings] = useState([]);
    useEffect(() => {
        let isMounted = true;

        const fetchPostData = async () => {
            setLoading(true);
            try {
                let fetchedPost = await client.fetch(blogPostBySlugV2Query, { slug });

                if (!fetchedPost && isMounted) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                if (isMounted) {
                    setPost(fetchedPost);

                    if (fetchedPost.showTableOfContents && fetchedPost.body) {
                        const h2s = fetchedPost.body
                            .filter((block) => block._type === 'block' && block.style === 'h2')
                            .map((block) => {
                                const text = (block.children || []).map((c) => c.text || '').join('');
                                return { text, id: slugify(text) };
                            })
                            .filter((h) => h.text);
                        if (h2s.length >= 2) setHeadings(h2s);
                    }
                }

                if ((!fetchedPost.relatedPosts || fetchedPost.relatedPosts.length === 0) && isMounted) {
                    const categorySlugsForRelated = fetchedPost.categories?.map((c) => c.slug?.current).filter(Boolean) || [];
                    if (categorySlugsForRelated.length > 0) {
                        const categoryRelated = await client.fetch(relatedBlogPostsByCategoryQuery, {
                            currentId: fetchedPost._id,
                            categorySlugs: categorySlugsForRelated,
                        });
                        if (isMounted && categoryRelated?.length > 0) {
                            setPost(prev => ({ ...prev, relatedPosts: categoryRelated.slice(0, 3) }));
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPostData();

        return () => { isMounted = false; };
    }, [slug]);

    const headingIds = headings.map((h) => h.id);
    const activeId = useActiveHeading(headingIds);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
                <div className="font-sans text-lg text-accent animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-surface pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-sans font-bold text-text mb-4">404 - Article Not Found</h1>
                <Link to="/blog" className="text-lg text-accent underline decoration-transparent hover:decoration-accent underline-offset-4 transition-[text-decoration-color] duration-sm ease-out-smooth font-sans">Back to Blog</Link>
            </div>
        );
    }

    const imageUrl = post.featuredImage?.asset ? urlForImage(post.featuredImage.asset)?.width(1200).height(630).url() : null;
    const seoDescription = post.seo?.metaDescription || post.excerpt || (post.body?.[0]?.children?.[0]?.text || '').slice(0, 160);
    const seoTitle = post.seo?.metaTitle ? `${post.seo.metaTitle} | RSL/A` : `${post.title} | RSL/A`;
    const seoImage = post.seo?.socialImage?.asset?.url || imageUrl || 'https://rsla.io/og-image.png';
    const seoKeywords = post.seo?.keywords?.join(', ') || null;
    const firstCategory = post.categories?.[0] || null;

    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.seo?.metaTitle || post.title,
        description: seoDescription,
        image: seoImage !== 'https://rsla.io/og-image.png' ? seoImage : undefined,
        datePublished: post.publishedAt,
        ...(post.updatedAt && { dateModified: post.updatedAt }),
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Rahul Lalia',
        },
        publisher: {
            '@type': 'Organization',
            name: 'RSL/A',
            logo: { '@type': 'ImageObject', url: 'https://rsla.io/images/logo/lockup-nobg.webp' },
        },
        mainEntityOfPage: `https://rsla.io/blog/${slug}`,
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://rsla.io/blog' },
            { '@type': 'ListItem', position: 2, name: post.title },
        ],
    };

    const faqSchema = post.faqSchema?.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqSchema.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null;

    const softwareAppSchema = slug === 'go-high-level-pricing' ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'GoHighLevel',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: [
            { '@type': 'Offer', name: 'Starter', price: '97', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '97', priceCurrency: 'USD', billingDuration: 'P1M' } },
            { '@type': 'Offer', name: 'Unlimited', price: '297', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '297', priceCurrency: 'USD', billingDuration: 'P1M' } },
            { '@type': 'Offer', name: 'SaaS Pro', price: '497', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '497', priceCurrency: 'USD', billingDuration: 'P1M' } },
        ],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', bestRating: '5', ratingCount: '4200', reviewCount: '2100' },
    } : null;

    const jsonLdSchemas = [blogPostingSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : []), ...(softwareAppSchema ? [softwareAppSchema] : [])];

    return (
        <article className="min-h-screen bg-surface text-text pt-20 pb-24 relative">
            <ReadingProgressBar />
            <Seo
                title={seoTitle}
                description={seoDescription}
                canonical={`https://rsla.io/blog/${slug}`}
                ogImage={seoImage}
                ogType="article"
                keywords={seoKeywords}
                jsonLd={jsonLdSchemas}
                noIndex={post?.status === 'archived'}
            />

            {/* Dark hero header */}
            <div className="bg-black pt-6 pb-16 px-6 md:px-8">
                <div className="max-w-[1160px] mx-auto">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2">
                        <Link to="/blog" className="font-sans text-sm text-white/70 hover:text-white transition-colors">
                            Blog
                        </Link>
                        <span className="text-white/50 text-xs">&gt;</span>
                        <span className="font-sans text-sm text-white/60 truncate max-w-[200px]">
                            {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
                        </span>
                    </nav>

                    {/* Title + image side by side */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                        {/* Left: text content */}
                        <div className="lg:w-[60%] shrink-0">
                            <h1 className="text-3xl md:text-[40px] font-sans font-extrabold leading-[1.2] tracking-tight text-white mb-5">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="font-sans text-base md:text-lg text-white/80 mb-6 leading-relaxed max-w-xl">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                                {post.author?.image?.asset && (
                                    <img
                                        src={urlForImage(post.author.image.asset)?.width(100).height(100).url()}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                        width="40"
                                        height="40"
                                    />
                                )}
                                <div>
                                    <span className="font-sans font-semibold text-base text-white">{post.author?.name || 'Rahul Lalia'}</span>
                                    {post.author?.role && <span className="font-sans text-sm text-white/70 ml-2">{post.author.role}</span>}
                                </div>
                            </div>
                            <div className="font-sans text-sm text-white/70 flex items-center gap-2">
                                <span>Last Updated:</span>
                                <time dateTime={post.updatedAt || post.publishedAt}>
                                    {new Date(post.updatedAt || post.publishedAt).toLocaleDateString('en-US', {
                                        month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </time>
                                {post.readingTime && (
                                    <><span className="text-white/50">&middot;</span><span>{post.readingTime} min</span></>
                                )}
                            </div>
                        </div>

                        {/* Right: featured image */}
                        {imageUrl && (
                            <div className="lg:w-[40%] w-full">
                                <div className="aspect-[1200/630] rounded-xl overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={post.featuredImage?.alt || post.title}
                                        className="w-full h-full object-cover"
                                        width="1200"
                                        height="630"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile ToC (visible < xl only) */}
            {headings.length > 0 && (
                <div className="xl:hidden max-w-[720px] mx-auto px-6 mb-8 mt-12">
                    <nav aria-label="Table of contents" className="bg-black rounded-xl p-4">
                        <ul className="space-y-1">
                            {headings.map((h) => (
                                <li key={h.id}>
                                    <a
                                        href={`#${h.id}`}
                                        className="block text-base text-white/90 hover:text-white transition-[color] duration-sm ease-out-smooth py-1 pl-3"
                                    >
                                        {h.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            {/* Body section with sidebar */}
            <div className="max-w-5xl mx-auto px-6 mt-12 xl:grid xl:grid-cols-[220px_minmax(0,720px)] xl:gap-10 xl:justify-center">

                {/* Sidebar - sticky ToC in a dark card */}
                <aside className="hidden xl:block">
                    <div className="sticky top-24 bg-black rounded-xl p-5">
                        {headings.length > 0 && (
                            <nav aria-label="Table of contents">
                                <ul className="space-y-1">
                                    {headings.map((h) => (
                                        <li key={h.id}>
                                            <a
                                                href={`#${h.id}`}
                                                aria-current={activeId === h.id ? 'true' : undefined}
                                                className={`block text-[14px] leading-snug py-1.5 pl-3 border-l-2 transition-[color,border-color,text-decoration-color] duration-sm ease-out-smooth ${
                                                    activeId === h.id
                                                        ? 'border-transparent text-white font-medium underline decoration-accent decoration-2 underline-offset-4'
                                                        : 'border-transparent text-white/90 hover:text-white'
                                                }`}
                                            >
                                                {h.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </aside>

                {/* Main content column */}
                <div className="max-w-[720px]">
                    {/* TL;DR */}
                    {post.pullQuote && (
                        <div className="mb-10">
                            <span className="block font-sans text-sm font-semibold uppercase tracking-[0.15em] text-accent mb-2">TL;DR</span>
                            <p className="text-xl text-text leading-[1.6] font-sans">{post.pullQuote}</p>
                        </div>
                    )}

                    {/* Key Takeaways (renders when Sanity field exists) */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-4xl font-sans font-extrabold text-text mb-6 tracking-tight leading-[1.1]">Key takeaways</h2>
                            <div className="prose-container max-w-none">
                                <PortableText value={post.keyTakeaways} components={PortableTextComponents} />
                            </div>
                        </div>
                    )}

                    {/* Article body */}
                    <div className="prose-container max-w-none">
                        <PortableText value={post.body} components={PortableTextComponents} />
                    </div>

                    {/* Newsletter CTA */}
                    <InlineNewsletterCta />

                    {/* Author bio + share links */}
                    {post.author && (
                        <div className="mt-12 pt-8 border-t border-accent-border">
                            <div className="flex gap-5 items-start mb-6">
                                {post.author.image?.asset && (
                                    <img
                                        src={urlForImage(post.author.image.asset)?.width(120).height(120).url()}
                                        alt={post.author.name}
                                        className="w-14 h-14 rounded-full object-cover shrink-0"
                                        width="56"
                                        height="56"
                                    />
                                )}
                                <div>
                                    <p className="font-sans text-sm uppercase tracking-[0.15em] text-textLight mb-1">Written by</p>
                                    <p className="font-sans font-bold text-text text-xl">{post.author.name}</p>
                                    {post.author.role && (
                                        <p className="font-sans text-base text-textMuted">{post.author.role}</p>
                                    )}
                                    {post.author.bio && (
                                        <p className="font-sans text-base text-textMuted mt-2 leading-relaxed">{post.author.bio}</p>
                                    )}
                                </div>
                            </div>
                            <ShareBar title={post.title} url={`https://rsla.io/blog/${slug}`} />
                        </div>
                    )}
                </div>
            </div>

            {/* Keep reading */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="max-w-5xl mx-auto px-6 mt-20 mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl md:text-2xl font-sans font-bold text-text">Keep reading</h3>
                        <Link to="/blog" className="font-sans text-base text-accent underline decoration-transparent hover:decoration-accent underline-offset-4 transition-[text-decoration-color] duration-sm ease-out-smooth hidden sm:inline">
                            View all articles
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {post.relatedPosts.filter(r => r.slug?.current).map((related, i) => {
                            const relatedImg = related.featuredImage?.asset
                                ? urlForImage(related.featuredImage.asset)?.width(600).height(315).url()
                                : null;
                            return (
                                <Link
                                    key={related._id}
                                    to={`/blog/${related.slug.current}`}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    className="group flex flex-col bg-surface rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-[0.98] transition-[transform,box-shadow] duration-md ease-out-smooth"
                                >
                                    {relatedImg && (
                                        <div className="aspect-[1200/630] overflow-hidden bg-surfaceAlt">
                                            <img
                                                src={relatedImg}
                                                alt={related.featuredImage?.alt || related.title}
                                                loading="lazy"
                                                width="600"
                                                height="315"
                                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-image-zoom ease-out-smooth"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        {related.categories?.[0] && (
                                            <span className="font-sans text-sm uppercase tracking-[0.15em] text-accent font-semibold mb-2 block">
                                                {related.categories[0].name}
                                            </span>
                                        )}
                                        <h4 className="font-sans font-semibold text-lg tracking-tight mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                                            {related.title}
                                        </h4>
                                        <time className="font-sans text-base text-textLight" dateTime={related.publishedAt}>
                                            {new Date(related.publishedAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric',
                                            })}
                                        </time>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

        </article>
    );
}
