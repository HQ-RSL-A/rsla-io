/*
 * Plain-text table of contents for an article (Clay's ArticleNavigation).
 * Sticky in the left column on wide screens, a list above the body on phones.
 */
export default function ArticleToc({ headings = [], activeId = '', className = '' }) {
    if (!headings.length) return null;
    return (
        <nav aria-label="Table of contents" className={className}>
            <ul className="space-y-[15px]">
                {headings.map((h) => {
                    const active = activeId === h.id;
                    return (
                        <li key={h.id}>
                            <a
                                href={`#${h.id}`}
                                aria-current={active ? 'true' : undefined}
                                className={`block text-[14px] leading-[23px] transition-colors duration-sm ${active ? 'text-blog-ink' : 'text-blog-muted hover:text-blog-ink'}`}
                            >
                                {h.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
