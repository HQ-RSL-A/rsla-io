/**
 * A left to right flow of the steps an automation runs. Pass `steps` as
 * [{ label, detail }]. Rendered with CSS grid so it wraps on small screens.
 */
const presets = {
    lead: [
        { label: 'Missed call', detail: 'Trigger' },
        { label: 'Text back', detail: 'in 9 seconds' },
        { label: 'Lead in CRM', detail: 'tagged, assigned' },
        { label: 'Follow up', detail: 'day 1, 2, 5' },
        { label: 'Booked', detail: 'reminder queued' },
    ],
    redirect: [
        { label: 'Old URL', detail: 'ranks, has links' },
        { label: 'One 301', detail: 'no chain' },
        { label: 'New page', detail: 'same heading' },
        { label: 'Search Console', detail: 'checked day one' },
    ],
    content: [
        { label: 'Customer question', detail: 'from a real call' },
        { label: 'Your answer', detail: 'by voice' },
        { label: 'Article', detail: 'one keyword' },
        { label: 'Money page', detail: 'linked in' },
    ],
};

export default function FlowDiagram({ preset = 'lead', steps }) {
    const items = steps || presets[preset] || presets.lead;
    return (
        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Steps the automation runs">
            {items.map((s, i) => (
                <li key={s.label} className="relative rounded-callout border border-hairline bg-surface p-4">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-accent px-2 font-sans font-bold text-[12px] text-white tabular-nums mb-3">{i + 1}</span>
                    <p className="font-sans font-bold text-base text-text leading-snug">{s.label}</p>
                    <p className="font-sans text-sm text-text mt-1">{s.detail}</p>
                </li>
            ))}
        </ol>
    );
}
