import { useState } from 'react';

const ICONS = {
    linkedin: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    ),
    email: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
    ),
    link: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    ),
};

export default function ShareBar({ title, url, showLabel = true }) {
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title || '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const links = [
        {
            label: 'LinkedIn',
            icon: ICONS.linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
            label: 'X',
            icon: ICONS.x,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            label: 'Email',
            icon: ICONS.email,
            href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        },
    ];

    return (
        <div className="flex items-center gap-1">
            {showLabel && <span className="font-sans text-sm uppercase tracking-widest text-textLight mr-2">Share</span>}
            {links.map(({ label, icon, href }) => (
                <a
                    key={label}
                    href={href}
                    target={label === 'Email' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={`Share on ${label}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-textMuted hover:text-accent hover:bg-accent/5 transition-colors duration-150"
                >
                    {icon}
                </a>
            ))}
            <button
                onClick={handleCopy}
                aria-label={copied ? 'Link copied' : 'Copy link'}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    copied
                        ? 'text-green-600 bg-green-50'
                        : 'text-textMuted hover:text-accent hover:bg-accent/5'
                }`}
            >
                {copied ? ICONS.check : ICONS.link}
            </button>
        </div>
    );
}
