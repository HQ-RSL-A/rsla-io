import { TrendingUp, Sparkles, BadgeCheck } from 'lucide-react';

const DEFAULT_ICONS = [TrendingUp, Sparkles, BadgeCheck];

/** Bold the first figure in a proof line: "204 keywords ..." -> <b>204</b> keywords */
function Figure({ text }) {
    const m = text.match(/\$?\d[\d,.]*[KkM%]?(?:\s?(?:point|step))?/);
    if (!m || m.index > 30) return text;
    const i = m.index;
    return (<>{text.slice(0, i)}<span className="text-accent">{m[0]}</span>{text.slice(i + m[0].length)}</>);
}

export default function ProofRow({ items, icons = DEFAULT_ICONS }) {
    return (
        <ul className="grid gap-3 sm:grid-cols-3" aria-label="Proof">
            {items.map((p, i) => {
                const Icon = icons[i] || DEFAULT_ICONS[i % 3];
                return (
                    <li key={p} className="flex items-start gap-4 rounded-callout border border-hairline bg-surface px-5 py-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-frost text-accent" aria-hidden="true"><Icon size={18} strokeWidth={2} /></span>
                        <p className="font-sans font-bold text-base text-text leading-snug [text-wrap:balance]"><Figure text={p} /></p>
                    </li>
                );
            })}
        </ul>
    );
}
