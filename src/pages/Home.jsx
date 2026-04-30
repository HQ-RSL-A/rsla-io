/**
 * Home — RSL/A homepage.
 *
 * Structure (8 sections):
 *   1. Hero            (HeroV2)
 *   2. Marquee         (LogoMarquee)
 *   3. Headline + intro
 *   4. Case studies    (3-col grid, text-only cards)
 *   5. Founder         (FounderSection)
 *   6. Specialization  (ServicesV2)
 *   7. How it works    (timeline)
 *   8. CTA             (CtaWithGlow)
 *
 * Footer comes from App.jsx chrome.
 *
 * Font hierarchy: Satoshi primary (font-sans). Cormorant italic
 * (font-cormorant) reserved site-wide for pull quotes and captions only.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroV2 from '../components/HeroV2';
import LogoMarquee from '../components/LogoMarquee';
import FounderSection from '../components/FounderSection';
import ServicesV2 from '../components/ServicesV2';
import Testimonials from '../components/Testimonials';
import CtaWithGlow from '../components/CtaWithGlow';
import { client } from '../sanity/lib/client';
import { featuredCaseStudiesV2Query } from '../sanity/lib/queries';
import { urlForImage } from '../sanity/lib/image';

gsap.registerPlugin(ScrollTrigger);

// 4-step process rendered as a timeline.
const processSteps = [
    {
        num: '01',
        title: 'Audit',
        body: "A free 30-minute session where we audit your business, surface the real bottlenecks, and map out exactly what's stopping you from growing.",
    },
    {
        num: '02',
        title: 'Proposal',
        body: "Our team sends over a proposal with a clear scope, a timeline, and a fixed price. There are no surprises and no hourly billing, so you always know exactly what you're paying for.",
    },
    {
        num: '03',
        title: 'Project',
        body: 'We build, test, and deploy systems for you. You get weekly updates and a working product, not a slide deck of promises.',
    },
    {
        num: '04',
        title: 'Ongoing management',
        body: 'For an optional retainer, we keep things running and make them better as you go. Most clients see compounding returns over time.',
    },
];

export default function Home() {
    const rootRef = useRef(null);
    const [caseStudies, setCaseStudies] = useState([]);

    useEffect(() => {
        let isMounted = true;
        client.fetch(featuredCaseStudiesV2Query)
            .then((results) => {
                if (!isMounted) return;
                setCaseStudies(results || []);
                requestAnimationFrame(() => ScrollTrigger.refresh());
            })
            .catch((err) => console.error('Error fetching case studies:', err));
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.utils.toArray('.hr-reveal').forEach((el) => {
                    gsap.set(el, { opacity: 1, y: 0 });
                });
                return;
            }

            gsap.utils.toArray('.hr-reveal').forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                    }
                );
            });
        }, rootRef);
        return () => ctx.revert();
    }, [caseStudies]);

    return (
        <>
            <Seo
                title="RSL/A | The trusted AI growth partner for B2B companies"
                description="We build your website, get it found on Google and ChatGPT, and automate what's slowing you down. Custom websites and AI systems for fast-moving B2B companies."
                keywords="AI growth partner, custom B2B website, AI website agency, SEO for B2B, AI automation, ChatGPT visibility"
                canonical="https://rsla.io"
                jsonLd={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'RSL/A',
                        alternateName: ['RSLA', 'RSL/A', 'RSL A', 'RSL/A Agency'],
                        url: 'https://rsla.io',
                        logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
                        description:
                            "The trusted AI growth partner for fast-moving B2B companies. We build your website, get it found on Google and ChatGPT, and automate what's slowing you down.",
                        founder: {
                            '@type': 'Person',
                            name: 'Rahul Lalia',
                            jobTitle: 'Founder & CEO',
                        },
                        sameAs: [
                            'https://www.instagram.com/rahul.lalia/',
                            'https://www.linkedin.com/in/rahullalia/',
                            'https://www.youtube.com/@rahul_lalia',
                            'https://www.tiktok.com/@rahul_lalia',
                            'https://x.com/rahul_lalia',
                        ],
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'RSL/A',
                        alternateName: ['RSLA', 'RSL/A', 'RSL A'],
                        url: 'https://rsla.io',
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            { '@type': 'Question', name: 'What types of businesses do you work with?', acceptedAnswer: { '@type': 'Answer', text: 'We work with B2B companies and service businesses doing $500K+ in revenue who want to systematize their marketing and operations with AI. If you rely on leads, appointments, or repeat customers to grow, we can help.' } },
                            { '@type': 'Question', name: 'How long does it take to see results?', acceptedAnswer: { '@type': 'Answer', text: 'Most clients see measurable results within 30 to 60 days. Websites launch in 2 to 4 weeks. Search visibility campaigns start generating impressions within the first month. AI automation systems go live in 2 to 3 weeks.' } },
                            { '@type': 'Question', name: 'Do you lock clients into long-term contracts?', acceptedAnswer: { '@type': 'Answer', text: 'No. We work on a month-to-month basis after the initial build. We believe in earning your business every month. If we are not delivering, you should not be stuck.' } },
                            { '@type': 'Question', name: 'What platforms and tools do you use?', acceptedAnswer: { '@type': 'Answer', text: 'We build custom websites on React and Next.js, use GoHighLevel for CRM and automation, n8n and Make for workflow automation, and Claude and GPT for AI systems. We pick the right tool for each job.' } },
                            { '@type': 'Question', name: 'How is RSL/A different from other agencies?', acceptedAnswer: { '@type': 'Answer', text: 'We build the entire system, not just one piece. Website, search visibility, AI automations, CRM, and reporting, all connected. Most agencies hand you leads and call it a day. We make sure those leads turn into revenue.' } },
                        ],
                    },
                ]}
            />

            <div ref={rootRef}>

                {/* SECTION 1 — HERO */}
                <HeroV2 />

                {/* SECTION 2 — MARQUEE */}
                <LogoMarquee />

                {/* SECTION 3 — HEADLINE + INTRO */}
                <section className="w-full bg-surface py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="max-w-4xl">
                            <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
                                Hundreds of thousands generated (and honestly, even more saved).
                            </h2>
                            <p className="hr-reveal opacity-0 mt-8 md:mt-10 font-sans font-normal text-lg text-textMuted leading-relaxed">
                                Rahul and his team build intelligent marketing systems for both SMB and enterprise. We use a proprietary AI-driven consulting stack and a framework that digs into how your business actually runs so we can fix real, practical problems. Not the theoretical ones that look good on paper, but the actual things that are stopping you from scaling your business.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 — CASE STUDIES (3-col grid, text-only) */}
                <section className="w-full bg-background py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
                                Some of our work.
                            </h2>
                            <Link
                                to="/work"
                                className="hr-reveal opacity-0 inline-flex items-center gap-2 font-sans font-semibold text-lg text-accent hover:text-accent/80 transition-colors group shrink-0"
                            >
                                View all case studies
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                            {caseStudies.slice(0, 3).map((cs, i) => {
                                const imageUrl = cs.featuredImage?.asset
                                    ? urlForImage(cs.featuredImage.asset)?.width(960).height(600).url()
                                    : null;
                                const card = (
                                    <article className="group h-full flex flex-col rounded-2xl border border-accent-border bg-surface overflow-hidden hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-md ease-out-smooth">
                                        {imageUrl && (
                                            <div className="aspect-[16/10] overflow-hidden bg-surfaceAlt">
                                                <img
                                                    src={imageUrl}
                                                    alt={cs.featuredImage?.alt || cs.title}
                                                    className="w-full h-full object-cover transition-transform duration-image-zoom ease-out-smooth group-hover:scale-[1.03]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 p-8 md:p-9">
                                            <h3 className="mb-5 font-sans font-semibold text-xl md:text-2xl text-text leading-[1.2] tracking-tight">
                                                {cs.title}
                                            </h3>
                                            <p className="font-sans font-normal text-lg text-textMuted leading-relaxed flex-1">
                                                {cs.description}
                                            </p>
                                            <div className="mt-6 flex items-center font-sans font-semibold text-lg text-accent">
                                                Read the case study
                                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                                            </div>
                                        </div>
                                    </article>
                                );
                                return cs.slug ? (
                                    <Link key={cs.slug || i} to={`/work/${cs.slug}`} className="hr-reveal opacity-0 block h-full">
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={i} className="hr-reveal opacity-0 h-full">{card}</div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* SECTION 5 — FOUNDER */}
                <FounderSection />

                {/* SECTION 6 — SPECIALIZATION */}
                <ServicesV2 />

                {/* SECTION 7 — HOW WE WORK (timeline layout) */}
                <section className="w-full bg-surface px-6 md:px-12 py-24 md:py-32 border-t border-accent-border">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12 md:mb-16 max-w-3xl">
                            <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
                                How we work
                            </p>
                            <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
                                From first call to launch.
                            </h2>
                        </div>
                        <div className="relative">
                            {processSteps.map((step, idx) => (
                                <div
                                    key={step.num}
                                    className="hr-reveal opacity-0 relative flex justify-end gap-2 scroll-mt-24"
                                >
                                    {/* Sticky left column (desktop only) */}
                                    <div className="sticky top-24 flex w-36 flex-col items-end gap-2 self-start pb-4 max-md:hidden">
                                        <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                                            {step.num}
                                        </span>
                                    </div>
                                    {/* Dot + line */}
                                    <div className="flex flex-col items-center self-stretch">
                                        <div className="flex w-6 h-6 items-center justify-center shrink-0">
                                            <span className="bg-accent/20 flex w-[1.125rem] h-[1.125rem] shrink-0 items-center justify-center rounded-full">
                                                <span className="bg-accent w-3 h-3 rounded-full" />
                                            </span>
                                        </div>
                                        {idx !== processSteps.length - 1 && (
                                            <span className="w-0.5 flex-1 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/40" />
                                        )}
                                    </div>
                                    {/* Content column */}
                                    <div className="flex flex-1 flex-col gap-4 pb-14 pl-4 md:pl-6 lg:pl-9">
                                        {/* Mobile-only step label */}
                                        <div className="flex items-center gap-3 md:hidden">
                                            <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                                                {step.num}
                                            </span>
                                        </div>
                                        <h3 className="font-sans font-semibold text-xl md:text-2xl text-text tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed max-w-xl">
                                            {step.body}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* End-of-timeline CTA */}
                            <div className="hr-reveal opacity-0 relative flex justify-end gap-2">
                                <div className="w-36 shrink-0 max-md:hidden" />
                                <div className="w-6 shrink-0" />
                                <div className="flex flex-1 pl-4 md:pl-6 lg:pl-9">
                                    <Link
                                        to="/contact"
                                        onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'how_it_works' })}
                                        className="inline-flex items-center gap-2 font-sans font-semibold text-lg text-accent hover:text-accent/80 transition-colors group"
                                    >
                                        Start with a free audit
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 8 — TESTIMONIALS */}
                <Testimonials />

                {/* SECTION 9 — CTA */}
                <CtaWithGlow />
            </div>
        </>
    );
}
