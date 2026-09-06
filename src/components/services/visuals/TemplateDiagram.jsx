/**
 * Programmatic SEO in one picture: one template, a dataset with a row per
 * page, and the two kinds of page that come out of it. Plus the honest
 * number from our own test: 12 pages published, 2 earned impressions.
 */
export default function TemplateDiagram() {
    const rows = [
        { a: 'Row 1', b: 'own data', ok: true },
        { a: 'Row 2', b: 'own data', ok: true },
        { a: 'Row 3', b: 'city swap', ok: false },
    ];
    return (
        <div className="grid gap-3">
            <div className="rounded-callout border border-hairline bg-surface p-5">
                <p className="font-sans font-bold text-base text-text mb-3">Template × dataset = pages</p>
                <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
                    <div className="rounded-lg border border-dashed border-accent/60 bg-frost px-3 py-2 font-sans text-[12px] font-bold text-accent">Template</div>
                    <ul className="space-y-1.5" aria-label="Dataset rows and the page each one produces">
                        {rows.map((r) => (
                            <li key={r.a} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border border-hairline px-3 py-1.5 font-sans text-[12px]">
                                <span className="font-bold text-text">{r.a}</span>
                                <span className="text-text">{r.b}</span>
                                <span className={`rounded-md px-2 py-0.5 font-bold text-white ${r.ok ? 'bg-success' : 'bg-error'}`}>{r.ok ? 'useful page' : 'doorway'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-callout border border-hairline bg-surface p-5">
                    <p className="font-sans font-bold text-4xl text-text tabular-nums leading-none">12</p>
                    <p className="font-sans text-sm text-text mt-2">industry pages we published on our own site, March 2026</p>
                </div>
                <div className="rounded-callout border border-hairline bg-surface p-5">
                    <p className="font-sans font-bold text-4xl text-accent tabular-nums leading-none">2</p>
                    <p className="font-sans text-sm text-text mt-2">earned an impression in five months, so the second batch was never built</p>
                </div>
            </div>
        </div>
    );
}
