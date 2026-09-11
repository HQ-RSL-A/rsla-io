import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { client } from '../sanity/lib/client';
import { blogOverviewQuery } from '../sanity/lib/queries';
import Seo from '../components/Seo';
import { BLOG_CONTAINER, buildHeroPosts, categoryBlurb, postSlug } from '@/components/blog/blogShared';
import BlogCategoryStrip from '@/components/blog/BlogCategoryStrip';
import HeroCarousel from '@/components/blog/HeroCarousel';
import ArticlesGrid from '@/components/blog/ArticlesGrid';
import NewsletterBand from '@/components/blog/NewsletterBand';
import BlogCardSkeleton from '@/components/skeletons/BlogCardSkeleton';

/*
 * /blog overview, laid out after clay.global/blog: charcoal hero with a
 * carousel of editor's picks, "Latest", The Insider band, then one section
 * per category with three or more posts. The full searchable list lives at
 * /blog/archive; old ?category= / ?q= / ?page= links redirect there.
 */

const DESCRIPTION = 'Guides on GoHighLevel, Claude, automation, and local SEO, from the work we do for clients.';

function GridSkeleton() {
    return (
        <div>
            <div className="h-12 w-40 bg-blog-card animate-pulse" aria-hidden="true" />
            <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-y-14">
                {[0, 1].map((i) => <div key={i} className="md:col-span-6"><BlogCardSkeleton size="wide" /></div>)}
                {[2, 3, 4].map((i) => <div key={i} className="md:col-span-6 lg:col-span-4"><BlogCardSkeleton /></div>)}
            </div>
        </div>
    );
}

export default function Blog() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let isMounted = true;
        client.fetch(blogOverviewQuery)
            .then((d) => { if (isMounted) setData(d); })
            .catch((err) => { console.error('Error fetching blog overview:', err); if (isMounted) setFailed(true); });
        return () => { isMounted = false; };
    }, []);

    // The old listing filtered in place; those links now open the archive.
    if (searchParams.toString()) {
        return <Navigate to={`/blog/archive?${searchParams.toString()}`} replace />;
    }

    const latest = data?.latest || [];
    const sections = data?.sections || [];
    const nav = data?.nav || [];
    const hero = data ? buildHeroPosts(data) : [];

    const seen = new Set();
    const listed = [...latest, ...sections.flatMap((s) => s.posts || [])].filter((p) => {
        if (seen.has(p._id)) return false;
        seen.add(p._id);
        return true;
    });

    return (
        <div className="bg-white text-blog-ink">
            <Seo
                title="GoHighLevel, AI automation, and local SEO guides | RSL/A"
                description="Guides on GoHighLevel, Claude, automation, and local SEO, written from the work we do for clients: what we set up, what it cost, and what moved."
                keywords="AI automation blog, marketing automation insights, business AI strategies"
                canonical="https://rsla.io/blog"
                jsonLd={{
                    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Blog', url: 'https://rsla.io/blog',
                    description: 'Guides on GoHighLevel, Claude, automation, and local SEO from RSL/A.',
                    isPartOf: { '@id': 'https://rsla.io/#website' },
                    mainEntity: { '@type': 'ItemList', itemListElement: listed.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://rsla.io/blog/${postSlug(p)}`, name: p.title })) },
                }}
            />

            {/* Hero */}
            <section className="bg-blog-dark pt-[88px] pb-16 md:pb-[72px]">
                <BlogCategoryStrip categories={nav} tone="dark" />
                <div className={BLOG_CONTAINER}>
                    <h1 className="mt-[60px] md:mt-[95px] font-bold text-[56px] leading-[1.1] md:text-[74px] tracking-[-0.02em] text-white">Blog</h1>
                    <div className="mt-6 md:mt-7">
                        {data ? (
                            <HeroCarousel posts={hero} description={DESCRIPTION} />
                        ) : (
                            <div>
                                <p className="max-w-[1032px] text-[22px] leading-[1.4] md:text-[28px] tracking-[-0.01em] text-white">{DESCRIPTION}</p>
                                <div className="mt-10 md:mt-[74px] w-[91%] sm:w-[83%] lg:w-[67.4%] aspect-[311/456] sm:aspect-[628/346] lg:aspect-[1170/620] bg-white/10 animate-pulse" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Latest */}
            <section className="pt-16 pb-20">
                <div className={BLOG_CONTAINER}>
                    {data ? (
                        <ArticlesGrid
                            title="Latest"
                            posts={latest}
                            layout="latest"
                            showTag
                            showUpdated={false}
                            link={{ to: '/blog/archive', label: 'View archive' }}
                        />
                    ) : failed ? (
                        <p className="text-[18px] leading-[27px]">The posts did not load. <a href="/blog/archive" className="link-draw">Open the archive</a> or refresh the page.</p>
                    ) : (
                        <GridSkeleton />
                    )}
                </div>
            </section>

            <NewsletterBand />

            {/* One section per category with three or more posts */}
            {sections.map((section) => (
                <section key={section.slug} className="py-20">
                    <div className={BLOG_CONTAINER}>
                        <ArticlesGrid
                            title={section.name}
                            blurb={categoryBlurb(section)}
                            posts={section.posts}
                            layout="category"
                            link={{ to: `/blog/archive?category=${section.slug}`, label: 'View all articles' }}
                        />
                    </div>
                </section>
            ))}
        </div>
    );
}
