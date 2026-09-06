/** "Chris K., CEO and Co-Founder, Fieldshare" -> { name, role, initials } */
function parseCite(cite = '') {
    const [name = '', ...rest] = cite.split(',').map((s) => s.trim());
    const initials = name.split(/\s+/).map((w) => w.replace(/[^A-Za-z]/g, '')[0] || '').join('').slice(0, 2).toUpperCase();
    return { name, role: rest.join(', '), initials };
}

export function QuoteCard({ text, cite, tone = 'base' }) {
    const { name, role, initials } = parseCite(cite);
    return (
        <figure className={`mp-reveal flex flex-col rounded-callout p-6 md:p-7 ${tone === 'alt' ? 'bg-surface border border-hairline' : 'bg-surfaceAlt'}`}>
            <span className="font-sans font-bold text-accent text-4xl leading-none" aria-hidden="true">&ldquo;</span>
            <blockquote className="mt-3 flex-1">
                <p className="font-sans text-lg text-text leading-relaxed">{text.replace(/^"|"$/g, '')}</p>
            </blockquote>
            {cite && (
                <figcaption className="mt-6 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-frost font-sans font-bold text-sm text-accent" aria-hidden="true">{initials}</span>
                    <span className="font-sans text-base text-text leading-snug"><span className="font-bold">{name}</span>{role ? <>, {role}</> : null}</span>
                </figcaption>
            )}
        </figure>
    );
}

export function QuoteGrid({ quotes, tone }) {
    return (
        <div className={`grid gap-4 ${quotes.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {quotes.map((q, i) => <QuoteCard key={i} text={q.text} cite={q.cite} tone={tone} />)}
        </div>
    );
}
