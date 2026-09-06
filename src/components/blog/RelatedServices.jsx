import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * In-content links from a post or case study into the service pages it
 * supports. Plain sentence, keyword anchors, no card chrome.
 */
export default function RelatedServices({ links, intro = 'If this is the problem you are solving, we do the work:' }) {
    if (!links || links.length === 0) return null;
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
