/**
 * A CRM pipeline board with the stages a one person service business actually
 * uses. Cards carry no names; they show what the system does at each stage.
 */
const columns = [
    { title: 'New lead', cards: ['Website form, 7:41 AM', 'Missed call, text back sent'] },
    { title: 'Contacted', cards: ['Called back, notes by voice'] },
    { title: 'Quote sent', cards: ['Follow up Thursday, automatic', 'Reminder to you Friday'] },
    { title: 'Booked', cards: ['Estimate Tue 9 AM, reminder queued'] },
    { title: 'Done', cards: ['Review request sent'] },
];

export default function PipelineBoard() {
    return (
        <div className="rounded-callout border border-hairline bg-surfaceAlt p-3 md:p-4 overflow-x-auto" role="img" aria-label="A CRM pipeline with five stages: new lead, contacted, quote sent, booked, done. Each card shows the automatic action at that stage.">
            <div className="grid grid-cols-5 gap-2 min-w-[560px]">
                {columns.map((col) => (
                    <div key={col.title} className="rounded-lg bg-surface border border-hairline p-2 min-h-[150px]">
                        <p className="font-sans font-bold text-[12px] text-text mb-2 flex items-center justify-between">
                            {col.title}
                            <span className="tabular-nums text-[11px] font-medium rounded-full bg-surfaceAlt px-1.5 py-0.5">{col.cards.length}</span>
                        </p>
                        <ul className="space-y-1.5" aria-hidden="true">
                            {col.cards.map((c) => (
                                <li key={c} className="rounded-md border border-hairline bg-frost px-2 py-1.5 font-sans text-[11px] leading-snug text-text">
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <p className="mt-3 font-sans text-sm text-text">Drag a card, the next action fires. You never write the follow up.</p>
        </div>
    );
}
