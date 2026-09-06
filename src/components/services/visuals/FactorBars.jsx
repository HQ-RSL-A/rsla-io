/**
 * Where each Google Business Profile lever sits among Whitespark's 187 local
 * ranking factors (2026 edition, published November 2025). Lower is stronger.
 * The numbers are the ones quoted in the page copy; keep both in sync.
 */
const factors = [
    { name: 'Primary category', rank: 1 },
    { name: 'Open at time of search', rank: 5 },
    { name: 'Review recency', rank: 11 },
    { name: 'Steady flow of reviews', rank: 14 },
    { name: 'Keywords in services', rank: 35, note: 'up from 110' },
    { name: 'Real photos, not stock', rank: 45 },
    { name: 'Post frequency', rank: 148 },
    { name: 'Post quantity', rank: 168 },
];

export default function FactorBars() {
    const max = 187;
    return (
        <figure className="rounded-callout border border-hairline bg-surface p-5 md:p-6">
            <p className="font-sans font-bold text-base text-text mb-1">What moves a Google Business Profile</p>
            <p className="font-sans text-sm text-text mb-4">Rank among 187 local factors, Whitespark 2026. Shorter bar, stronger lever.</p>
            <ul className="space-y-2.5">
                {factors.map((f) => (
                    <li key={f.name} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                        <div>
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="font-sans text-sm font-medium text-text">{f.name}</span>
                                {f.note && <span className="font-sans text-[12px] text-accent font-bold">{f.note}</span>}
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-surfaceAlt overflow-hidden" aria-hidden="true">
                                <div className={`h-full rounded-full ${f.rank <= 50 ? 'bg-accent' : 'bg-hairline'}`} style={{ width: `${Math.max(4, (f.rank / max) * 100)}%` }} />
                            </div>
                        </div>
                        <span className="font-sans font-bold text-sm text-text tabular-nums w-10 text-right">#{f.rank}</span>
                    </li>
                ))}
            </ul>
            <figcaption className="sr-only">Primary category ranks first of 187 factors, post frequency ranks 148th and post quantity 168th.</figcaption>
        </figure>
    );
}
