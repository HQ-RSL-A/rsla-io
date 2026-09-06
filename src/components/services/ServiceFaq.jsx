import InlineText from '@/components/services/InlineText';

/**
 * Plain text FAQ. Never an accordion: the answers are the part of the page
 * Google and the AI assistants lift, so they stay visible.
 */
export default function ServiceFaq({ faqs, heading = 'Questions people ask' }) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="bg-surface border-t border-hairline py-16 md:py-24 px-6 md:px-12" aria-labelledby="faq-heading">
            <div className="max-w-6xl mx-auto">
                <h2 id="faq-heading" className="font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-10 max-w-3xl [text-wrap:balance]">
                    {heading}
                </h2>
                <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
                    {faqs.map((faq) => (
                        <div key={faq.q} className="mp-reveal max-w-[62ch]">
                            <h3 className="font-sans font-bold text-xl text-text leading-snug mb-3 [text-wrap:balance]">{faq.q}</h3>
                            <p className="font-sans text-lg text-text leading-relaxed"><InlineText text={faq.a} /></p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
