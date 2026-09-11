import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * In-content links from a post or case study into the service pages it
 * supports. Plain sentence, keyword anchors, no card chrome.
 * variant "editorial" is the blog article style (square, Clay's gray box).
 */
export default function RelatedServices({ links, intro = 'If this is the problem you are solving, we do the work:', variant = 'default' }) {
    if (!links || links.length === 0) return null;
    if (variant === 'editorial') {
        return (
            <aside className="mt-14" aria-label="Related services">
                <div className="bg-blog-card p-6 md:p-8 text-blog-ink">
                    <p className="font-bold text-[18px] leading-[1.4] mb-3">{intro}</p>
                    <ul className="flex flex-col gap-2">
                        {links.map((l) => (
                            <li key={l.to}>
                                <Link to={l.to} className="group inline-flex items-center gap-2 text-[18px] leading-[27px] min-h-[44px]">
                                    <span className="link-draw">{l.label}</span>
                                    <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="text-blog-arrow transition-[transform,color] duration-lg ease-out-expo group-hover:translate-x-1 group-hover:text-current" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        );
    }
    return (
        <aside className="max-w-3xl mx-auto px-6 mt-14" aria-label="Related services">
            <div className="rounded-callout border border-hairline bg-frost p-6">
                <p className="font-sans font-bold text-lg text-text mb-3">{intro}</p>
                <ul className="flex flex-col gap-2">
                    {links.map((l) => (
                        <li key={l.to}>
                            <Link to={l.to} className="inline-flex items-center gap-2 font-sans font-medium text-base text-accent hover:text-accentDeep transition-colors min-h-[44px]">
                                {l.label}<ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
