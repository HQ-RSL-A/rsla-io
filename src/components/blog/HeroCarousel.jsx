import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { urlForImage } from '@/sanity/lib/image';
import { postHref } from './blogShared';

/*
 * The dark hero carousel on /blog (Clay's BlogHero). A native scroll-snap
 * track that bleeds to the right edge of the viewport; the arrows in the
 * description row scroll it one slide at a time. Touch swipes work as is.
 */

const GAP = 12;

function ArrowIcon({ dir }) {
    const d = dir === 'left' ? 'M38 14H4M16 3 4 14l12 11' : 'M2 14h34M24 3l12 11-12 11';
    return (
        <svg viewBox="0 0 40 28" width="40" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={d} />
        </svg>
    );
}

export default function HeroCarousel({ posts = [], description }) {
    const trackRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(posts.length <= 1);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return undefined;
        let raf = 0;
        const update = () => {
            setAtStart(el.scrollLeft <= 1);
            setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
        };
        const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
        update();
        el.addEventListener('scroll', onScroll, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); cancelAnimationFrame(raf); };
    }, [posts.length]);

    const step = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const slide = el.querySelector('[data-slide]');
        const width = slide ? slide.getBoundingClientRect().width + GAP : el.clientWidth;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollBy({ left: dir * width, behavior: reduce ? 'auto' : 'smooth' });
    };

    const btn = 'inline-flex h-10 w-10 items-center justify-center text-white transition-opacity duration-200 hover:opacity-40 disabled:opacity-20 disabled:pointer-events-none active:scale-[0.96]';

    return (
        <div>
            <div className="flex items-end justify-between gap-6 flex-wrap">
                {description && (
                    <p className="max-w-[1032px] text-[22px] leading-[1.4] md:text-[28px] tracking-[-0.01em] text-white">{description}</p>
                )}
                {posts.length > 1 && (
                    <div className="ml-auto flex items-center gap-[30px]">
                        <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous post" className={btn}><ArrowIcon dir="left" /></button>
                        <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next post" className={btn}><ArrowIcon dir="right" /></button>
                    </div>
                )}
            </div>

            <div
                ref={trackRef}
                className="mt-10 md:mt-[74px] flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
                style={{ marginRight: 'calc(50% - 50vw)', paddingRight: 'calc(50vw - 50%)' }}
            >
                {posts.map((post, i) => {
                    const builder = post.featuredImage?.asset ? urlForImage(post.featuredImage) : null;
                    const src = builder ? builder.width(1200).height(760).fit('crop').url() : '';
                    const srcSet = builder ? `${src} 1x, ${builder.width(1800).height(1140).fit('crop').url()} 2x` : undefined;
                    const tag = post.category?.name;
                    return (
                        <Link
                            key={post._id}
                            to={postHref(post)}
                            data-slide
                            className="group relative block shrink-0 snap-start overflow-hidden w-[91%] sm:w-[83%] lg:w-[67.4%] aspect-[311/456] sm:aspect-[628/346] lg:aspect-[1170/620] bg-blog-dark"
                        >
                            {src && (
                                <img
                                    src={src}
                                    srcSet={srcSet}
                                    alt={post.featuredImage?.alt || post.title}
                                    width="1200"
                                    height="760"
                                    loading={i < 2 ? 'eager' : 'lazy'}
                                    fetchPriority={i === 0 ? 'high' : undefined}
                                    decoding="async"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-zoom-slow ease-out-expo group-hover:scale-[1.07]"
                                />
                            )}
                            <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[linear-gradient(22deg,rgba(0,0,0,0.65)_8.43%,rgba(0,0,0,0)_60%)] opacity-70 transition-opacity duration-zoom-slow ease-out-expo group-hover:opacity-100" />
                            <div className="absolute z-[2] left-4 right-4 bottom-4 md:left-7 md:right-[22%] md:bottom-[22px] lg:left-8 lg:right-[41%] lg:bottom-7 text-white">
                                {tag && <span className="block mb-2 text-[14px] md:text-[16px] leading-[1.4]">{tag}</span>}
                                <p className="font-bold text-[24px] leading-[1.25] md:text-[32px] md:leading-[1.2] tracking-[-0.02em]" style={{ textWrap: 'balance' }}>{post.title}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
