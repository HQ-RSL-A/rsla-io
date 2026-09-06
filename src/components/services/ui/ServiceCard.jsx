import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * The service card: media with a chip and an arrow, icon tile, title, one
 * sentence, hairline, "Explore this service". The whole card is the link.
 * `media` is either { src, alt } for a real screenshot or photo, or a React
 * node for one of the code drawn visuals.
 */
export default function ServiceCard({ to, title, description, chip, icon: Icon, media, label = 'Explore this service', onClick }) {
    const isImage = media && typeof media === 'object' && 'src' in media;
    return (
        <article className="group relative flex flex-col overflow-hidden rounded-callout border border-hairline bg-surface transition-transform duration-md ease-out-smooth hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-accent">
            <div className="relative aspect-[4/3] overflow-hidden bg-surfaceAlt">
                {isImage && <img src={media.src} alt={media.alt} width="640" height="480" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />}
                {media && !isImage && <div className={`absolute inset-0 flex items-start justify-center px-4 pb-0 sm:px-5 [&>*]:w-full ${chip ? 'pt-14' : 'pt-4'}`}>{media}</div>}
                {chip && <span className="absolute left-4 top-4 rounded-full border border-hairline bg-surface px-3 py-1 font-sans font-medium text-sm text-text">{chip}</span>}
                <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface text-text shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-transform duration-md ease-out-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2} />
                </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
                {Icon && <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-button bg-frost text-accent" aria-hidden="true"><Icon size={20} strokeWidth={2} /></span>}
                <h3 className="font-sans font-bold text-text text-2xl leading-[1.15] [text-wrap:balance]">
                    <Link to={to} onClick={onClick} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">{title}</Link>
                </h3>
                <p className="mt-3 font-sans text-base text-text leading-relaxed">{description}</p>
                <div className="mt-auto flex items-center justify-between border-t border-hairline pt-5 font-sans font-bold text-base text-text" style={{ marginTop: 'auto' }}>
                    <span className="pt-0">{label}</span>
                    <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" className="transition-transform duration-md ease-out-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>
        </article>
    );
}

export function ServiceCardGrid({ items, onClick }) {
    const n = items.length;
    const cols = n === 2 || n === 4 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';
    return (
        <div className={`grid gap-4 md:gap-5 ${cols}`}>
            {items.map((it) => <ServiceCard key={it.to} {...it} onClick={onClick ? () => onClick(it.to) : undefined} />)}
        </div>
    );
}
