export function generateFaqSchema(faqs) {
    if (!faqs || faqs.length === 0) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };
}

export default function ServiceFaq({ faqs, serviceName }) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="bg-accent-light border-t border-accent-border py-20 md:py-28 px-6 md:px-12">
            <div className="max-w-3xl mx-auto">
                <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-10">
                    Frequently asked questions
                </h2>
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <details
                            key={i}
                            className="group rounded-xl border border-accent-border bg-surface p-5 open:border-accent/30"
                        >
                            <summary className="flex items-center justify-between gap-4 font-sans font-bold text-base text-text cursor-pointer list-none">
                                {faq.q}
                                <span className="flex-shrink-0 text-accent text-xl leading-none transition-transform duration-md group-open:rotate-45">
                                    +
                                </span>
                            </summary>
                            <p className="mt-4 font-sans text-base text-textMuted leading-relaxed">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
