/**
 * A phone frame showing one automation as the owner sees it. Two variants:
 * "missed-call" (text back within seconds) and "voice-note" (a spoken note
 * becomes a lead). Times and wording are generic; no customer is depicted.
 */
const variants = {
    'missed-call': {
        label: 'Missed call, handled',
        rows: [
            { side: 'in', text: 'Missed call · 2:14 PM · (661) ***-0192' },
            { side: 'out', text: 'Hi, this is RSL/A Plumbing. Sorry we missed you. Water heater, drain, or something else? Reply here or we call back within the hour.' , at: '2:14 PM' },
            { side: 'in', text: 'Water heater, no hot water since this morning', at: '2:16 PM' },
            { side: 'out', text: 'Got it. Earliest visit is today 4:30 PM. Want it? Reply YES and it is booked.', at: '2:16 PM' },
            { side: 'in', text: 'YES', at: '2:17 PM' },
            { side: 'sys', text: 'Booked 4:30 PM · added to pipeline · reminder queued' },
        ],
    },
    'voice-note': {
        label: 'Voice note to lead',
        rows: [
            { side: 'in', text: '🎤 0:21 "Just met Dave at the Oildale job, wants a quote on sprinklers for the back yard, call him next week."' },
            { side: 'out', text: 'Two things I still need: Dave\'s number, and roughly how big is the yard?', at: 'agent' },
            { side: 'in', text: '661 555 0148, about a quarter acre', at: '3:02 PM' },
            { side: 'sys', text: 'Lead created · tagged sprinklers, Oildale · follow up Tue 9 AM' },
        ],
    },
};

export default function PhoneFlow({ variant = 'missed-call' }) {
    const v = variants[variant] || variants['missed-call'];
    return (
        <div className="mx-auto w-full max-w-[320px]" role="img" aria-label={`${v.label}: a text conversation handled by the automation`}>
            <div className="rounded-[28px] border border-hairline bg-surface p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="rounded-[20px] bg-surfaceAlt p-3">
                    <p className="text-center font-sans font-bold text-[12px] text-text mb-3">{v.label}</p>
                    <ul className="space-y-2" aria-hidden="true">
                        {v.rows.map((r, i) => (
                            <li key={i} className={`flex ${r.side === 'out' ? 'justify-end' : r.side === 'sys' ? 'justify-center' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-3 py-2 font-sans text-[12px] leading-snug ${r.side === 'out' ? 'bg-accent text-white' : r.side === 'sys' ? 'bg-frost text-text text-[11px] font-bold' : 'bg-surface border border-hairline text-text'}`}>
                                    {r.text}
                                    {r.at && <span className={`block mt-1 text-[10px] ${r.side === 'out' ? 'text-white/90' : 'text-text'}`}>{r.at}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
