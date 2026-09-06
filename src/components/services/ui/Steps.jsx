import InlineText from '@/components/services/InlineText';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Process steps. A circular numbered badge, the step title, one short body.
 * `layout="row"` puts them across the page; `column` stacks them beside a visual.
 */
export default function Steps({ items, layout = 'row' }) {
    const titled = items.every((it) => it.title);
    const wrap = layout === 'row' && titled
        ? 'grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'
        : 'flex flex-col gap-8';
    return (
        <ol className={wrap}>
            {items.map((it, i) => (
                <li key={i} className="mp-reveal flex gap-4 lg:block">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-frost font-sans font-bold text-base text-accent tabular-nums">{pad(i + 1)}</span>
                    <div className="min-w-0 lg:mt-5">
                        {it.title && <h3 className="font-sans font-bold text-text text-xl md:text-2xl leading-[1.15] [text-wrap:balance]">{it.title}</h3>}
                        {it.title && <span className="mt-4 block h-px w-10 bg-text" aria-hidden="true" />}
                        <p className={`font-sans text-base text-text leading-relaxed ${it.title ? 'mt-4' : ''}`}><InlineText text={it.text} /></p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
