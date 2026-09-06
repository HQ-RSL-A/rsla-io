/**
 * An internal tool as the owner sees it: a bills vault with a year end
 * export. Labels only, no figures presented as anyone's real books.
 */
export default function DashboardMock() {
    const rows = [
        { v: 'Fuel, truck 2', c: 'Vehicle', s: 'Receipt read' },
        { v: 'Irrigation supply', c: 'Materials', s: 'Receipt read' },
        { v: 'Software, monthly', c: 'Subscriptions', s: 'Recurring' },
        { v: 'Dump fee', c: 'Disposal', s: 'Needs category' },
    ];
    return (
        <div className="rounded-callout border border-hairline bg-surface overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]" role="img" aria-label="An internal bills vault: receipts read automatically, categorized, and exported for tax season">
            <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surfaceAlt">
                <p className="font-sans font-bold text-sm text-text">Bills vault</p>
                <span className="rounded-md bg-accent px-2.5 py-1 font-sans font-bold text-[12px] text-white">Export for tax season</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-hairline border-b border-hairline" aria-hidden="true">
                {[['This month', '38 receipts'], ['Uncategorized', '1'], ['Year to date', '412 receipts']].map(([k, v]) => (
                    <div key={k} className="px-4 py-3">
                        <p className="font-sans text-[11px] text-text">{k}</p>
                        <p className="font-sans font-bold text-base text-text tabular-nums">{v}</p>
                    </div>
                ))}
            </div>
            <ul className="divide-y divide-hairline" aria-hidden="true">
                {rows.map((r) => (
                    <li key={r.v} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 font-sans text-[13px]">
                        <span className="font-medium text-text">{r.v}</span>
                        <span className="rounded-full bg-surfaceAlt px-2 py-0.5 text-[11px] text-text">{r.c}</span>
                        <span className={`text-[11px] font-bold ${r.s === 'Needs category' ? 'text-warning' : 'text-success'}`}>{r.s}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
