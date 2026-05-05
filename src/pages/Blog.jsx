import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { client } from '../sanity/lib/client';
import {
    blogHeroPostsQuery,
    blogPostsUnionQuery,
    blogPostsCountUnionQuery,
    blogCategoriesQuery,
    blogPostsByCategoryQuery,
    blogPostsCountByCategoryQuery,
    blogPostsSearchQuery,
    blogPostsSearchCountQuery,
    blogPostsSearchByCategoryQuery,
    blogPostsSearchByCategoryCountQuery,
} from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';
import Seo from '../components/Seo';
import BlogCardSkeleton from '../components/skeletons/BlogCardSkeleton';
import { MagicCard } from '@/components/ui/magic-card';

const POSTS_PER_PAGE_ONE = 8;
const POSTS_PER_PAGE = 9;

/* ─── Newsletter card (grid slot) ─── */

function NewsletterCard() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;
        setStatus('submitting');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: '9130465' }),
            });
            if (res.ok) { setStatus('success'); setEmail(''); }
            else { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
        } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
    };

    if (status === 'success') {
        return (
            <MagicCard className="rounded-xl h-full" gradientColor="#0066E0" gradientOpacity={0.08} gradientFrom="#0066E0" gradientTo="#818cf8" gradientSize={250}>
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                    <p className="font-sans font-bold text-xl text-text mb-1">You're in.</p>
                    <p className="font-sans text-base text-textMuted">Check your inbox.</p>
                </div>
            </MagicCard>
        );
    }

    return (
        <MagicCard className="rounded-xl h-full border border-accent/25" gradientColor="#0066E0" gradientOpacity={0.08} gradientFrom="#0066E0" gradientTo="#818cf8" gradientSize={250}>
            <div className="flex flex-col justify-center p-7 h-full">
                <p className="font-sans font-extrabold text-[24px] text-text tracking-tight leading-[1.2] mb-2">
                    Never miss<br />another article
                </p>
                <p className="font-sans text-sm text-textMuted mb-5 leading-relaxed">
                    Highly curated content, case studies, and updates.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'submitting'}
                        required
                        className="w-full px-4 min-h-[44px] rounded-lg bg-surfaceAlt border border-accent-border text-text font-sans text-base placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth mb-2"
                    />
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full min-h-[44px] rounded-lg bg-accent text-white font-sans font-bold text-base hover:bg-accent/90 active:scale-[0.97] transition-[background-color,transform] duration-sm ease-out-smooth disabled:opacity-50 cursor-pointer"
                    >
                        {status === 'submitting' ? '...' : 'Subscribe'}
                    </button>
                </form>
                {status === 'error' && <p className="font-sans text-sm text-coral mt-2">Something went wrong.</p>}
            </div>
        </MagicCard>
    );
}

/* ─── Post card (used in Most Popular + All Articles grids) ─── */

