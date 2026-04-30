import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const followLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/rahul.lalia/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahullalia/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@rahul_lalia' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@rahul_lalia' },
    { label: 'X', href: 'https://x.com/rahul_lalia' },
];

const exploreLinks = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Work', to: '/work' },
    { label: 'Blog', to: '/blog' },
];

const legalLinks = [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Accessibility', to: '/accessibility' },
];

function LinkColumn({ title, items }) {
    return (
        <div>
            <p className="font-sans font-bold text-sm uppercase tracking-wider mb-5 text-white/80">
                {title}
            </p>
            <ul className="flex flex-col gap-1">
                {items.map((item) => {
                    const cls = "font-sans text-sm text-white/50 hover:text-white transition-colors inline-flex items-center min-h-[44px]";
                    return (
                        <li key={item.label}>
                            {item.to ? (
                                <Link to={item.to} className={cls}>{item.label}</Link>
                            ) : (
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{item.label}</a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function FooterV2() {
    return (
        <footer className="bg-[#0A0A0A] text-white px-6 md:px-12">
            {/* Main content */}
            <div className="max-w-7xl mx-auto pt-16 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14 lg:gap-20">
                    {/* Left — CTA */}
                    <div className="max-w-lg">
                        <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-white leading-snug mb-8">
                            Start with a free, 30-minute growth mapping call.
                        </h2>
                        <Link
                            to="/contact"
                            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'footer' })}
                            className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0A0A0A] px-6 py-3 font-sans font-bold text-sm hover:bg-white/90 transition-colors"
                        >
                            Let's Talk
                            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
                        </Link>
                    </div>

                    {/* Right — Link columns */}
                    <div className="grid grid-cols-2 gap-10 lg:gap-14">
                        <LinkColumn title="Follow" items={followLinks} />
                        <LinkColumn title="Explore" items={exploreLinks} />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="shrink-0">
                    <img
                        src="/images/logo/lockup-nobg.webp"
                        alt="RSL/A"
                        width="120"
                        height="48"
                        className="h-16 w-auto opacity-30 hover:opacity-60 transition-opacity"
                    />
                </Link>

                {/* Legal links */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center">
                    {legalLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="font-sans text-sm text-white/30 hover:text-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            localStorage.removeItem('rsla_cookie_consent');
                            window.location.reload();
                        }}
                        className="font-sans text-sm text-white/30 hover:text-white transition-colors"
                    >
                        Cookie Settings
                    </button>
                </div>

                {/* Copyright */}
                <p className="font-sans text-sm text-white/30 shrink-0">
                    &copy; {new Date().getFullYear()} RSL/A. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
