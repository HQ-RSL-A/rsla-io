import InlineText from '@/components/services/InlineText';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Plain text FAQ. Never an accordion: the answers are the part of the page
 * Google and the AI assistants lift, so they stay visible. Numbered rows,
 * question set large, answer beside it on wide screens.
 */
export default function ServiceFaq({ faqs, heading = 'Questions people ask' }) {
    if (!faqs || faqs.length === 0) return null;
    return (
        <section className="bg-surface border-t border-hairline py-16 md:py-24 px-6 md:px-12" aria-labelledby="faq-heading">
            <div className="max-w-6xl mx-auto">
                <h2 id="faq-heading" className="font-sans font-bold text-text text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05] mb-10 md:mb-14 max-w-3xl [text-wrap:balance]">
                    {heading}
                </h2>
                <ol className="border-t border-hairline">
                    {faqs.map((faq, i) => (
                        <li key={faq.q} className="mp-reveal grid gap-4 border-b border-hairline py-8 md:py-10 md:grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
                            <span className="font-sans font-medium text-sm text-text tabular-nums md:pt-1">{pad(i + 1)}</span>
                            <h3 className="font-sans font-bold text-xl md:text-2xl text-text leading-[1.2] [text-wrap:balance]">{faq.q}</h3>
                            <p className="font-sans text-lg text-text leading-relaxed"><InlineText text={faq.a} /></p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
