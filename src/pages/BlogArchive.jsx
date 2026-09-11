import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { client } from '../sanity/lib/client';
import {
    blogPostsUnionQuery,
    blogPostsCountUnionQuery,
    blogCategoriesQuery,
    blogCategoryNavQuery,
    blogPostsByCategoryQuery,
    blogPostsCountByCategoryQuery,
    blogPostsSearchQuery,
    blogPostsSearchCountQuery,
    blogPostsSearchByCategoryQuery,
    blogPostsSearchByCategoryCountQuery,
} from '../sanity/lib/queries';
import Seo from '../components/Seo';
import { BLOG_CONTAINER, postSlug } from '@/components/blog/blogShared';
import BlogCategoryStrip from '@/components/blog/BlogCategoryStrip';
import PostCard from '@/components/blog/PostCard';
import { SectionHead } from '@/components/blog/ArticlesGrid';
import BlogCardSkeleton from '@/components/skeletons/BlogCardSkeleton';

/*
 * /blog/archive: every post, newest first, with search, a topic filter, and
 * pages of twelve. This is the old /blog listing logic in the Clay card grid;
 * ?category=, ?q= and ?page= keep working here.
 */

const POSTS_PER_PAGE = 12;

const FIELD = 'w-full h-12 bg-transparent border-0 border-b border-blog-ink/30 px-0 text-[18px] leading-[1.4] text-blog-ink placeholder:text-blog-muted outline-none focus:border-blog-ink transition-[border-color] duration-sm ease-out-smooth rounded-none';

export default function BlogArchive() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nav, setNav] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const searchInputRef = useRef(null);
    const debounceRef = useRef(null);

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('q') || '';
    const currentPage = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);
    const [searchInput, setSearchInput] = useState(searchQuery);

    useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);
    useEffect(() => () => clearTimeout(debounceRef.current), []);
    useEffect(() => { window.scrollTo({ top: 0 }); }, [currentPage, activeCategory]);

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
    const clearAll = () => { setSearchInput(''); setSearchParams({}, { replace: true }); };

    useEffect(() => {
        client.fetch(blogCategoriesQuery).then(setCategories).catch(console.error);
        client.fetch(blogCategoryNavQuery).then(setNav).catch(console.error);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const start = (currentPage - 1) * POSTS_PER_PAGE;
                const end = start + POSTS_PER_PAGE;
                let postsQuery; let countQuery; let params;
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
                const [fetched, count] = await Promise.all([client.fetch(postsQuery, params), client.fetch(countQuery, params)]);
                if (isMounted) { setPosts(fetched); setTotalCount(count); }
            } catch (error) {
                console.error('Error fetching blog archive:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchPosts();
        return () => { isMounted = false; };
    }, [currentPage, activeCategory, searchQuery]);

    const totalPages = Math.max(Math.ceil(totalCount / POSTS_PER_PAGE), 1);
    const activeCategoryName = categories.find((c) => c.slug?.current === activeCategory)?.name;
    const gridPosts = posts.filter((p) => postSlug(p));
    const filtered = Boolean(activeCategory || searchQuery);

    const title = activeCategoryName || 'Archive';
    const blurb = activeCategoryName
        ? `Every ${activeCategoryName} post, newest first.`
        : 'Every post we have published, newest first.';

    return (
        <div className="bg-white text-blog-ink pt-[88px] pb-20 md:pb-[100px]">
            <Seo
                title={activeCategoryName ? `${activeCategoryName} articles | RSL/A` : 'Blog archive | RSL/A'}
                description={activeCategoryName ? `Every RSL/A post on ${activeCategoryName}, newest first.` : 'Every RSL/A post on GoHighLevel, Claude, automation, and local SEO, newest first.'}
                canonical="https://rsla.io/blog/archive"
                jsonLd={{
                    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Blog archive', url: 'https://rsla.io/blog/archive',
                    isPartOf: { '@id': 'https://rsla.io/#website' },
                    mainEntity: { '@type': 'ItemList', itemListElement: gridPosts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://rsla.io/blog/${postSlug(p)}`, name: p.title })) },
                }}
            />

            <BlogCategoryStrip categories={nav} active={activeCategory} />

            <div className={BLOG_CONTAINER}>
                <div className="mt-[60px] md:mt-[95px]">
                    <SectionHead as="h1" title={title} blurb={blurb} />
                </div>

                {/* Search + topic */}
                <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-5 sm:gap-6 max-w-[852px]">
                    <div className="relative flex-1">
                        <label htmlFor="archive-search" className="sr-only">Search articles</label>
                        <input
                            ref={searchInputRef}
                            id="archive-search"
                            type="search"
                            value={searchInput}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            placeholder="Search articles"
                            className={`${FIELD} pr-10`}
                        />
                        {searchInput && (
                            <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center text-blog-muted hover:text-blog-ink transition-colors duration-sm">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {categories.length > 0 && (
                        <div className="sm:w-[260px]">
                            <label htmlFor="archive-topic" className="sr-only">Topic</label>
                            <select
                                id="archive-topic"
                                value={activeCategory}
                                onChange={(e) => updateParams({ category: e.target.value })}
                                className={`${FIELD} appearance-none cursor-pointer bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2306070A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_center] pr-8`}
                            >
                                <option value="">All topics</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.slug?.current}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {filtered && !loading && (
                    <p className="mt-5 text-[16px] leading-[1.4] text-blog-muted">
                        {totalCount} result{totalCount !== 1 ? 's' : ''}
                        {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
                        {activeCategoryName && <> in {activeCategoryName}</>}
                        <button type="button" onClick={clearAll} className="ml-3 text-blog-ink link-draw cursor-pointer">Clear</button>
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <ul className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-y-14">
                        {Array.from({ length: 6 }).map((_, i) => <li key={i} className="md:col-span-6 lg:col-span-4"><BlogCardSkeleton /></li>)}
                    </ul>
                ) : gridPosts.length === 0 ? (
                    <div className="mt-14 py-16">
                        <p className="text-[18px] leading-[27px]">{filtered ? 'No posts match your filters.' : 'No articles yet.'}</p>
                        {filtered && (
                            <button type="button" onClick={clearAll} className="mt-3 text-[18px] link-draw cursor-pointer">Clear filters</button>
                        )}
                    </div>
                ) : (
                    <>
                        <ul className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-y-14">
                            {gridPosts.map((post) => (
                                <li key={post._id} className="md:col-span-6 lg:col-span-4">
                                    <PostCard post={post} size="narrow" showTag showUpdated />
                                </li>
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <nav aria-label="Pagination" className="mt-16 md:mt-20 flex items-center justify-center gap-8 text-[18px] leading-[1.4]">
                                <button type="button" onClick={() => updateParams({ page: currentPage > 2 ? String(currentPage - 1) : '' })} disabled={currentPage === 1}
                                    className="link-draw disabled:opacity-30 disabled:pointer-events-none cursor-pointer">Prev</button>
                                <span className="text-blog-muted tabular-nums">{currentPage} / {totalPages}</span>
                                <button type="button" onClick={() => updateParams({ page: String(currentPage + 1) })} disabled={currentPage === totalPages}
                                    className="link-draw disabled:opacity-30 disabled:pointer-events-none cursor-pointer">Next</button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
