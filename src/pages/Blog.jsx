import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown } from 'lucide-react';
import { client } from '../sanity/lib/client';
import {
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
import { TextAnimate } from '@/components/ui/text-animate';

const POSTS_PER_PAGE = 9;

export default function Blog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const searchInputRef = useRef(null);

    // Read state from URL
    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    // Local search input (debounced before writing to URL)
    const [searchInput, setSearchInput] = useState(searchQuery);
    const debounceRef = useRef(null);

    // Sync searchInput when URL changes externally (e.g. back button)
    useEffect(() => {
        setSearchInput(searchQuery);
    }, [searchQuery]);

    // Clean up debounce timer on unmount
    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    // Update URL params helper
    const updateParams = useCallback((updates) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    next.set(key, value);
                } else {
                    next.delete(key);
                }
            });
            // Reset page to 1 when filters change (unless page is being set explicitly)
            if (!('page' in updates)) {
                next.delete('page');
            }
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    // Debounced search
    const handleSearchInput = (value) => {
        setSearchInput(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updateParams({ q: value || '' });
        }, 350);
    };

    const clearSearch = () => {
        setSearchInput('');
        updateParams({ q: '' });
        searchInputRef.current?.focus();
    };

    const handleCategoryClick = (slug) => {
        updateParams({ category: slug === activeCategory ? '' : slug });
    };

    // Fetch categories once
    useEffect(() => {
        client.fetch(blogCategoriesQuery).then(setCategories).catch(console.error);
    }, []);

    // Fetch posts when filters/page change
    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const start = (currentPage - 1) * POSTS_PER_PAGE;
                const end = start + POSTS_PER_PAGE;
                const hasCategory = !!activeCategory;
                const hasSearch = !!searchQuery;

                let postsQuery, countQuery, params;

                if (hasCategory && hasSearch) {
                    postsQuery = blogPostsSearchByCategoryQuery;
                    countQuery = blogPostsSearchByCategoryCountQuery;
                    params = { start, end, categorySlug: activeCategory, searchQuery: `${searchQuery}*` };
                } else if (hasCategory) {
                    postsQuery = blogPostsByCategoryQuery;
                    countQuery = blogPostsCountByCategoryQuery;
                    params = { start, end, categorySlug: activeCategory };
                } else if (hasSearch) {
                    postsQuery = blogPostsSearchQuery;
                    countQuery = blogPostsSearchCountQuery;
                    params = { start, end, searchQuery: `${searchQuery}*` };
                } else {
                    postsQuery = blogPostsUnionQuery;
                    countQuery = blogPostsCountUnionQuery;
                    params = { start, end };
                }

                const [fetchedPosts, totalCount] = await Promise.all([
                    client.fetch(postsQuery, params),
                    client.fetch(countQuery, params),
                ]);

                if (isMounted) {
                    setPosts(fetchedPosts);
                    setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
                }
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPosts();

        return () => { isMounted = false; };
    }, [currentPage, activeCategory, searchQuery]);

    const activeCategoryName = categories.find((c) => c.slug?.current === activeCategory)?.name;

    return (
        <div className="min-h-screen bg-surface text-text pt-36 pb-20 px-6 md:px-12 relative overflow-hidden">
            <Seo
                title="Blog: AI Marketing, Automation & Growth Insights | RSL/A"
                description="Practical guides on GoHighLevel, Claude AI, marketing automation, local SEO, and AI-powered growth strategies. Written by practitioners, not theorists."
                keywords="AI automation blog, marketing automation insights, business AI strategies, AI for small business"
                canonical="https://rsla.io/blog"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Blog',
                    url: 'https://rsla.io/blog',
                    description: 'Insights on marketing automation, AI systems, local SEO, and business growth strategies from RSL/A.',
                    isPartOf: { '@type': 'WebSite', name: 'RSL/A', url: 'https://rsla.io' },
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: posts.map((p, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            url: `https://rsla.io/blog/${p.slug?.current || p.slug}`,
                            name: p.title,
                        })),
                    },
                }}
            />
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-sans font-bold text-text mb-4 tracking-tight leading-[1.1]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            Our blog.
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-textMuted max-w-2xl mx-auto text-lg leading-relaxed">
                        Insights on marketing automation, AI systems, local SEO, and strategies to scale your operations without overhead.
                    </p>
                </header>

                {/* Filter bar */}
                <div className="mb-10 flex flex-col gap-4">
                    {/* Search + Category row */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto w-full">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchInput}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-11 pr-10 min-h-[44px] rounded-full bg-surfaceAlt border border-accent-border text-text font-sans text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                            />
                            {searchInput && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-textMuted hover:text-text transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Category dropdown */}
                        {categories.length > 0 && (
                            <div className="relative shrink-0 w-full sm:w-auto">
                                <select
                                    value={activeCategory}
                                    onChange={(e) => handleCategoryClick(e.target.value)}
                                    className="appearance-none w-full sm:w-auto min-h-[44px] pl-4 pr-10 rounded-full bg-surfaceAlt border border-accent-border text-text font-sans text-sm uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                                >
                                    <option value="">All Topics</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.slug?.current}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                            </div>
                        )}
                    </div>

                    {/* Active filter indicator */}
                    {(activeCategory || searchQuery) && !loading && (
                        <div className="text-center font-sans text-sm text-textMuted">
                            {posts.length} result{posts.length !== 1 ? 's' : ''}
                            {activeCategoryName && <> in <span className="text-accent">{activeCategoryName}</span></>}
                            {searchQuery && <> for "<span className="text-accent">{searchQuery}</span>"</>}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="font-sans text-textMuted mb-4">
                            {searchQuery || activeCategory
                                ? 'No posts match your filters.'
                                : 'No intel logged yet. Check back soon.'}
                        </p>
                        {(searchQuery || activeCategory) && (
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchParams({}, { replace: true });
                                }}
                                className="font-sans text-sm text-accent hover:underline cursor-pointer inline-flex items-center min-h-[44px] px-4"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {posts.filter(p => p.slug?.current).map((post) => {
                                const imageUrl = post.featuredImage?.asset ? urlForImage(post.featuredImage)?.width(600).height(400).url() : '';

                                return (
                                    <Link
                                        key={post._id}
                                        to={`/blog/${post.slug.current}`}
                                        className="group flex flex-col h-full bg-surfaceAlt rounded-2xl border border-accent-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-md ease-out-smooth"
                                    >
                                        {imageUrl && (
                                            <div className="relative aspect-[3/2] overflow-hidden bg-surfaceAlt">
                                                <img
                                                    src={imageUrl}
                                                    alt={post.featuredImage?.alt || post.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-image-zoom ease-out-smooth scale-100 group-hover:scale-[1.03]"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 flex flex-col flex-grow">
                                            {(post.categories?.length > 0 || post.featured) && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.featured && (
                                                        <span className="font-sans text-sm uppercase tracking-wider text-text border border-text/20 bg-text/5 px-2 py-1 rounded-sm">
                                                            Pinned
                                                        </span>
                                                    )}
                                                    {post.categories?.slice(0, 2).map((category) => (
                                                        <span key={category.name} className="font-sans text-sm uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                                                            {category.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <h2 className="font-sans font-bold text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="font-sans text-sm text-textMuted line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between font-sans text-sm text-textMuted mt-auto pt-4 border-t border-accent-border">
                                                <span>{post.author?.name || 'SYS.ADMIN'}</span>
                                                <time>
                                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: '2-digit',
                                                    }).replace(/\//g, '.')}
                                                </time>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 font-sans text-sm">
                                <button
                                    onClick={() => updateParams({ page: currentPage > 2 ? String(currentPage - 1) : '' })}
                                    disabled={currentPage === 1}
                                    className="px-4 min-h-[44px] hover:text-accent disabled:opacity-30 disabled:hover:text-text transition-colors"
                                >
                                    &larr; PREV
                                </button>
                                <span className="text-textMuted">
                                    PG {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => updateParams({ page: String(currentPage + 1) })}
                                    disabled={currentPage === totalPages}
                                    className="px-4 min-h-[44px] hover:text-accent disabled:opacity-30 disabled:hover:text-text transition-colors"
                                >
                                    NEXT &rarr;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
