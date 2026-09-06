import { Link } from 'react-router-dom';

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const linkCls = 'text-accent underline decoration-transparent hover:decoration-accent underline-offset-4 transition-[text-decoration-color] duration-sm ease-out-smooth';

/**
 * Renders a copy string that may contain markdown links. Internal paths become
 * router links, external URLs open in a new tab. Nothing else is parsed on
 * purpose: the copy files are the source of truth and stay plain.
 */
export default function InlineText({ text }) {
    if (!text) return null;
    const parts = [];
    let last = 0;
    for (const m of text.matchAll(LINK)) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        const [, label, href] = m;
        if (href.startsWith('/')) {
            parts.push(<Link key={m.index} to={href} className={linkCls}>{label}</Link>);
        } else if (href.startsWith('tel:') || href.startsWith('mailto:')) {
            parts.push(<a key={m.index} href={href} className={linkCls}>{label}</a>);
        } else {
            parts.push(<a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{label}</a>);
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return <>{parts}</>;
}
