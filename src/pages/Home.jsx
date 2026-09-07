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
 * Font hierarchy: Satoshi only (font-sans): Medium 500 reading, Bold 700
 * headings, per brand-guidelines/design-tokens.css.
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
        body: "A free 30 minute call. You tell us what is not working and we tell you what we would build first, whether that is a CRM, an automation, a page, or nothing yet.",
    },
    {
        num: '02',
        title: 'Proposal',
        body: "A written proposal with the scope, a timeline, and one fixed number. No hourly billing, so the price you sign is the price you pay.",
    },
    {
        num: '03',
        title: 'Project',
        body: 'We build and test it with your real data, and you review at each step. You get a working system and weekly updates, not a slide deck.',
    },
    {
        num: '04',
        title: 'Ongoing management',
        body: 'Optional. On a monthly retainer we keep it running, fix what the apps break when they update, and build the next thing when the business is ready for it.',
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
                title="RSL/A | We put AI to work for small service businesses"
                description="Automation, CRM, SEO, and websites for small service businesses. Fixed price, real numbers on a dashboard, in person in Bakersfield and remote across the US."
                keywords="AI automation agency, GoHighLevel expert, small business SEO, small business website design, marketing agency Bakersfield"
                canonical="https://rsla.io"
                jsonLd={[
                    /* Organization + WebSite are injected globally via Seo.jsx (src/lib/structuredData.mjs) */
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            { '@type': 'Question', name: 'What types of businesses do you work with?', acceptedAnswer: { '@type': 'Answer', text: 'One person and small service businesses: the trades, clinics, salons, restaurants, agencies, and the professional services firms that run on referrals. Most are in Kern County or work with us remotely from anywhere in the US and Canada. Nonprofits and B2B companies are welcome too, on the same process.' } },
                            { '@type': 'Question', name: 'How long does it take to see results?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on what we build. A website launches in four to six weeks. A CRM or a single automation goes live in one to three weeks. SEO takes three to six months for the first real movement and closer to a year to compound. We say which on the first call and report what moved each month.' } },
                            { '@type': 'Question', name: 'Do you lock clients into long-term contracts?', acceptedAnswer: { '@type': 'Answer', text: 'No. Builds are a fixed project price. Ongoing work, such as SEO, automation upkeep, or CRM management, is month to month after the build and you can stop any time. If it is not paying for itself, you should not be paying for it.' } },
                            { '@type': 'Question', name: 'What platforms and tools do you use?', acceptedAnswer: { '@type': 'Answer', text: 'Websites are hand coded on React and Next.js. CRM and follow up run on GoHighLevel. Workflows run in n8n or Make, with an AI agent where a step needs judgment. We pick the tool that fits the job and your existing stack, and we do not make you switch software to get there.' } },
                            { '@type': 'Question', name: 'How is RSL/A different from other agencies?', acceptedAnswer: { '@type': 'Answer', text: 'Two things. Rahul came from analytics, so you get a dashboard with your real leads, calls, rankings, and costs instead of a monthly report of impressions. And we diagnose before we sell: a business with no follow up system needs a CRM more than it needs ads, and we say so even when it is the smaller job.' } },
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
                <section className="w-full bg-surface pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="max-w-4xl">
                            <h2 className="hr-reveal opacity-0 font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
                                Two salon suites filled from $600 in ads. A blank domain to 204 keywords in 6 months.
                            </h2>
                            <p className="hr-reveal opacity-0 mt-6 md:mt-8 font-sans font-medium text-lg text-text leading-relaxed">
                                That is the kind of number you get from us, on a dashboard, as it happens. We work with one person and small service businesses: the trades, clinics, salons, agencies, and the owner who is also the sales team. Rahul came from analytics, so every engagement starts with a diagnosis and ends with your real leads, calls, rankings, and costs in one place, not a monthly PDF of impressions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 — CASE STUDIES (3-col grid, text-only) */}
                <section className="w-full bg-background pt-20 pb-24 md:pt-28 md:pb-32">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <h2 className="hr-reveal opacity-0 font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
                                Some of our work.
                            </h2>
                            <Link
                                to="/work"
                                className="hr-reveal opacity-0 inline-flex items-center gap-2 font-sans font-medium text-lg text-accent hover:text-accentDeep transition-colors group shrink-0"
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
                                    <article className="group h-full flex flex-col rounded-2xl border border-hairline bg-surface overflow-hidden hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-md ease-out-smooth">
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
                                            <h3 className="mb-5 font-sans font-bold text-xl md:text-2xl text-text leading-[1.2] tracking-tight">
                                                {cs.title}
                                            </h3>
                                            <p className="font-sans font-medium text-lg text-text leading-relaxed flex-1">
                                                {cs.description}
                                            </p>
                                            <div className="mt-6 flex items-center font-sans font-medium text-lg text-accent">
                                                Read the case study
                                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                                            </div>
                                        </div>
                                    </article>
                                );
                                return cs.slug ? (
                                    <Link key={cs.slug || i} to={`/work/${cs.slug}`} className={`hr-reveal opacity-0 block h-full ${i > 0 ? 'hidden md:block' : ''}`}>
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={i} className={`hr-reveal opacity-0 h-full ${i > 0 ? 'hidden md:block' : ''}`}>{card}</div>
                                );
                            })}
                        </div>
                        <div className="mt-8 md:hidden">
                            <Link
                                to="/work"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-button border border-hairline bg-surface font-sans font-medium text-base text-accent active:bg-accent-light transition-colors"
                            >
                                View all case studies
                                <ArrowRight className="w-4 h-4" strokeWidth={2} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 5 — FOUNDER */}
                <FounderSection />

                {/* SECTION 6 — SPECIALIZATION */}
                <ServicesV2 />

                {/* SECTION 7 — HOW WE WORK (timeline layout) */}
                <section className="w-full bg-surface px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32 border-t border-hairline">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 md:mb-14 max-w-3xl">
                            <h2 className="hr-reveal opacity-0 font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.1]">
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
                                        <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-medium text-sm">
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
                                            <span className="w-0.5 flex-1 bg-hairline" />
                                        )}
                                    </div>
                                    {/* Content column */}
                                    <div className="flex flex-1 flex-col gap-4 pb-14 pl-4 md:pl-6 lg:pl-9">
                                        {/* Mobile-only step label */}
                                        <div className="flex items-center gap-3 md:hidden">
                                            <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-medium text-sm">
                                                {step.num}
                                            </span>
                                        </div>
                                        <h3 className="font-sans font-bold text-xl md:text-2xl text-text tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="font-sans font-medium text-lg text-text leading-relaxed max-w-xl">
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
                                        className="inline-flex items-center gap-2 font-sans font-medium text-lg text-accent hover:text-accentDeep transition-colors group"
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
