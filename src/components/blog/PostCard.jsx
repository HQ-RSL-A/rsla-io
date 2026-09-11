import { Link } from 'react-router-dom';
import { urlForImage } from '@/sanity/lib/image';
import { postHref, formatBlogDate, hasUpdate } from './blogShared';

/*
 * Clay's article card: bare image, tag, bold title, muted date line.
 * No border, no shadow, no radius, no excerpt. Image zooms 7% on hover.
 */

const SIZES = {
    wide: {
        img: [1200, 600],
        aspect: 'aspect-[327/182] md:aspect-[2/1]',
        title: 'mt-2 text-[24px] leading-[1.25] md:text-[30px] md:leading-[1.2]',
    },
    narrow: {
        img: [800, 400],
        aspect: 'aspect-[327/182] md:aspect-[2/1]',
        title: 'mt-2 text-[22px] leading-[1.35] md:text-[24px] md:leading-[1.4]',
    },
    related: {
        img: [900, 828],
        aspect: 'aspect-[311/286] md:aspect-[451/415]',
        title: 'mt-4 pr-4 text-[22px] leading-[1.35] md:text-[24px] md:leading-[1.4]',
    },
};

export function Dot() {
    return <span aria-hidden="true" className="inline-block w-[2px] h-[2px] bg-current mx-2.5 align-middle" />;
}

export function PostDateLine({ post, showUpdated = false, className = '' }) {
    const created = formatBlogDate(post.publishedAt);
    const updated = showUpdated && hasUpdate(post) ? formatBlogDate(post.updatedAt) : null;
    return (
        <div className={`text-[16px] leading-[1.4] text-blog-muted ${className}`}>
            <span>Created: <time dateTime={post.publishedAt}>{created}</time></span>
            {updated && (<><Dot /><span>Updated: <time dateTime={post.updatedAt}>{updated}</time></span></>)}
            {post.readingTime ? (<><Dot /><span className="whitespace-nowrap">{post.readingTime} min read</span></>) : null}
        </div>
    );
}

export default function PostCard({ post, size = 'narrow', showTag = true, showUpdated = false, eager = false, className = '' }) {
    const cfg = SIZES[size] || SIZES.narrow;
    const [w, h] = cfg.img;
    const builder = post.featuredImage?.asset ? urlForImage(post.featuredImage) : null;
    const src = builder ? builder.width(w).height(h).fit('crop').url() : '';
    const srcSet = builder ? `${src} 1x, ${builder.width(w * 2).height(h * 2).fit('crop').url()} 2x` : undefined;
    const tag = post.category?.name || post.categories?.[0]?.name;

    return (
        <Link to={postHref(post)} className={`group block text-blog-ink ${className}`}>
            <div className={`overflow-hidden bg-blog-card ${cfg.aspect}`}>
                {src && (
                    <img
                        src={src}
                        srcSet={srcSet}
                        alt={post.featuredImage?.alt || post.title}
                        width={w}
                        height={h}
                        loading={eager ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-zoom-slow ease-out-expo group-hover:scale-[1.07]"
                    />
                )}
            </div>
            {showTag && tag && (
                <p className="mt-3 text-[16px] leading-[1.4] text-blog-muted">{tag}</p>
            )}
            <h3 className={`font-bold tracking-[-0.02em] text-blog-ink ${cfg.title}`} style={{ textWrap: 'balance' }}>
                {post.title}
            </h3>
            <PostDateLine post={post} showUpdated={showUpdated} className="mt-3" />
        </Link>
    );
}
