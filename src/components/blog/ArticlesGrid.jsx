import { Link } from 'react-router-dom';
import PostCard from './PostCard';

/*
 * A titled block of cards (Clay's BlogLatest and ArticlesGrid).
 * layout "latest": two wide cards, then narrow ones.
 * layout "category": one wide card (8 of 12 columns) beside a narrow one, then narrow ones.
 */

export function ViewLink({ to, children, tone = 'light' }) {
    return (
        <Link to={to} className={`group inline-flex items-center gap-2 text-[18px] md:text-[22px] leading-[1.35] ${tone === 'dark' ? 'text-white' : 'text-blog-ink'}`}>
            <span className="link-draw">{children}</span>
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blog-arrow transition-[transform,color] duration-lg ease-out-expo group-hover:translate-x-1.5 group-hover:text-current">
                <path d="M7 16h18M19 10l6 6-6 6" />
            </svg>
        </Link>
    );
}

export function SectionHead({ title, blurb, tone = 'light', as = 'h2' }) {
    const Heading = as;
    const color = tone === 'dark' ? 'text-white' : 'text-blog-ink';
    return (
        <div className={`max-w-[852px] ${color}`}>
            <Heading className="font-bold text-[36px] leading-[1.1] md:text-[52px] tracking-[-0.02em]" style={{ textWrap: 'balance' }}>{title}</Heading>
            {blurb && <p className="mt-4 md:mt-5 text-[18px] md:text-[22px] leading-[1.35]">{blurb}</p>}
        </div>
    );
}

export default function ArticlesGrid({ title, blurb, posts = [], layout = 'category', link, showTag = false, showUpdated = true, headingLevel = 'h2' }) {
    if (!posts.length) return null;
    const spanFor = (i) => {
        if (layout === 'latest') return i < 2 ? 'md:col-span-6' : 'md:col-span-6 lg:col-span-4';
        return i === 0 ? 'md:col-span-8' : 'md:col-span-6 lg:col-span-4';
    };
    const sizeFor = (i) => (layout === 'latest' ? (i < 2 ? 'wide' : 'narrow') : (i === 0 ? 'wide' : 'narrow'));

    return (
        <section>
            <SectionHead title={title} blurb={blurb} as={headingLevel} />
            <ul className={`grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10 md:gap-y-14 ${blurb ? 'mt-12 md:mt-14' : 'mt-10 md:mt-14'}`}>
                {posts.map((post, i) => (
                    <li key={post._id} className={`col-span-1 ${spanFor(i)}`}>
                        <PostCard post={post} size={sizeFor(i)} showTag={showTag} showUpdated={showUpdated} />
                    </li>
                ))}
            </ul>
            {link && (
                <div className="mt-12 md:mt-[50px] flex justify-center">
                    <ViewLink to={link.to}>{link.label}</ViewLink>
                </div>
            )}
        </section>
    );
}
