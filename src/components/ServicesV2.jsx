/**
 * ServicesV2 — Magic UI Bento grid with 5 service tiles.
 * Row 1: Websites (col-span-2), Search Visibility (col-span-1)
 * Row 2: AI Automations, CRM Systems, Custom Development (each col-span-1)
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function usePauseOffscreen(containerRef, tlRef) {
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let observer;
        const id = setTimeout(() => {
            if (!tlRef.current) return;
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) tlRef.current?.play();
                    else tlRef.current?.pause();
                },
                { threshold: 0 }
            );
            observer.observe(el);
        }, 0);

        return () => {
            clearTimeout(id);
            observer?.disconnect();
        };
    }, [containerRef, tlRef]);
}
import {
    Search,
    Users,
    Mail,
    Sparkles,
    Bell,
    Check,
    MousePointer2,
} from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Custom SVG service icons                                           */
/* ------------------------------------------------------------------ */

function WebsiteIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} xmlns="http://www.w3.org/2000/svg">
            <path d="M39.93,55.72A24.86,24.86,0,1,1,56.86,32.15a37.24,37.24,0,0,1-.73,6" />
            <path d="M37.86,51.1A47,47,0,0,1,32,56.7" />
            <path d="M32,7A34.14,34.14,0,0,1,43.57,30a34.07,34.07,0,0,1,.09,4.85" />
            <path d="M32,7A34.09,34.09,0,0,0,20.31,32.46c0,16.2,7.28,21,11.66,24.24" />
            <line x1="10.37" y1="19.9" x2="53.75" y2="19.9" />
            <line x1="32" y1="6.99" x2="32" y2="56.7" />
            <line x1="11.05" y1="45.48" x2="37.04" y2="45.48" />
            <line x1="7.14" y1="32.46" x2="56.86" y2="31.85" />
            <path d="M53.57,57,58,52.56l-8-8,4.55-2.91a.38.38,0,0,0-.12-.7L39.14,37.37a.39.39,0,0,0-.46.46L42,53.41a.39.39,0,0,0,.71.13L45.57,49Z" />
        </svg>
    );
}

function SeoIcon({ className }) {
    return (
        <svg className={className} viewBox="-0.5 0 25 25" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.8201C22 9.84228 21.4135 7.90885 20.3147 6.26436C19.2159 4.61987 17.6542 3.33813 15.8269 2.58126C13.9996 1.82438 11.9889 1.62637 10.0491 2.01223C8.10927 2.39808 6.32748 3.35052 4.92896 4.74904C3.53043 6.14757 2.578 7.92935 2.19214 9.86916C1.80629 11.809 2.00436 13.8197 2.76123 15.6469C3.51811 17.4742 4.79985 19.036 6.44434 20.1348C8.08883 21.2336 10.0222 21.8201 12 21.8201" />
            <path d="M2 11.8201H22" />
            <path d="M12 21.8201C10.07 21.8201 8.5 17.3401 8.5 11.8201C8.5 6.30007 10.07 1.82007 12 1.82007C13.93 1.82007 15.5 6.30007 15.5 11.8201" />
            <circle cx="18.3691" cy="18.1901" r="3.5" />
            <path d="M22.9998 22.8202L20.8398 20.6702" />
        </svg>
    );
}

function AutomationsIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.2 18V11C4.2 9.343 5.543 8 7.2 8H16.8C18.457 8 19.8 9.343 19.8 11V18C19.8 19.657 18.457 21 16.8 21H7.2C5.543 21 4.2 19.657 4.2 18Z" stroke="currentColor" strokeWidth={1.7} />
            <path d="M12 5V8" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
            <path d="M20 12H21C22.105 12 23 12.895 23 14V15.446C23 16.264 22.502 16.999 21.743 17.303L20 18" stroke="currentColor" strokeWidth={1.7} />
            <path d="M4 12H3C1.895 12 1 12.895 1 14V15.446C1 16.264 1.498 16.999 2.257 17.303L4 18" stroke="currentColor" strokeWidth={1.7} />
            <rect x="15.15" y="11.15" width="1.7" height="3.7" rx="0.85" fill="currentColor" />
            <rect x="7.15" y="11.15" width="1.7" height="3.7" rx="0.85" fill="currentColor" />
            <circle cx="12" cy="3" r="2" fill="currentColor" />
            <path d="M10 17H14" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
            <path d="M22 12V10" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
            <path d="M2 12V10" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
        </svg>
    );
}

function CrmIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 20C17 18.343 14.761 17 12 17C9.239 17 7 18.343 7 20M21 17C21 15.77 19.766 14.713 18 14.25M3 17C3 15.77 4.234 14.713 6 14.25M18 10.236C18.614 9.687 19 8.889 19 8C19 6.343 17.657 5 16 5C15.232 5 14.531 5.289 14 5.764M6 10.236C5.386 9.687 5 8.889 5 8C5 6.343 6.343 5 8 5C8.768 5 9.469 5.289 10 5.764M12 14C10.343 14 9 12.657 9 11C9 9.343 10.343 8 12 8C13.657 8 15 9.343 15 11C15 12.657 13.657 14 12 14Z" />
        </svg>
    );
}

function CustomDevIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.01 0.859L6.01 14.859L7.99 15.141L9.99 1.141L8.01 0.859Z" />
            <path d="M12.5 11.5L11.086 10.086L13.172 8L11.086 5.914L12.5 4.5L16 8L12.5 11.5Z" />
            <path d="M2.828 8L4.914 10.086L3.5 11.5L0 8L3.5 4.5L4.914 5.914L2.828 8Z" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Tile 1: Websites — live build-out (wireframe → polished → ship)   */
/* ------------------------------------------------------------------ */

function WebsitesBackground() {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const pulseRef = useRef(null);
    const tlRef = useRef(null);
    usePauseOffscreen(containerRef, tlRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.wire-el', { opacity: 1, scale: 1 });
                gsap.set('.live-el', { opacity: 1 });
                gsap.set('.toast', { opacity: 1, y: 0, scale: 1 });
                gsap.set('.scanner', { opacity: 0 });
                gsap.set(cursorRef.current, { opacity: 0 });
                gsap.set(pulseRef.current, { opacity: 0 });
                return;
            }

            const stops = [
                { x: 60, y: 22, sel: '.wire-nav' },
                { x: 80, y: 70, sel: '.wire-hero' },
                { x: 200, y: 152, sel: '.wire-grid' },
                { x: 210, y: 192, sel: '.wire-footer' },
            ];

            // Initial state
            gsap.set('.wire-el', { opacity: 0, scale: 0.94, transformOrigin: 'left top' });
            gsap.set('.live-el', { opacity: 0 });
            gsap.set('.toast', { opacity: 0, y: 8, scale: 0.92 });
            gsap.set('.scanner', { top: 0, opacity: 0 });
            gsap.set(cursorRef.current, { x: -10, y: 210, opacity: 0 });
            gsap.set(pulseRef.current, { x: 0, y: 0, scale: 0, opacity: 0 });

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
            tlRef.current = tl;

            // Cursor enters
            tl.to(cursorRef.current, { opacity: 1, duration: 0.2 }, 0);

            // 4 click stops — cursor moves, pulses, wire pops
            let t = 0.05;
            stops.forEach((stop) => {
                tl.to(
                    cursorRef.current,
                    { x: stop.x, y: stop.y, duration: 0.32, ease: 'power2.inOut' },
                    t
                );
                t += 0.32;
                tl.set(
                    pulseRef.current,
                    { x: stop.x - 9, y: stop.y - 9, scale: 0, opacity: 0.85 },
                    t
                );
                tl.to(
                    pulseRef.current,
                    { scale: 2.6, opacity: 0, duration: 0.5, ease: 'power2.out' },
                    t
                );
                tl.to(
                    stop.sel,
                    { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.9)' },
                    t + 0.02
                );
                t += 0.18;
            });

            // Cursor exits up-right
            tl.to(
                cursorRef.current,
                { x: 420, y: -16, opacity: 0, duration: 0.45, ease: 'power2.in' },
                t
            );

            // Scanner sweep + wire→live crossfade
            const sweepStart = t + 0.15;
            tl.addLabel('sweep', sweepStart);
            tl.to('.scanner', { opacity: 1, duration: 0.12 }, 'sweep');
            tl.to(
                '.scanner',
                { top: '100%', duration: 1.35, ease: 'none' },
                'sweep+=0.05'
            );
            tl.to('.scanner', { opacity: 0, duration: 0.18 }, 'sweep+=1.3');
            tl.to(
                '.live-el',
                { opacity: 1, duration: 0.42, stagger: 0.3, ease: 'power1.out' },
                'sweep+=0.15'
            );
            tl.to(
                '.wire-el',
                { opacity: 0, duration: 0.42, stagger: 0.3, ease: 'power1.out' },
                'sweep+=0.15'
            );

            // Shipped toast
            tl.to(
                '.toast',
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' },
                '+=0.15'
            );

            // Hold the finished site
            tl.to({}, { duration: 1.4 });

            // Reset
            tl.to('.toast', { opacity: 0, duration: 0.3 });
            tl.set('.wire-el', { opacity: 0, scale: 0.94 });
            tl.set('.live-el', { opacity: 0 });
            tl.set('.scanner', { top: 0 });
            tl.set(cursorRef.current, { x: -10, y: 210, opacity: 0 });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-0 top-6 flex justify-center px-6 [mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)]"
        >
            <div className="w-full max-w-[440px] overflow-hidden rounded-xl border border-accent-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,0,0,0.08)]">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-accent-border px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <div className="ml-2 flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
                        <span className="font-sans text-[9px] text-textMuted">rsla.io</span>
                    </div>
                </div>

                {/* Site canvas */}
                <div className="relative h-[220px] overflow-hidden bg-slate-50/60 p-3.5">
                    {/* Scanner line */}
                    <div className="scanner pointer-events-none absolute inset-x-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_14px_2px_rgba(0,102,224,0.55)]" />

                    {/* Click pulse */}
                    <div
                        ref={pulseRef}
                        className="pointer-events-none absolute left-0 top-0 z-20 h-[18px] w-[18px] rounded-full border-2 border-accent"
                    />

                    {/* Nav row */}
                    <div className="relative mb-3 h-5">
                        <div className="wire-el wire-nav absolute inset-0 flex items-center">
                            <div className="h-2.5 w-14 rounded-sm bg-slate-200" />
                            <div className="ml-auto flex gap-1.5">
                                <div className="h-1.5 w-7 rounded-sm bg-slate-200" />
                                <div className="h-1.5 w-7 rounded-sm bg-slate-200" />
                                <div className="h-1.5 w-7 rounded-sm bg-slate-200" />
                            </div>
                        </div>
                        <div className="live-el absolute inset-0 flex items-center">
                            <div className="flex items-center gap-1">
                                <div className="h-2.5 w-2.5 rounded-sm bg-accent" />
                                <span className="font-sans text-[9px] font-bold text-text">rsla.io</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2 font-sans text-[8px] font-semibold text-textMuted">
                                <span>Work</span>
                                <span>About</span>
                                <span>Contact</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero section */}
                    <div className="relative mb-3 h-[72px]">
                        <div className="wire-el wire-hero absolute inset-0 space-y-1.5">
                            <div className="h-3 w-4/5 rounded-sm bg-slate-200" />
                            <div className="h-3 w-3/5 rounded-sm bg-slate-200" />
                            <div className="mt-2 h-1.5 w-2/3 rounded-sm bg-slate-200" />
                            <div className="mt-2 h-4 w-16 rounded-sm bg-slate-200" />
                        </div>
                        <div className="live-el absolute inset-0">
                            <p className="font-sans text-[12px] font-extrabold leading-[1.15] tracking-tight text-text">
                                Launches that{' '}
                                <span className="font-sans font-bold text-accent">ship</span> in weeks.
                            </p>
                            <p className="mt-1 font-sans text-[8px] leading-snug text-textMuted">
                                Custom-designed, SEO-ready, built to convert.
                            </p>
                            <div className="mt-1.5 inline-flex h-[18px] items-center gap-1 rounded-md bg-accent px-2 font-sans text-[8px] font-semibold text-white shadow-sm">
                                Get started
                                <span className="text-[10px] leading-none">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Feature grid */}
                    <div className="relative mb-3 h-[40px]">
                        <div className="wire-el wire-grid absolute inset-0 grid grid-cols-3 gap-1.5">
                            <div className="rounded-sm bg-slate-200" />
                            <div className="rounded-sm bg-slate-200" />
                            <div className="rounded-sm bg-slate-200" />
                        </div>
                        <div className="live-el absolute inset-0 grid grid-cols-3 gap-1.5">
                            {['Fast', 'SEO', 'Custom'].map((label) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center justify-center gap-1 rounded-sm border border-accent-border bg-white py-1"
                                >
                                    <div className="h-2 w-2 rounded-full bg-accent/80" />
                                    <span className="font-sans text-[7px] font-semibold text-textMuted">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer bar */}
                    <div className="relative h-2.5">
                        <div className="wire-el wire-footer absolute inset-0 rounded-sm bg-slate-200" />
                        <div className="live-el absolute inset-0 rounded-sm bg-text" />
                    </div>

                    {/* Cursor */}
                    <div
                        ref={cursorRef}
                        className="pointer-events-none absolute left-0 top-0 z-30"
                    >
                        <MousePointer2
                            className="h-3.5 w-3.5 fill-white text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                            strokeWidth={2}
                        />
                    </div>

                    {/* Shipped toast */}
                    <div className="toast absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-md bg-text px-2 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
                        <Check className="h-2.5 w-2.5 text-green-400" strokeWidth={3} />
                        <span className="font-sans text-[8px] font-semibold text-white">
                            Shipped to rsla.io
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tile 2: Search Visibility — cursor drags rsla.io from page 47 → #1 */
/* ------------------------------------------------------------------ */

const serpCompetitors = [
    { domain: 'agencyone.com', color: '#6366F1' },
    { domain: 'growthlab.io', color: '#F59E0B' },
    { domain: 'pivotmedia.co', color: '#EC4899' },
    { domain: 'scaleagency.net', color: '#0EA5E9' },
];

function SearchVisibilityBackground() {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const cardRef = useRef(null);
    const dividerRef = useRef(null);
    const tlRef = useRef(null);
    usePauseOffscreen(containerRef, tlRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.serp-row', { opacity: 1, y: 0 });
                gsap.set(cardRef.current, { opacity: 1, y: 0, scale: 1 });
                gsap.set(dividerRef.current, { opacity: 1 });
                gsap.set(cursorRef.current, { opacity: 0 });
                return;
            }

            const setBuriedBadge = () => {
                const badge = cardRef.current?.querySelector('.rank-badge');
                if (!badge) return;
                badge.textContent = '#47';
                badge.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
                badge.style.color = '#EF4444';
                badge.style.borderColor = 'rgba(239, 68, 68, 0.45)';
            };
            const setTopBadge = () => {
                const badge = cardRef.current?.querySelector('.rank-badge');
                if (!badge) return;
                badge.textContent = '#1';
                badge.style.backgroundColor = 'rgba(16, 185, 129, 0.16)';
                badge.style.color = '#10B981';
                badge.style.borderColor = 'rgba(16, 185, 129, 0.45)';
            };

            // Initial state
            gsap.set(cursorRef.current, { x: -14, y: 178, opacity: 0 });
            gsap.set('.serp-row', { opacity: 0, y: -4 });
            gsap.set(cardRef.current, { opacity: 0, y: 0, scale: 1 });
            gsap.set(dividerRef.current, { opacity: 0 });
            setBuriedBadge();

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
            tlRef.current = tl;

            // Phase 1: SERP populates
            tl.to('.serp-row', {
                opacity: 1,
                y: 0,
                duration: 0.32,
                stagger: 0.06,
                ease: 'power2.out',
            });
            tl.to(dividerRef.current, { opacity: 1, duration: 0.25 }, '<+0.15');
            tl.to(cardRef.current, { opacity: 0.55, duration: 0.3 }, '<');

            // Phase 2: Cursor enters and travels to the buried card
            tl.to(cursorRef.current, { opacity: 1, duration: 0.15 }, '<+0.15');
            tl.to(cursorRef.current, {
                x: 110,
                y: 142,
                duration: 0.55,
                ease: 'power2.inOut',
            });

            // Phase 3: Grab — card lifts and brightens
            tl.to(cardRef.current, {
                opacity: 1,
                scale: 1.05,
                duration: 0.22,
                ease: 'power2.out',
            });

            // Phase 4: Drag both up by 122px (buried 132 → top 10)
            tl.to(
                [cursorRef.current, cardRef.current],
                {
                    y: '-=122',
                    duration: 1.15,
                    ease: 'power2.inOut',
                }
            );
            // Competitors slide down a slot to make room
            tl.to(
                '.serp-row',
                {
                    y: '+=28',
                    duration: 0.55,
                    stagger: 0.08,
                    ease: 'power2.out',
                },
                '<+0.05'
            );
            // Page divider fades out
            tl.to(dividerRef.current, { opacity: 0, duration: 0.4 }, '<');

            // Phase 5: Release — settle scale, flip badge, ring pulse
            tl.to(cardRef.current, { scale: 1, duration: 0.2 });
            tl.call(setTopBadge);
            tl.fromTo(
                cardRef.current,
                { boxShadow: '0 0 0 0px rgba(16, 185, 129, 0)' },
                {
                    boxShadow: '0 0 0 5px rgba(16, 185, 129, 0.32)',
                    duration: 0.32,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out',
                }
            );

            // Phase 6: Cursor jiggles release and exits
            tl.to(cursorRef.current, { x: '+=22', y: '-=10', duration: 0.3 }, '+=0.1');
            tl.to(cursorRef.current, { opacity: 0, duration: 0.3 });

            // Phase 7: Hold the win
            tl.to({}, { duration: 1.0 });

            // Phase 8: Reset
            tl.to('.serp-row', { opacity: 0, duration: 0.3 });
            tl.to(cardRef.current, { opacity: 0, duration: 0.3 }, '<');
            tl.set('.serp-row', { y: 0 });
            tl.set(cardRef.current, { y: 0, scale: 1, boxShadow: 'none' });
            tl.set(cursorRef.current, { x: -14, y: 178 });
            tl.call(setBuriedBadge);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-0 top-3 flex justify-center px-3 [mask-image:linear-gradient(to_bottom,#000_92%,transparent_100%)]"
        >
            <div className="w-full max-w-[280px] overflow-hidden rounded-xl border border-accent-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,0,0,0.08)]">
                {/* Search bar */}
                <div className="flex items-center gap-1.5 border-b border-accent-border bg-slate-50 px-3 py-2">
                    <Search className="h-3 w-3 text-textMuted" strokeWidth={2.4} />
                    <span className="font-sans text-[9px] text-text">ai marketing agency</span>
                    <span className="ml-auto font-sans text-[7px] text-textMuted">487M</span>
                </div>

                {/* SERP canvas */}
                <div className="relative h-[170px] overflow-hidden bg-white p-2.5">
                    {/* Competitor results */}
                    {serpCompetitors.map((c, i) => (
                        <div
                            key={c.domain}
                            className="serp-row absolute inset-x-2.5 flex items-center gap-2 rounded-md border border-accent-border bg-white px-2"
                            style={{ top: `${10 + i * 28}px`, height: '24px' }}
                        >
                            <div
                                className="h-3.5 w-3.5 shrink-0 rounded-sm"
                                style={{ background: c.color }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="font-sans text-[9px] font-semibold text-text leading-tight truncate">
                                    {c.domain}
                                </div>
                                <div className="mt-0.5 h-[2px] w-2/3 rounded-full bg-slate-200" />
                            </div>
                        </div>
                    ))}

                    {/* Page divider */}
                    <div
                        ref={dividerRef}
                        className="absolute inset-x-2.5 flex items-center gap-1.5"
                        style={{ top: '124px' }}
                    >
                        <div className="h-px flex-1 bg-accent-border" />
                        <span className="font-sans text-[7px] font-semibold uppercase tracking-wide text-textMuted">
                            Page 47
                        </span>
                        <div className="h-px flex-1 bg-accent-border" />
                    </div>

                    {/* Buried rsla.io card */}
                    <div
                        ref={cardRef}
                        className="absolute inset-x-2.5 z-20 flex items-center gap-2 rounded-md border-2 border-accent bg-white px-2 shadow-[0_4px_14px_rgba(0,102,224,0.18)]"
                        style={{ top: '132px', height: '24px' }}
                    >
                        <span
                            className="rank-badge flex h-5 min-w-[28px] items-center justify-center rounded border font-sans text-[9px] font-extrabold tabular-nums"
                        >
                            #47
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="font-sans text-[9px] font-bold text-accent leading-tight truncate">
                                rsla.io
                            </div>
                            <div className="mt-0.5 h-[2px] w-2/3 rounded-full bg-accent/40" />
                        </div>
                    </div>

                    {/* Cursor */}
                    <div
                        ref={cursorRef}
                        className="pointer-events-none absolute left-0 top-0 z-30"
                    >
                        <MousePointer2
                            className="h-3.5 w-3.5 fill-white text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                            strokeWidth={2}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tile 3: AI Automations — n8n-style pipeline with traveling packet */
/* ------------------------------------------------------------------ */

const automationNodes = [
    { icon: Mail, name: 'New lead', meta: 'form.submit', tint: '#6366F1' },
    { icon: Sparkles, name: 'AI score', meta: '94 / 100', tint: '#10A37F' },
    { icon: Users, name: 'Assign rep', meta: '→ Sarah', tint: '#F59E0B' },
    { icon: Bell, name: 'Slack ping', meta: '#deals', tint: '#EC4899' },
];

function AutomationsBackground() {
    const containerRef = useRef(null);
    const packetRef = useRef(null);
    const tlRef = useRef(null);
    usePauseOffscreen(containerRef, tlRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.auto-node', { opacity: 1, y: 0 });
                gsap.set('.auto-check', { opacity: 1, scale: 1 });
                gsap.set(packetRef.current, { opacity: 0 });
                return;
            }

            // Initial state
            gsap.set('.auto-node', { opacity: 0, y: 6 });
            gsap.set('.auto-check', { opacity: 0, scale: 0 });
            gsap.set(packetRef.current, {
                xPercent: -50,
                opacity: 0,
                y: -10,
            });

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
            tlRef.current = tl;

            // Phase 1: nodes fade in stacked
            tl.to('.auto-node', {
                opacity: 1,
                y: 0,
                duration: 0.32,
                stagger: 0.1,
                ease: 'power2.out',
            });

            // Phase 2: packet appears above node 1
            tl.set(packetRef.current, { y: -10 });
            tl.to(packetRef.current, { opacity: 1, duration: 0.15 });

            // Phase 3: process each node (packet drops in, lights up, checks)
            const nodeCenters = [18, 66, 114, 162];
            nodeCenters.forEach((y, i) => {
                tl.to(packetRef.current, {
                    y,
                    duration: 0.34,
                    ease: 'power1.inOut',
                });
                tl.to(`.auto-node-${i}`, {
                    borderColor: '#0066E0',
                    backgroundColor: 'rgba(0, 102, 224, 0.06)',
                    boxShadow: '0 0 0 2px rgba(0, 102, 224, 0.15)',
                    duration: 0.18,
                });
                tl.to(`.auto-icon-${i}`, {
                    scale: 1.18,
                    duration: 0.16,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out',
                });
                tl.to(`.auto-check-${i}`, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.22,
                    ease: 'back.out(2.2)',
                });
            });

            // Phase 4: packet fades out
            tl.to(packetRef.current, { opacity: 0, duration: 0.25 });

            // Phase 5: hold the all-checked state
            tl.to({}, { duration: 1.0 });

            // Phase 6: reset
            tl.to('.auto-node', { opacity: 0, duration: 0.3 });
            tl.to('.auto-check', { opacity: 0, duration: 0.2 }, '<');
            tl.set('.auto-node', {
                y: 6,
                clearProps: 'borderColor,backgroundColor,boxShadow',
            });
            tl.set('.auto-check', { scale: 0 });
            tl.set(packetRef.current, { y: -10, opacity: 0 });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-0 top-3 flex justify-center px-4 [mask-image:linear-gradient(to_bottom,#000_92%,transparent_100%)]"
        >
            <div className="relative w-full max-w-[220px]">
                {automationNodes.map((n, i) => {
                    const Icon = n.icon;
                    return (
                        <div key={n.name}>
                            {/* Node card */}
                            <div
                                className={`auto-node auto-node-${i} relative flex h-9 items-center gap-2 rounded-md border border-accent-border bg-white px-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
                            >
                                <div
                                    className={`auto-icon auto-icon-${i} flex h-6 w-6 shrink-0 items-center justify-center rounded`}
                                    style={{ background: `${n.tint}1f`, color: n.tint }}
                                >
                                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-sans text-[10px] font-bold text-text leading-tight truncate">
                                        {n.name}
                                    </div>
                                    <div className="font-sans text-[8px] text-textMuted leading-tight">
                                        {n.meta}
                                    </div>
                                </div>
                                {/* Check badge */}
                                <div
                                    className={`auto-check auto-check-${i} flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 shadow-sm`}
                                >
                                    <Check className="h-2 w-2 text-white" strokeWidth={4} />
                                </div>
                            </div>
                            {/* Wire between nodes */}
                            {i < automationNodes.length - 1 && (
                                <div className="flex h-3 justify-center">
                                    <div className="w-[2px] bg-accent-border" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Traveling data packet */}
                <div
                    ref={packetRef}
                    className="pointer-events-none absolute left-1/2 top-0 z-20 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_3px_rgba(0,102,224,0.55)]"
                />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tile 4: CRM Systems — horizontal kanban with deals flowing → Won  */
/* ------------------------------------------------------------------ */

const crmDeals = [
    { initials: 'AF', name: 'Apex Fitness', rep: 'Sarah M.', value: 4200, color: '#6366F1' },
    { initials: 'GC', name: 'Greenline', rep: 'Marcus C.', value: 12500, color: '#10B981' },
    { initials: 'NF', name: 'Novaflow', rep: 'Priya P.', value: 8900, color: '#F59E0B' },
];

function fmtMoney(v) {
    return `$${(v / 1000).toFixed(1)}k`;
}

function CRMBackground() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const revenueRef = useRef(null);
    const tlRef = useRef(null);
    usePauseOffscreen(containerRef, tlRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set(cardRef.current, { opacity: 1, x: 0 });
                return;
            }

            const slots = { lead: 0, prop: 96, won: 192 };
            const revenueCounter = { val: 0 };

            const setRevenue = (v) => {
                if (revenueRef.current) {
                    revenueRef.current.textContent = fmtMoney(v);
                }
            };

            const setCard = (deal) => {
                const initialsEl = cardRef.current?.querySelector('.deal-initials');
                const nameEl = cardRef.current?.querySelector('.deal-name');
                const valueEl = cardRef.current?.querySelector('.deal-value');
                const repEl = cardRef.current?.querySelector('.deal-rep');
                const avatarEl = cardRef.current?.querySelector('.deal-avatar');
                if (initialsEl) initialsEl.textContent = deal.initials;
                if (nameEl) nameEl.textContent = deal.name;
                if (valueEl) valueEl.textContent = fmtMoney(deal.value);
                if (repEl) repEl.textContent = deal.rep;
                if (avatarEl) avatarEl.style.background = deal.color;
            };

            // Initial setup
            gsap.set(cardRef.current, { x: 0, opacity: 0 });
            setRevenue(0);

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
            tlRef.current = tl;

            // Reset revenue at the start of each iteration
            tl.call(() => {
                revenueCounter.val = 0;
                setRevenue(0);
            });

            let totalRevenue = 0;
            crmDeals.forEach((deal) => {
                const target = totalRevenue + deal.value;

                // Reset card to Lead slot, swap deal data, fade in
                tl.set(cardRef.current, {
                    x: 0,
                    opacity: 0,
                    clearProps: 'borderColor,boxShadow',
                });
                tl.call(() => setCard(deal));
                tl.to(cardRef.current, { opacity: 1, duration: 0.22 });
                tl.to({}, { duration: 0.1 });

                // Slide to Proposal
                tl.to(cardRef.current, {
                    x: slots.prop,
                    duration: 0.42,
                    ease: 'power2.inOut',
                });
                tl.to({}, { duration: 0.08 });

                // Slide to Won + green border + revenue ticker (parallel)
                tl.to(cardRef.current, {
                    x: slots.won,
                    duration: 0.42,
                    ease: 'power2.inOut',
                });
                tl.to(
                    cardRef.current,
                    {
                        borderColor: '#10B981',
                        boxShadow: '0 2px 12px rgba(16, 185, 129, 0.28)',
                        duration: 0.2,
                    },
                    '<+0.1'
                );
                tl.to(
                    revenueCounter,
                    {
                        val: target,
                        duration: 0.55,
                        ease: 'power1.out',
                        onUpdate: () => setRevenue(revenueCounter.val),
                    },
                    '<'
                );

                // Hold and fade out
                tl.to({}, { duration: 0.35 });
                tl.to(cardRef.current, { opacity: 0, duration: 0.25 });

                totalRevenue = target;
            });

            // Final hold on the closed total
            tl.to({}, { duration: 0.5 });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-0 top-3 flex justify-center px-3 [mask-image:linear-gradient(to_bottom,#000_92%,transparent_100%)]"
        >
            <div className="w-full max-w-[280px] overflow-hidden rounded-xl border border-accent-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,0,0,0.08)]">
                {/* Header with revenue counter */}
                <div className="flex items-center justify-between border-b border-accent-border bg-slate-50 px-3 py-2">
                    <span className="font-sans text-[8px] font-bold uppercase tracking-wide text-textMuted">
                        Closed today
                    </span>
                    <span
                        ref={revenueRef}
                        className="font-sans text-[14px] font-extrabold text-text tabular-nums leading-none"
                    >
                        $0.0k
                    </span>
                </div>

                {/* Pipeline canvas */}
                <div className="relative h-[120px] p-3">
                    {/* Stage labels */}
                    <div className="absolute inset-x-3 top-3 flex justify-between">
                        <span className="w-[64px] text-center font-sans text-[8px] font-bold uppercase tracking-wide text-textMuted">
                            Lead
                        </span>
                        <span className="w-[64px] text-center font-sans text-[8px] font-bold uppercase tracking-wide text-textMuted">
                            Proposal
                        </span>
                        <span className="w-[64px] text-center font-sans text-[8px] font-bold uppercase tracking-wide text-textMuted">
                            Won
                        </span>
                    </div>

                    {/* Slot indicators */}
                    <div className="absolute inset-x-3 top-7 flex justify-between">
                        <div className="h-[78px] w-[64px] rounded-md border border-dashed border-accent-border" />
                        <div className="h-[78px] w-[64px] rounded-md border border-dashed border-accent-border" />
                        <div className="h-[78px] w-[64px] rounded-md border border-dashed border-accent-border" />
                    </div>

                    {/* Moving deal card */}
                    <div
                        ref={cardRef}
                        className="absolute left-3 top-7 z-10 h-[78px] w-[64px] rounded-md border-2 border-accent bg-white p-1.5 shadow-[0_2px_8px_rgba(0,102,224,0.18)]"
                    >
                        <div
                            className="deal-avatar flex h-5 w-5 items-center justify-center rounded-full font-sans text-[8px] font-bold text-white"
                            style={{ background: '#6366F1' }}
                        >
                            <span className="deal-initials">AF</span>
                        </div>
                        <div className="deal-name mt-1 font-sans text-[8px] font-bold text-text leading-tight truncate">
                            Apex Fitness
                        </div>
                        <div className="deal-value mt-0.5 font-sans text-[11px] font-extrabold text-accent tabular-nums leading-none">
                            $4.2k
                        </div>
                        <div className="deal-rep mt-1 font-sans text-[7px] text-textMuted truncate">
                            Sarah M.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Tile 5: Custom Development — code editor + CI/CD build progress   */
/* ------------------------------------------------------------------ */

const buildSteps = [
    { label: 'lint...', target: 0.2, duration: 0.4 },
    { label: 'test...', target: 0.45, duration: 0.5 },
    { label: 'build...', target: 0.7, duration: 0.5 },
    { label: 'deploy...', target: 0.92, duration: 0.45 },
    { label: '✓ live', target: 1.0, duration: 0.2 },
];

function CustomDevBackground() {
    const containerRef = useRef(null);
    const barRef = useRef(null);
    const statusRef = useRef(null);
    const tlRef = useRef(null);
    usePauseOffscreen(containerRef, tlRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.code-line', { opacity: 1, x: 0 });
                gsap.set(barRef.current, { scaleX: 1 });
                return;
            }

            // Initial state
            gsap.set('.code-line', { opacity: 0, x: -4 });
            gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left' });
            if (statusRef.current) statusRef.current.textContent = 'init...';

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
            tlRef.current = tl;

            // Phase 1: code lines fade in top-to-bottom
            tl.to('.code-line', {
                opacity: 1,
                x: 0,
                duration: 0.25,
                stagger: 0.08,
                ease: 'power2.out',
            });
            tl.to({}, { duration: 0.2 });

            // Phase 2: build steps
            buildSteps.forEach((step) => {
                tl.call(() => {
                    if (statusRef.current) statusRef.current.textContent = step.label;
                });
                tl.to(barRef.current, {
                    scaleX: step.target,
                    duration: step.duration,
                    ease: 'power1.inOut',
                });
            });

            // Phase 3: completion pulse on the bar + status flash
            tl.to(
                barRef.current,
                {
                    boxShadow: '0 0 12px 2px rgba(16, 185, 129, 0.5)',
                    duration: 0.25,
                    yoyo: true,
                    repeat: 1,
                }
            );

            // Phase 4: hold the deployed state
            tl.to({}, { duration: 1.4 });

            // Phase 5: reset
            tl.to('.code-line', { opacity: 0, duration: 0.3 });
            tl.set('.code-line', { x: -4 });
            tl.set(barRef.current, { scaleX: 0, clearProps: 'boxShadow' });
            tl.call(() => {
                if (statusRef.current) statusRef.current.textContent = 'init...';
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-0 top-3 flex justify-center px-3 [mask-image:linear-gradient(to_bottom,#000_92%,transparent_100%)]"
        >
            <div className="w-full max-w-[280px] overflow-hidden rounded-xl border border-accent-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,0,0,0.08)]">
                {/* Editor chrome */}
                <div className="flex items-center gap-1.5 border-b border-accent-border bg-slate-50 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="ml-2 font-sans text-[9px] font-semibold text-text">api.ts</span>
                    <span className="ml-auto font-sans text-[7px] uppercase tracking-wide text-textMuted">
                        dev
                    </span>
                </div>

                {/* Code area */}
                <div className="bg-white px-3 py-2.5 font-sans text-[8px] leading-[1.55]">
                    <div className="code-line flex">
                        <span className="w-3 shrink-0 text-textMuted">1</span>
                        <span className="text-slate-700">
                            <span className="text-purple-600">export</span>{' '}
                            <span className="text-purple-600">async function</span>
                        </span>
                    </div>
                    <div className="code-line flex">
                        <span className="w-3 shrink-0 text-textMuted">2</span>
                        <span className="text-slate-700">
                            {'  '}
                            <span className="text-amber-600">handler</span>(req) {'{'}
                        </span>
                    </div>
                    <div className="code-line flex">
                        <span className="w-3 shrink-0 text-textMuted">3</span>
                        <span className="text-slate-700">
                            {'    '}
                            <span className="text-purple-600">const</span> data ={' '}
                            <span className="text-purple-600">await</span> db.get()
                        </span>
                    </div>
                    <div className="code-line flex">
                        <span className="w-3 shrink-0 text-textMuted">4</span>
                        <span className="text-slate-700">
                            {'    '}
                            <span className="text-purple-600">return</span>{' '}
                            <span className="text-amber-600">Response</span>.json(data)
                        </span>
                    </div>
                    <div className="code-line flex">
                        <span className="w-3 shrink-0 text-textMuted">5</span>
                        <span className="text-slate-700">
                            {'  '}
                            {'}'}
                        </span>
                    </div>
                </div>

                {/* Build status footer */}
                <div className="flex items-center gap-2 border-t border-accent-border bg-slate-900 px-3 py-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-700">
                        <div
                            ref={barRef}
                            className="h-full w-full rounded-full bg-gradient-to-r from-accent to-emerald-400"
                        />
                    </div>
                    <span
                        ref={statusRef}
                        className="w-[52px] text-right font-sans text-[7px] font-semibold text-emerald-300"
                    >
                        init...
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Feature config                                                     */
/* ------------------------------------------------------------------ */

export const features = [
    {
        Icon: WebsiteIcon,
        name: 'Websites',
        description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready. Launches that ship in weeks, not quarters.',
        href: '/services/websites',
        cta: 'See our work',
        className: 'col-span-3 lg:col-span-2 opacity-0',
        background: <WebsitesBackground />,
    },
    {
        Icon: SeoIcon,
        name: 'Search Visibility',
        description: 'Rankings on Google, ChatGPT, Perplexity, and Claude. One system that shows up everywhere buyers look.',
        href: '/services/search-visibility',
        cta: 'How it works',
        className: 'col-span-3 lg:col-span-1 opacity-0',
        background: <SearchVisibilityBackground />,
    },
    {
        Icon: AutomationsIcon,
        name: 'AI Automations',
        description: 'n8n, Make, and custom scripts that replace manual work. Leads qualified and tasks routed while you sleep.',
        href: '/services/ai-automations',
        cta: 'See automations',
        className: 'col-span-3 lg:col-span-1 opacity-0',
        background: <AutomationsBackground />,
    },
    {
        Icon: CrmIcon,
        name: 'CRM Systems',
        description: 'GoHighLevel pipelines, workflows, and integrations. One dashboard for leads, deals, and bookings.',
        href: '/services/crm-systems',
        cta: 'Explore CRM',
        className: 'col-span-3 lg:col-span-1 opacity-0',
        background: <CRMBackground />,
    },
    {
        Icon: CustomDevIcon,
        name: 'Custom Development',
        description: 'SaaS products, MVPs, internal tools, APIs. When off-the-shelf is not enough.',
        href: '/services/custom-development',
        cta: 'Start a build',
        className: 'col-span-3 lg:col-span-1 opacity-0',
        background: <CustomDevBackground />,
    },
];

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

export default function ServicesV2() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.services-bento > *', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo(
                '.services-bento > *',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        once: true,
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-accent-light px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 max-w-3xl">
                    <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text">
                        What we can help you with.
                    </h2>
                    <p className="mt-6 font-sans font-normal text-lg text-textMuted leading-relaxed">
                        End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that's done it across SMBs and enterprise.
                    </p>
                </div>

                <BentoGrid className="services-bento">
                    {features.map((feature) => (
                        <BentoCard key={feature.name} {...feature} />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
