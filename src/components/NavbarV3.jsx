import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const serviceSubLinks = [
    {
        title: 'Websites',
        url: '/services/web-design',
        description: 'Fast, SEO-ready builds that ship in weeks.',
    },
    {
        title: 'Search Visibility',
        url: '/services/search-visibility',
        description: 'Rankings on Google, ChatGPT, Perplexity, and Claude.',
    },
    {
        title: 'AI Automations',
        url: '/services/ai-automations',
        description: 'n8n, Make, and custom scripts that replace manual work.',
    },
    {
        title: 'CRM Systems',
        url: '/services/crm-systems',
        description: 'GoHighLevel pipelines, workflows, and integrations.',
    },
    {
        title: 'Custom Development',
        url: '/services/custom-development',
        description: 'SaaS products, MVPs, internal tools, APIs.',
    },
];

const menu = [
    { title: 'Home', url: '/' },
    { title: 'About', url: '/about' },
    { title: 'Services', url: '/services', children: serviceSubLinks },
    { title: 'Work', url: '/work' },
    { title: 'Blog', url: '/blog' },
];

const LOGO_SRC = '/images/logo/logomark.svg';

export default function NavbarV3() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
    const location = useLocation();

    const servicesTriggerRef = useRef(null);
    const servicesMenuRef = useRef(null);
    // 'first' | 'last' | null — what to focus once the menu is open
    const pendingFocusRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
        setDesktopServicesOpen(false);
    }, [location.pathname]);

    // Lock body scroll and handle Escape when mobile menu is open
    useEffect(() => {
        if (!mobileOpen) return;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        };
    }, [mobileOpen]);

    // After the menu opens, move focus to the requested item (if any)
    useEffect(() => {
        if (!desktopServicesOpen || !pendingFocusRef.current) return;
        const items = servicesMenuRef.current?.querySelectorAll('a[role="menuitem"]');
        if (!items || items.length === 0) {
            pendingFocusRef.current = null;
            return;
        }
        const target = pendingFocusRef.current === 'last' ? items.length - 1 : 0;
        items[target]?.focus();
        pendingFocusRef.current = null;
    }, [desktopServicesOpen]);

    // Global Escape listener: close the menu from anywhere on the page
    useEffect(() => {
        if (!desktopServicesOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setDesktopServicesOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [desktopServicesOpen]);

    const focusServicesMenuItem = (targetIndex) => {
        const items = servicesMenuRef.current?.querySelectorAll('a[role="menuitem"]');
        if (!items || items.length === 0) return;
        const normalized = ((targetIndex % items.length) + items.length) % items.length;
        items[normalized]?.focus();
    };

    const closeServicesMenuAndRefocusTrigger = () => {
        setDesktopServicesOpen(false);
        servicesTriggerRef.current?.focus();
    };

    const handleServicesTriggerKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            // If already open (e.g. mouse hover), focus first item immediately
            if (desktopServicesOpen) {
                focusServicesMenuItem(0);
            } else {
                pendingFocusRef.current = 'first';
                setDesktopServicesOpen(true);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (desktopServicesOpen) {
                focusServicesMenuItem(-1);
            } else {
                pendingFocusRef.current = 'last';
                setDesktopServicesOpen(true);
            }
        }
        // Escape on trigger is handled by the global Escape listener
    };

    const handleServicesMenuKeyDown = (e) => {
        const items = Array.from(servicesMenuRef.current?.querySelectorAll('a[role="menuitem"]') || []);
        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === 'Escape') {
            e.preventDefault();
            closeServicesMenuAndRefocusTrigger();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusServicesMenuItem(currentIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusServicesMenuItem(currentIndex - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            focusServicesMenuItem(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            focusServicesMenuItem(items.length - 1);
        }
        // Tab falls through — browser moves focus naturally, onBlur handles close
    };

    const isActive = (url) => {
        if (url === '/') return location.pathname === '/';
        return location.pathname.startsWith(url);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
                    scrolled || mobileOpen
                        ? 'bg-background/85 backdrop-blur-md border-b border-accent-border'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
                    {/* Desktop */}
                    <nav className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
                        <Link to="/" className="flex items-center shrink-0 justify-self-start" aria-label="RSL/A home">
                            <img
                                src={LOGO_SRC}
                                alt="RSL/A"
                                className="h-10 w-auto"
                                width="40"
                                height="40"
                            />
                        </Link>
                        <ul className="flex items-center justify-self-center">
                            {menu.map((item) => {
                                const active = isActive(item.url);

                                if (item.children) {
                                    return (
                                        <li
                                            key={item.url}
                                            className="relative"
                                            onMouseEnter={() => setDesktopServicesOpen(true)}
                                            onMouseLeave={(e) => {
                                                // Keep open if keyboard focus is still inside the menu group
                                                if (e.currentTarget.contains(document.activeElement)) return;
                                                setDesktopServicesOpen(false);
                                            }}
                                            onBlur={(e) => {
                                                // Close only when focus has left the entire menu group
                                                if (e.currentTarget.contains(e.relatedTarget)) return;
                                                setDesktopServicesOpen(false);
                                            }}
                                        >
                                            <Link
                                                ref={servicesTriggerRef}
                                                to={item.url}
                                                aria-haspopup="menu"
                                                aria-expanded={desktopServicesOpen}
                                                onKeyDown={handleServicesTriggerKeyDown}
                                                className={`inline-flex h-11 items-center gap-1 px-5 font-sans font-medium text-base transition-colors ${
                                                    active ? 'text-accent' : 'text-text/70 hover:text-text'
                                                }`}
                                            >
                                                {item.title}
                                                <ChevronDown
                                                    size={14}
                                                    strokeWidth={2}
                                                    className={`opacity-50 transition-transform ${desktopServicesOpen ? 'rotate-180' : ''}`}
                                                />
                                            </Link>
                                            <div
                                                className={`absolute top-full left-1/2 pt-3 origin-top transition-[opacity,transform,visibility] duration-sm ease-out-smooth ${
                                                    desktopServicesOpen
                                                        ? 'visible opacity-100 -translate-x-1/2 scale-100'
                                                        : 'invisible opacity-0 -translate-x-1/2 scale-95'
                                                }`}
                                                onKeyDown={handleServicesMenuKeyDown}
                                            >
                                                <div
                                                    ref={servicesMenuRef}
                                                    role="menu"
                                                    aria-label="Services menu"
                                                    className="bg-surface border border-accent-border rounded-2xl shadow-[0_12px_40px_-8px_rgba(15,23,42,0.15)] overflow-hidden w-[560px]"
                                                >
                                                    <div className="grid grid-cols-2 gap-px bg-accent-border">
                                                        {item.children.map((child) => {
                                                            const isCurrent = location.pathname === child.url;
                                                            return (
                                                                <Link
                                                                    key={child.url}
                                                                    to={child.url}
                                                                    role="menuitem"
                                                                    tabIndex={desktopServicesOpen ? 0 : -1}
                                                                    className={`group/tile block px-5 py-4 bg-surface transition-colors ${
                                                                        isCurrent ? 'bg-accent-light' : 'hover:bg-accent-light focus-visible:bg-accent-light'
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`font-sans font-semibold text-base mb-1 transition-colors ${
                                                                            isCurrent ? 'text-accent' : 'text-text group-hover/tile:text-accent'
                                                                        }`}
                                                                    >
                                                                        {child.title}
                                                                    </div>
                                                                    <p className="font-sans text-sm text-textMuted leading-snug">
                                                                        {child.description}
                                                                    </p>
                                                                </Link>
                                                            );
                                                        })}
                                                        {/* 6th tile — See all services CTA */}
                                                        <Link
                                                            to={item.url}
                                                            role="menuitem"
                                                            tabIndex={desktopServicesOpen ? 0 : -1}
                                                            className="group/tile flex items-center justify-between px-5 py-4 bg-accent-light hover:bg-accent/10 focus-visible:bg-accent/10 transition-colors"
                                                        >
                                                            <span className="font-sans font-semibold text-base text-accent">
                                                                See all services
                                                            </span>
                                                            <ArrowRight
                                                                size={16}
                                                                strokeWidth={2}
                                                                className="text-accent transition-transform group-hover/tile:translate-x-1"
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.url}>
                                        <Link
                                            to={item.url}
                                            className={`inline-flex h-11 items-center px-5 font-sans font-medium text-base transition-colors ${
                                                active ? 'text-accent' : 'text-text/70 hover:text-text'
                                            }`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="flex items-center gap-2 shrink-0 justify-self-end">
                            <Link to="/contact" onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'navbar' })}>
                                <InteractiveHoverButton
                                    className="font-sans font-bold text-sm px-5 py-2.5"
                                >
                                    Let&apos;s Talk
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile */}
                    <div className="flex lg:hidden items-center justify-between">
                        <Link to="/" className="flex items-center" aria-label="RSL/A home">
                            <img
                                src={LOGO_SRC}
                                alt="RSL/A"
                                className="h-10 w-auto"
                                width="40"
                                height="40"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-text transition-colors ${
                                scrolled || mobileOpen
                                    ? 'bg-surface border border-accent-border'
                                    : 'bg-white/60 backdrop-blur-sm'
                            }`}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile sheet */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 top-[72px] z-40 bg-background">
                    <div className="flex flex-col justify-between h-full px-6 pb-8 pt-6 overflow-y-auto">
                        <nav className="flex flex-col gap-1">
                            {menu.map((item) => {
                                if (item.children) {
                                    return (
                                        <div key={item.url}>
                                            <button
                                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                                className={`w-full flex items-center justify-between py-3.5 px-2 rounded-xl font-sans font-semibold text-2xl tracking-tight transition-colors ${
                                                    isActive(item.url) ? 'text-accent' : 'text-text'
                                                } ${mobileServicesOpen ? 'bg-accent-light' : ''}`}
                                            >
                                                {item.title}
                                                <ChevronDown size={20} strokeWidth={2.5} className={`text-textMuted transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileServicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                                <div className="overflow-hidden">
                                                    <div className="grid grid-cols-2 gap-2 px-1 pt-2 pb-3">
                                                        {item.children.map((child) => {
                                                            const isCurrent = location.pathname === child.url;
                                                            return (
                                                                <Link
                                                                    key={child.url}
                                                                    to={child.url}
                                                                    className={`flex flex-col gap-1 rounded-xl border px-3.5 py-3 transition-colors ${
                                                                        isCurrent
                                                                            ? 'border-accent/30 bg-accent-light'
                                                                            : 'border-accent-border bg-surface active:bg-accent-light'
                                                                    }`}
                                                                >
                                                                    <span className={`font-sans font-semibold text-sm ${isCurrent ? 'text-accent' : 'text-text'}`}>
                                                                        {child.title}
                                                                    </span>
                                                                    <span className="font-sans text-xs text-textMuted leading-snug">
                                                                        {child.description}
                                                                    </span>
                                                                </Link>
                                                            );
                                                        })}
                                                        <Link
                                                            to={item.url}
                                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-accent/30 px-3.5 py-3 transition-colors active:bg-accent-light"
                                                        >
                                                            <span className="font-sans font-semibold text-sm text-accent">All services</span>
                                                            <ArrowRight size={14} strokeWidth={2.5} className="text-accent" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={item.url}
                                        to={item.url}
                                        className={`block py-3.5 px-2 rounded-xl font-sans font-semibold text-2xl tracking-tight transition-colors ${
                                            isActive(item.url) ? 'text-accent' : 'text-text active:bg-accent-light'
                                        }`}
                                    >
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                        <Link to="/contact" onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'mobile_menu' })}>
                            <InteractiveHoverButton
                                className="w-full font-sans font-bold text-base px-6 py-4"
                            >
                                Let&apos;s Talk
                            </InteractiveHoverButton>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
