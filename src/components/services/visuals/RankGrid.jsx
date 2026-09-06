import snapshot from '@/data/rankGridSnapshot.json';

/**
 * The real 49 point scan of RSL/A's own Google Business Profile, rendered from
 * src/data/rankGridSnapshot.json. Rank 20 is LeadSnap's value for "outside the
 * top 20", so the baseline grid is entirely red. Nothing here is illustrative.
 */
function cellClass(rank) {
    if (rank <= 3) return 'bg-success text-white';
    if (rank <= 10) return 'bg-warning text-white';
    return 'bg-error text-white';
}

export default function RankGrid({ caption = true }) {
    const { ranks, grid, keyword, scannedAt, spacingMiles } = snapshot;
    const date = new Date(`${scannedAt}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return (
        <figure className="rounded-callout border border-hairline bg-surface p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-baseline justify-between gap-4 mb-4">
                <p className="font-sans font-bold text-base text-text">RSL/A, "{keyword}"</p>
                <p className="font-sans text-sm text-text tabular-nums">{date}</p>
            </div>
            <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}
                role="img"
                aria-label={`Rank grid for ${keyword}: ${ranks.filter(r => r <= 3).length} of ${ranks.length} points in the top 3, ${ranks.filter(r => r > 20 || r === 20).length} points outside the top 20`}
            >
                {ranks.map((rank, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-md flex items-center justify-center font-sans font-bold text-[13px] sm:text-sm tabular-nums ${cellClass(rank)}`}
                        aria-hidden="true"
                    >
                        {rank >= 20 ? '20+' : rank}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm text-text">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-success" aria-hidden="true" />Top 3</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-warning" aria-hidden="true" />4 to 10</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-error" aria-hidden="true" />Outside the top 20</span>
            </div>
            {caption && (
                <figcaption className="mt-4 font-sans text-sm text-text leading-relaxed">
                    49 points, {spacingMiles} miles apart, across Bakersfield. Our own profile on the day we started measuring it. Every client gets this map for their business, every week.
                </figcaption>
            )}
        </figure>
    );
}
