import { Link } from 'react-router-dom';
import { PortableTextComponents, slugify } from './PortableTextRenderer';

/*
 * Article body typography for /blog/:slug, on top of the shared renderer:
 * Clay's scale (18px/27px body, 40px h2, 30px h3), muted underlined links.
 * The custom block types (images, callouts, code, embeds) stay as they are.
 */

const headingId = (value) => slugify((value?.children || []).map((c) => c.text || '').join(''));

const linkClass = 'text-blog-muted underline decoration-1 underline-offset-[5px] decoration-blog-muted/40 hover:text-blog-ink hover:decoration-blog-ink transition-[color,text-decoration-color] duration-sm ease-out-smooth';

export const blogPortableTextComponents = {
    ...PortableTextComponents,
    block: {
        ...PortableTextComponents.block,
        h2: ({ children, value }) => (
            <h2 id={headingId(value)} className="mt-14 mb-6 md:mt-20 md:mb-8 font-bold text-[32px] leading-[1.25] md:text-[40px] md:leading-[50px] tracking-[-0.03em] text-blog-ink scroll-mt-28" style={{ textWrap: 'balance' }}>
                {children}
            </h2>
        ),
        h3: ({ children, value }) => (
            <h3 id={headingId(value)} className="mt-10 mb-5 md:mt-12 md:mb-6 font-bold text-[26px] leading-[1.25] md:text-[30px] md:leading-[36px] tracking-[-0.02em] text-blog-ink scroll-mt-28" style={{ textWrap: 'balance' }}>
                {children}
            </h3>
        ),
        h4: ({ children }) => <h4 className="mt-8 mb-4 font-bold text-[22px] leading-[1.3] tracking-[-0.01em] text-blog-ink">{children}</h4>,
        normal: ({ children }) => <p className="mb-[30px] text-[18px] leading-[27px] text-blog-ink">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="my-10 border-l-2 border-blog-ink pl-6 text-[22px] leading-[1.4] tracking-[-0.01em] text-blog-ink">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="mt-6 mb-7 list-disc pl-7 space-y-2 text-[18px] leading-[27px] text-blog-ink marker:text-blog-ink">{children}</ul>,
        number: ({ children }) => <ol className="mt-6 mb-7 list-decimal pl-7 space-y-2 text-[18px] leading-[27px] text-blog-ink marker:text-blog-ink">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="pl-1">{children}</li>,
        number: ({ children }) => <li className="pl-1">{children}</li>,
    },
    marks: {
        ...PortableTextComponents.marks,
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="not-italic font-bold">{children}</em>,
        link: ({ value, children }) => {
            const href = value?.href || '#';
            if (/^(javascript|data|vbscript):/i.test(href)) return <span>{children}</span>;
            if (href.startsWith('/')) return <Link to={href} className={linkClass}>{children}</Link>;
            const external = value?.blank;
            return (
                <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={linkClass}>
                    {children}
                </a>
            );
        },
    },
};
