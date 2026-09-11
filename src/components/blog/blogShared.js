/*
 * Shared bits for the blog pages (/blog, /blog/archive, /blog/:slug).
 * Layout and type follow the clay.global/blog reference (Rahul, 2026-09-11:
 * the blog takes everything from Clay except the Satoshi font and the logo).
 */

// Clay's container: 1400px of content at wide viewports, 75px side gutters
// below that (1290px at 1440), 24px on phones.
export const BLOG_CONTAINER = 'mx-auto w-full max-w-[1550px] px-6 md:px-[75px]';

export function postSlug(post) {
    const s = post?.slug;
    return typeof s === 'string' ? s : s?.current || '';
}

export function postHref(post) {
    return `/blog/${postSlug(post)}`;
}

// "Sep 3, 2026". UTC so a date-only value like "2026-03-13" never slips a day
// in US time zones.
export function formatBlogDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// True when the post carries an editorial update date on a later day than
// it was published.
export function hasUpdate(post) {
    if (!post?.updatedAt || !post?.publishedAt) return false;
    return formatBlogDate(post.updatedAt) !== formatBlogDate(post.publishedAt)
        && new Date(post.updatedAt) > new Date(post.publishedAt);
}

// Fallback blurbs for category sections that have no description in Sanity.
export function categoryBlurb(category) {
    if (category?.description) return category.description;
    return `Guides on ${category?.name || 'the work'}, from the work we do for clients.`;
}

// The hero carousel shows editor's picks (featured == true). When fewer than
// five are picked, fill with the newest post of each section, then the
// newest posts overall, without repeats.
export function buildHeroPosts({ featured = [], sections = [], latest = [] }, limit = 5) {
    const seen = new Set();
    const out = [];
    const push = (p) => {
        if (!p || seen.has(p._id) || out.length >= limit) return;
        seen.add(p._id);
        out.push(p);
    };
    featured.forEach(push);
    sections.forEach((s) => push(s.posts?.[0]));
    latest.forEach(push);
    return out;
}
