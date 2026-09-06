import { portfolio } from '@/data/serviceConstants.mjs';

export default function PortfolioStrip({ items = portfolio, columns = 2 }) {
    return (
        <ul className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`} aria-label="Websites we have built">
            {items.map((p) => (
                <li key={p.src} className="rounded-callout border border-hairline bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-hairline bg-surfaceAlt" aria-hidden="true">
                        <span className="w-2 h-2 rounded-full bg-hairline" /><span className="w-2 h-2 rounded-full bg-hairline" /><span className="w-2 h-2 rounded-full bg-hairline" />
                    </div>
                    <img src={p.src} alt={p.alt} width="640" height="400" loading="lazy" className="block w-full aspect-[16/10] object-cover object-top" />
                </li>
            ))}
        </ul>
    );
}
