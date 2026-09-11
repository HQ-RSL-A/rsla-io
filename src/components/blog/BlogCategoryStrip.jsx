import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { BLOG_CONTAINER } from './blogShared';

/*
 * The category row that sits under the navbar on every blog page (Clay's
 * BlogCategoryNav). Desktop: inline links, the active one dimmed with a thin
 * rule. Phone: a dropdown button. A search icon on the right opens the archive.
 */

function StripLink({ to, active, tone, children }) {
    const activeColor = tone === 'dark' ? 'text-white/60' : 'text-blog-muted';
    const restColor = tone === 'dark' ? 'text-white' : 'text-blog-ink';
    return (
        <Link
            to={to}
            aria-current={active ? 'page' : undefined}
            className={`relative inline-block px-[5px] py-[3px] text-[16px] leading-[1.4] ${active ? activeColor : restColor} ${
                active ? 'after:absolute after:left-[5px] after:right-[5px] after:-bottom-1 after:h-px after:bg-current after:opacity-45' : ''
            }`}
        >
            {children}
        </Link>
    );
}

export default function BlogCategoryStrip({ categories = [], active = '', tone = 'light', className = '' }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const activeName = categories.find((c) => c.slug === active)?.name || 'All posts';
    const items = [{ name: 'All posts', slug: '', to: '/blog' }, ...categories.map((c) => ({ ...c, to: `/blog/archive?category=${c.slug}` }))];

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
    }, [open]);

    const textColor = tone === 'dark' ? 'text-white' : 'text-blog-ink';

    return (
        <div className={`${BLOG_CONTAINER} flex items-center justify-between min-h-[31px] ${textColor} ${className}`}>
            <nav aria-label="Blog categories" className="hidden md:block -ml-[5px]">
                <ul className="flex flex-wrap gap-1">
                    {items.map((item) => (
                        <li key={item.slug || 'all'}>
                            <StripLink to={item.to} active={item.slug === active} tone={tone}>{item.name}</StripLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div ref={rootRef} className="relative md:hidden">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center gap-3 py-1 font-bold text-[18px] leading-[1.4] tracking-[-0.01em] active:scale-[0.97] transition-transform duration-xs"
                >
                    {activeName}
                    <ChevronDown size={16} strokeWidth={2} className={`transition-transform duration-md ease-out-smooth ${open ? 'rotate-180' : ''}`} />
                </button>
                <ul
                    role="listbox"
                    className={`absolute left-[-15px] top-[calc(100%+3px)] z-30 min-w-[220px] rounded bg-white py-4 px-6 text-blog-ink shadow-[0_34px_44px_rgba(0,0,0,0.3)] origin-top-left transition-[opacity,transform,visibility] duration-sm ease-out-smooth ${
                        open ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-95'
                    }`}
                >
                    {items.map((item) => (
                        <li key={item.slug || 'all'} className="py-1.5">
                            <Link
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`block text-[18px] leading-[1.4] ${item.slug === active ? 'text-blog-muted' : 'text-blog-ink'}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <Link to="/blog/archive" aria-label="Search the archive" className="inline-flex h-8 w-8 items-center justify-center -mr-1.5 transition-opacity duration-sm hover:opacity-60">
                <Search size={20} strokeWidth={2} />
            </Link>
        </div>
    );
}
