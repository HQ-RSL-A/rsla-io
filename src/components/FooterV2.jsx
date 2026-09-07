import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MAPS_URL, PHONE_DISPLAY, PHONE_TEL } from '@/data/serviceConstants.mjs';

const followLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/rahul.lalia/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahullalia/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@rahul_lalia' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@rahul_lalia' },
    { label: 'X', href: 'https://x.com/rahul_lalia' },
];

const serviceLinks = [
    { label: 'AI automations', to: '/services/automations' },
    { label: 'CRM systems', to: '/services/crm' },
    { label: 'Search visibility', to: '/services/seo' },
    { label: 'Websites', to: '/services/websites' },
    { label: 'Custom builds', to: '/services/custom-builds' },
    { label: 'Bakersfield, CA', to: '/bakersfield' },
];

const exploreLinks = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Work', to: '/work' },
    { label: 'Blog', to: '/blog' },
];

const legalLinks = [
    { label: 'Privacy policy', to: '/privacy-policy' },
    { label: 'Terms of service', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Accessibility', to: '/accessibility' },
];


/*
 * Brand rules on Black (the footer is the site's one dark surface):
 * pure #000000, all text solid Mist #F5F5F7, no alpha tiers, no ALL CAPS.
 * Hierarchy comes from weight; hover feedback is an underline, not a color fade.
 */
function LinkColumn({ title, items }) {
    return (
        <div>
            <p className="font-sans font-bold text-sm mb-5 text-mist">
                {title}
            </p>
            <ul className="flex flex-col gap-1">
                {items.map((item) => {
                    const cls = "font-sans text-sm text-mist hover:underline underline-offset-4 transition-colors inline-flex items-center min-h-[44px]";
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
    const nap = "font-sans text-sm text-mist hover:underline underline-offset-4 inline-flex items-center min-h-[44px]";
    return (
        <footer className="bg-black text-mist px-6 md:px-12">
            {/* Main content */}
            <div className="max-w-7xl mx-auto pt-16 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14 lg:gap-20">
                    {/* Left: CTA plus the crawlable NAP */}
                    <div className="max-w-lg">
                        <h2 className="font-sans font-bold text-2xl md:text-3xl text-mist leading-snug mb-8">
                            Start with a free 30 minute call. We will tell you what to build first and what it would cost.
                        </h2>
                        <Link
                            to="/contact"
                            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'footer' })}
                            className="inline-flex items-center gap-2 rounded-button bg-white text-text px-6 py-3 font-sans font-medium text-sm hover:bg-mist transition-colors"
                        >
                            Book a call
                            <ArrowRight size={16} strokeWidth={2} />
                        </Link>
                        <address className="not-italic mt-10 font-sans text-sm text-mist leading-relaxed">
                            <p className="font-bold">RSL/A</p>
                            <p>
                                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={nap}>Bakersfield, CA 93311</a>
                                <span aria-hidden="true"> · </span>
                                <a href={PHONE_TEL} onClick={() => window.dataLayer?.push({ event: 'phone_click', cta_location: 'footer' })} className={nap}>{PHONE_DISPLAY}</a>
                                <span aria-hidden="true"> · </span>
                                <a href="mailto:hello@rsla.io" className={nap}>hello@rsla.io</a>
                            </p>
                            <p>Serving Kern County in person and clients across the US and Canada.</p>
                        </address>
                    </div>

                    {/* Right: link columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-14">
                        <LinkColumn title="Services" items={serviceLinks} />
                        <LinkColumn title="Explore" items={exploreLinks} />
                        <LinkColumn title="Follow" items={followLinks} />
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
                        className="h-16 w-auto"
                    />
                </Link>

                {/* Legal links */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center">
                    {legalLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="font-sans text-sm text-mist hover:underline underline-offset-4 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => window.CookieScript?.instance?.show()}
                        className="font-sans text-sm text-mist hover:underline underline-offset-4 transition-colors"
                    >
                        Cookie settings
                    </button>
                </div>

                {/* Copyright */}
                <p className="font-sans text-sm text-mist shrink-0">
                    &copy; {new Date().getFullYear()} RSL/A. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
