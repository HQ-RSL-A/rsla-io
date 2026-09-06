import InlineText from '@/components/services/InlineText';

const pad = (n) => String(n).padStart(2, '0');

function cardTone(tone) {
    return tone === 'alt' ? 'bg-surface border border-hairline' : 'bg-surfaceAlt';
}

/**
 * Numbered cards: number, title, hairline, body. Three across, two when the
 * count divides evenly by two and not by three.
 */
export function CardGrid({ items, tone = 'base', start = 1 }) {
    const n = items.length;
    const cols = n === 2 || n === 4 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';
    return (
        <ol className={`grid gap-4 ${cols}`}>
            {items.map((item, i) => (
                <li key={item.title} className={`mp-reveal flex flex-col rounded-callout p-6 md:p-7 ${cardTone(tone)}`}>
                    <span className="font-sans font-medium text-sm text-text tabular-nums">{pad(start + i)}</span>
                    <h3 className="mt-5 font-sans font-bold text-text text-2xl leading-[1.15] [text-wrap:balance]">{item.title}</h3>
                    <span className="mt-5 block h-px w-12 bg-text" aria-hidden="true" />
                    <p className="mt-5 font-sans text-base text-text leading-relaxed"><InlineText text={item.text} /></p>
                </li>
            ))}
        </ol>
    );
}

/**
 * The same cards stacked in one column, for sections that share the row with
 * a visual.
 */
export function CardRows({ items, tone = 'base', start = 1 }) {
    return (
        <ol className="flex flex-col gap-3">
            {items.map((item, i) => (
                <li key={item.title} className={`mp-reveal flex gap-5 rounded-callout p-5 md:p-6 ${cardTone(tone)}`}>
                    <span className="mt-0.5 font-sans font-medium text-sm text-text tabular-nums">{pad(start + i)}</span>
                    <div className="min-w-0">
                        <h3 className="font-sans font-bold text-text text-xl leading-snug">{item.title}</h3>
                        <p className="mt-2 font-sans text-base text-text leading-relaxed"><InlineText text={item.text} /></p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
