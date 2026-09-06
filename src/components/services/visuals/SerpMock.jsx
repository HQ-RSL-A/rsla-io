/**
 * A search results page reduced to its two halves: the map pack and the
 * organic results. Generic on purpose (no business names), so it explains the
 * mechanism without inventing a result. Every color comes from the brand tokens.
 */
function Stars() {
    return (
        <span className="inline-flex gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map(i => (
                <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
            ))}
        </span>
    );
}

export default function SerpMock({ query = 'plumber near me', city = 'your city', aiLine = true }) {
    const pack = [
        { name: 'Business A', meta: '4.9 · 212 reviews · Open now' },
        { name: 'Business B', meta: '4.8 · 96 reviews · Open now' },
        { name: 'Business C', meta: '5.0 · 41 reviews · Opens 8 AM' },
    ];
    return (
        <div className="rounded-callout border border-hairline bg-surface p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-sans" role="img" aria-label={`A Google results page for "${query}": the map pack with three businesses above the regular results`}>
            <div className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm text-text mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span>{query}</span>
            </div>
            {aiLine && (
                <div className="rounded-lg bg-frost px-3 py-2.5 mb-3">
                    <p className="text-[11px] font-bold text-accent mb-1">AI answer</p>
                    <p className="text-[13px] leading-snug text-text">Based on reviews and pages that rank in {city}, three businesses come up most often…</p>
                </div>
            )}
            <div className="rounded-lg border border-hairline overflow-hidden mb-3">
                <div className="bg-surfaceAlt h-16 relative" aria-hidden="true">
                    <span className="absolute left-[22%] top-[38%] w-3 h-3 rounded-full bg-error ring-4 ring-white" />
                    <span className="absolute left-[55%] top-[52%] w-3 h-3 rounded-full bg-error ring-4 ring-white" />
                    <span className="absolute left-[74%] top-[28%] w-3 h-3 rounded-full bg-error ring-4 ring-white" />
                </div>
                <ul className="divide-y divide-hairline">
                    {pack.map((b, i) => (
                        <li key={b.name} className="flex items-center justify-between gap-3 px-3 py-2">
                            <div>
                                <p className="text-[13px] font-bold text-text">{b.name}</p>
                                <p className="text-[12px] text-text flex items-center gap-1.5"><Stars />{b.meta}</p>
                            </div>
                            <span className="text-[11px] font-bold text-white bg-accent rounded-md px-2 py-1">Call</span>
                            <span className="sr-only">position {i + 1}</span>
                        </li>
                    ))}
                </ul>
                <p className="px-3 py-1.5 text-[11px] font-bold text-text bg-surfaceAlt">Map pack: ranked by your Google Business Profile</p>
            </div>
            <ul className="space-y-2.5" aria-hidden="true">
                {[1, 2, 3].map(i => (
                    <li key={i}>
                        <p className="text-[11px] text-text">yourbusiness.com › services › {query.split(' ')[0]}</p>
                        <p className="text-[13px] font-bold text-accent leading-snug">{query.split(' ')[0].replace(/^./, c => c.toUpperCase())} in {city}, done right</p>
                        <p className="text-[12px] text-text leading-snug">A page for this one service, in this one city, that answers the question at the top.</p>
                    </li>
                ))}
            </ul>
            <p className="mt-2 text-[11px] font-bold text-text">Regular results: ranked by your website</p>
        </div>
    );
}