function PostCard({ post, showAuthor = false }) {
    const imageUrl = post.featuredImage?.asset
        ? urlForImage(post.featuredImage)?.width(750).height(475).url() : '';
    const firstCategory = post.categories?.[0];
    const authorImg = post.author?.image?.asset
        ? urlForImage(post.author.image)?.width(56).height(56).url() : null;

    return (
        <Link to={`/blog/${post.slug.current}`} className="group flex flex-col">
            {imageUrl && (
                <div className="aspect-[374/237] rounded-md overflow-hidden bg-surfaceAlt mb-4">
                    <img
                        src={imageUrl}
                        alt={post.featuredImage?.alt || post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-image-zoom ease-out-smooth"
                    />
                </div>
            )}
            <div className="mb-4 font-sans">
                {firstCategory && (
                    <span className="inline-block text-accent bg-accent/8 border border-accent/15 px-3 py-1 rounded-md font-semibold text-sm uppercase tracking-wide mb-2">
                        {firstCategory.name}
                    </span>
                )}
                <div className="flex items-center gap-2 text-sm text-textMuted">
                    <time>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    {post.readingTime && (
                        <>
                            <span className="text-textLight">&middot;</span>
                            <span>{post.readingTime} min read</span>
                        </>
                    )}
                </div>
            </div>
            <h3 className="font-sans font-bold text-lg md:text-xl tracking-tight leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
            </h3>
            {post.excerpt && (
                <p className="font-sans text-base text-textMuted line-clamp-2 mb-6 leading-relaxed flex-grow">
                    {post.excerpt}
                </p>
            )}
            {showAuthor && post.author && (
                <div className="flex items-center gap-2 mt-auto">
                    {authorImg && <img src={authorImg} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />}
                    <div className="font-sans text-sm">
                        <span className="font-semibold text-text">{post.author.name}</span>
                        {post.author.role && <span className="text-textMuted ml-1">{post.author.role}</span>}
                    </div>
                </div>
            )}
        </Link>
    );
}

/* ─── Scrollable filter tabs ─── */


/* ─── Main page ─── */

export default function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [heroData, setHeroData] = useState(null);
    const searchInputRef = useRef(null);

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [searchInput, setSearchInput] = useState(searchQuery);
    const debounceRef = useRef(null);

    const isFirstPage = currentPage === 1 && !activeCategory && !searchQuery;

    useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);
    useEffect(() => { return () => clearTimeout(debounceRef.current); }, []);
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage, activeCategory]);

    const updateParams = useCallback((updates) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value) next.set(key, value); else next.delete(key);
            });
            if (!('page' in updates)) next.delete('page');
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handleSearchInput = (value) => {
        setSearchInput(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => updateParams({ q: value || '' }), 350);
    };
    const clearSearch = () => { setSearchInput(''); updateParams({ q: '' }); searchInputRef.current?.focus(); };
    const handleCategoryClick = (slug) => updateParams({ category: slug === activeCategory ? '' : slug });

    useEffect(() => { client.fetch(blogCategoriesQuery).then(setCategories).catch(console.error); }, []);

    useEffect(() => {
        client.fetch(blogHeroPostsQuery).then((hero) => {
            if (hero?.length >= 2) setHeroData({ featured: hero[0], sidebar: hero.slice(1, 4) });
        }).catch(console.error);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const perPage = currentPage === 1 ? POSTS_PER_PAGE_ONE : POSTS_PER_PAGE;
                const start = currentPage === 1 ? 0 : POSTS_PER_PAGE_ONE + (currentPage - 2) * POSTS_PER_PAGE;
                const end = start + perPage;
                let postsQuery, countQuery, params;
                if (activeCategory && searchQuery) {
                    postsQuery = blogPostsSearchByCategoryQuery; countQuery = blogPostsSearchByCategoryCountQuery;
                    params = { start, end, categorySlug: activeCategory, searchQuery: `${searchQuery}*` };
                } else if (activeCategory) {
                    postsQuery = blogPostsByCategoryQuery; countQuery = blogPostsCountByCategoryQuery;
                    params = { start, end, categorySlug: activeCategory };
                } else if (searchQuery) {
                    postsQuery = blogPostsSearchQuery; countQuery = blogPostsSearchCountQuery;
                    params = { start, end, searchQuery: `${searchQuery}*` };
                } else {
                    postsQuery = blogPostsUnionQuery; countQuery = blogPostsCountUnionQuery;
                    params = { start, end };
                }
                const [fetchedPosts, totalCount] = await Promise.all([client.fetch(postsQuery, params), client.fetch(countQuery, params)]);
                if (isMounted) {
                    setPosts(fetchedPosts);
                    const remaining = Math.max(totalCount - POSTS_PER_PAGE_ONE, 0);
                    setTotalPages(totalCount <= POSTS_PER_PAGE_ONE ? 1 : 1 + Math.ceil(remaining / POSTS_PER_PAGE));
                }
            } catch (error) { console.error('Error fetching blog posts:', error); }
            finally { if (isMounted) setLoading(false); }
        };
        fetchPosts();
        return () => { isMounted = false; };
    }, [currentPage, activeCategory, searchQuery]);

    const activeCategoryName = categories.find((c) => c.slug?.current === activeCategory)?.name;
    const gridPosts = posts.filter((p) => p.slug?.current);

    return (
        <div className="min-h-screen bg-surface text-text pt-28 pb-20">
            <Seo
                title="Blog: AI Marketing, Automation & Growth Insights | RSL/A"
                description="Practical guides on GoHighLevel, Claude AI, marketing automation, local SEO, and AI-powered growth strategies."
                keywords="AI automation blog, marketing automation insights, business AI strategies"
                canonical="https://rsla.io/blog"
                jsonLd={{
                    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Blog', url: 'https://rsla.io/blog',
                    description: 'Insights on marketing automation, AI systems, local SEO, and business growth strategies from RSL/A.',
                    isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: 'https://rsla.io' },
                    mainEntity: { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://rsla.io/blog/${p.slug?.current || p.slug}`, name: p.title })) },
                }}
            />

            {/* ════════════ SECTION 1: HERO ════════════ */}
            {isFirstPage && heroData && (
                <section className="max-w-[1160px] mx-auto px-6 md:px-8 pt-4 mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-[17px]">
                        {/* Featured post — left column (58%) */}
                        <Link to={`/blog/${heroData.featured.slug.current}`} className="group block lg:w-[58%] shrink-0">
                            {heroData.featured.featuredImage?.asset && (
                                <div className="rounded-md overflow-hidden mb-5">
                                    <img
                                        src={urlForImage(heroData.featured.featuredImage)?.width(1200).height(760).url()}
                                        alt={heroData.featured.featuredImage.alt || heroData.featured.title}
                                        className="w-full aspect-[671/426] object-cover group-hover:scale-[1.02] transition-transform duration-lg ease-out-smooth"
                                    />
                                </div>
                            )}
                            <h2 className="text-[28px] md:text-[36px] font-sans font-extrabold text-text mb-3 tracking-tight leading-[1.15] group-hover:text-accent transition-colors">
                                {heroData.featured.title}
                            </h2>
                            {heroData.featured.excerpt && (
                                <p className="font-sans text-base text-textMuted line-clamp-2 mb-4 leading-relaxed">{heroData.featured.excerpt}</p>
                            )}
                            <div className="flex items-center gap-2 font-sans text-sm text-textMuted flex-wrap">
                                {heroData.featured.author?.image?.asset && (
                                    <img src={urlForImage(heroData.featured.author.image)?.width(48).height(48).url()} alt={heroData.featured.author.name} className="w-7 h-7 rounded-full object-cover" />
                                )}
                                <span className="font-semibold text-text">{heroData.featured.author?.name}</span>
                                {heroData.featured.author?.role && <span className="text-textMuted">{heroData.featured.author.role}</span>}
                                <span className="text-textLight">&middot;</span>
                                <time>{new Date(heroData.featured.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                                {heroData.featured.readingTime && (
                                    <><span className="text-textLight">&middot;</span><span>{heroData.featured.readingTime} min</span></>
                                )}
                            </div>
                        </Link>

                        {/* Right column (42%) — trending banner + sidebar posts */}
                        <div className="lg:w-[42%] flex flex-col gap-0">
                            {/* Trending banner */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-md px-5 py-4 mb-[17px] flex items-center gap-3">
                                <div>
                                    <p className="font-sans font-extrabold text-white text-xl leading-[1.1] tracking-tight">Trending</p>
                                    <p className="font-sans font-extrabold text-white/70 text-xl leading-[1.1] tracking-tight">topics to read</p>
                                </div>
                                <img src="/images/icons/arrow-up-right.svg" alt="" className="w-7 h-7 ml-auto brightness-0 invert opacity-60" />
                            </div>

                            {/* Sidebar posts */}
                            <div className="flex flex-col flex-1">
                                {heroData.sidebar.map((post, i) => {
                                    const thumbUrl = post.featuredImage?.asset
                                        ? urlForImage(post.featuredImage)?.width(360).height(228).url() : '';
                                    const isLast = i === heroData.sidebar.length - 1;
                                    return (
                                        <Link
                                            key={post._id}
                                            to={`/blog/${post.slug.current}`}
                                            className={`group flex gap-[18px] pb-[17px] ${!isLast ? 'border-b border-black/10 mb-[17px]' : ''}`}
                                        >
                                            {thumbUrl && (
                                                <img src={thumbUrl} alt={post.featuredImage?.alt || post.title}
                                                    className="w-[154px] h-[98px] rounded-md object-cover shrink-0 bg-surfaceAlt" loading="lazy" />
                                            )}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="font-sans font-bold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors tracking-tight mb-2">
                                                    {post.title}
                                                </h4>
                                                {post.categories?.[0] && (
                                                    <span className="inline-block w-fit font-sans text-sm text-accent border border-accent/30 px-2 py-0.5 rounded font-medium mb-1.5">
                                                        {post.categories[0].name}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-textMuted font-sans">
                                                    <time>
                                                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </time>
                                                    {post.readingTime && (
                                                        <><span className="text-textLight">&middot;</span><span>{post.readingTime} min read</span></>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════ SECTION 2: ALL ARTICLES ════════════ */}
            <section className="pt-[35px] pb-[30px]">
                <div className="max-w-[1160px] mx-auto px-6 md:px-8">
                    {isFirstPage && (
                        <h2 className="font-sans font-extrabold text-[22px] text-text tracking-tight mb-4">All Articles</h2>
                    )}

                    {!isFirstPage && (
                        <header className="mb-8 text-center pt-6">
                            <h1 className="text-3xl md:text-5xl font-sans font-bold text-text mb-3 tracking-tight leading-[1.1]">Blog</h1>
                            <p className="font-sans text-lg text-textMuted max-w-2xl mx-auto leading-relaxed">
                                Insights on marketing automation, AI systems, local SEO, and strategies to scale your operations.
                            </p>
                        </header>
                    )}

                    {/* Search + category dropdown row */}
                    <div className="mb-8 flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                            <input
                                ref={searchInputRef} type="text" value={searchInput}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-9 min-h-[44px] rounded-lg bg-surfaceAlt border border-accent-border text-text font-sans text-base placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                            />
                            {searchInput && (
                                <button onClick={clearSearch} className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-textMuted hover:text-text transition-colors" aria-label="Clear search">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {categories.length > 0 && (
                            <div className="relative shrink-0">
                                <select
                                    value={activeCategory}
                                    onChange={(e) => handleCategoryClick(e.target.value)}
                                    className="appearance-none w-full sm:w-auto min-h-[44px] pl-4 pr-10 rounded-lg bg-surfaceAlt border border-accent-border text-text font-sans text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                                >
                                    <option value="">All Topics</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.slug?.current}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none rotate-90" />
                            </div>
                        )}
                        {(activeCategory || searchQuery) && !loading && (
                            <div className="font-sans text-sm text-textMuted">
                                {posts.length} result{posts.length !== 1 ? 's' : ''}
                                {activeCategoryName && <> in <span className="text-accent font-medium">{activeCategoryName}</span></>}
                                {searchQuery && <> for "<span className="text-accent font-medium">{searchQuery}</span>"</>}
                                <button onClick={() => { setSearchInput(''); setSearchParams({}, { replace: true }); }} className="ml-2 text-accent hover:underline cursor-pointer">Clear</button>
                            </div>
                        )}
                    </div>

                    {/* Post grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[19px] gap-y-[50px] mb-12">
                            {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                        </div>
                    ) : gridPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-sans text-lg text-textMuted mb-4">{searchQuery || activeCategory ? 'No posts match your filters.' : 'No articles yet.'}</p>
                            {(searchQuery || activeCategory) && (
                                <button onClick={() => { setSearchInput(''); setSearchParams({}, { replace: true }); }} className="font-sans text-base text-accent hover:underline cursor-pointer">Clear filters</button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[19px] gap-y-[50px] mb-12">
                                {gridPosts.flatMap((post, i) => {
                                    const items = [];
                                    if (i === 1 && currentPage === 1 && !searchQuery && !activeCategory) {
                                        items.push(<NewsletterCard key="newsletter" />);
                                    }
                                    items.push(<PostCard key={post._id} post={post} />);
                                    return items;
                                })}
                            </div>
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-6 font-sans text-base py-4 border-t border-accent-border">
                                    <button onClick={() => updateParams({ page: currentPage > 2 ? String(currentPage - 1) : '' })} disabled={currentPage === 1}
                                        className="px-3 py-2 hover:text-accent disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default">&larr; Prev</button>
                                    <span className="text-textMuted tabular-nums">{currentPage} / {totalPages}</span>
                                    <button onClick={() => updateParams({ page: String(currentPage + 1) })} disabled={currentPage === totalPages}
                                        className="px-3 py-2 hover:text-accent disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default">Next &rarr;</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
