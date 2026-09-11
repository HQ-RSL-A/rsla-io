import { useState } from 'react';

/*
 * Round share buttons for the article rail (Clay's ArticleShare), plus the
 * "Summarize with" row of AI buttons underneath.
 */

const ICONS = {
    link: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    email: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
};

const ROUND = 'inline-flex h-10 w-10 items-center justify-center rounded-full bg-blog-pill text-blog-ink transition-[background-color,transform] duration-sm ease-out-smooth hover:bg-blog-pillHover active:scale-[0.95]';

export default function ArticleShare({ title, url, aiLinks = [], className = '' }) {
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || '');

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const links = [
        { label: 'Share on LinkedIn', icon: ICONS.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
        { label: 'Share on X', icon: ICONS.x, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
        { label: 'Share by email', icon: ICONS.email, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, self: true },
    ];

    return (
        <div className={`flex flex-col items-center text-blog-ink ${className}`}>
            <p className="font-bold text-[15px] leading-[21px]">Share this article</p>
            <ul className="mt-3 flex items-center gap-2">
                <li>
                    <button type="button" onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'} className={ROUND}>
                        {copied ? ICONS.check : ICONS.link}
                    </button>
                </li>
                {links.map((l) => (
                    <li key={l.label}>
                        <a href={l.href} target={l.self ? '_self' : '_blank'} rel="noopener noreferrer" aria-label={l.label} className={ROUND}>{l.icon}</a>
                    </li>
                ))}
            </ul>
            {aiLinks.length > 0 && (
                <>
                    <p className="mt-8 text-[13px] leading-[20px] text-blog-muted">Summarize with</p>
                    <ul className="mt-2 flex items-center gap-2">
                        {aiLinks.map(({ name, href, icon }) => (
                            <li key={name}>
                                <a href={href} target="_blank" rel="noopener noreferrer" title={name} aria-label={`Summarize with ${name}`} className={ROUND}>
                                    <img src={icon} alt="" width="20" height="20" className="h-5 w-5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
