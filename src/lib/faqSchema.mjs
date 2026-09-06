/** FAQPage JSON-LD from the copy set. Markdown links are stripped from answers. */
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
                text: faq.a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
            },
        })),
    };
}
