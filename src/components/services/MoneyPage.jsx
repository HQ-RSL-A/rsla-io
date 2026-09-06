import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Phone } from 'lucide-react';
import Seo from '@/components/Seo';
import InlineText from '@/components/services/InlineText';
import ServiceFaq from '@/components/services/ServiceFaq';
import { generateFaqSchema } from '@/lib/faqSchema.mjs';
import { visuals, visualFor } from '@/components/services/visualsRegistry';
import { PHONE_DISPLAY, PHONE_TEL, KERN_TOWNS } from '@/data/serviceConstants.mjs';
import pages from '@/data/servicePages.generated.json';

gsap.registerPlugin(ScrollTrigger);

export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-button bg-accent px-6 py-3 font-sans font-medium text-base text-white hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out-smooth min-h-[44px]';
const telLink = 'inline-flex items-center gap-2 font-sans font-medium text-base text-accent hover:text-accentDeep transition-colors duration-sm min-h-[44px]';

function push(event, location) {
    window.dataLayer?.push({ event, cta_location: location });
}

function Lead({ lead }) {
    if (!lead) return null;
    const { text, highlight } = lead;
    if (!highlight || !text.includes(highlight)) return <>{text}</>;
    const [before, after] = text.split(highlight);
    return (<>{before}<span className="text-accent">{highlight}</span>{after}</>);
}

function Breadcrumb({ crumbs }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm text-text">
                {crumbs.map((c, i) => {
                    const last = i === crumbs.length - 1;
                    const path = c.item.replace('https://rsla.io', '') || '/';
                    return (
                        <li key={c.item} className="inline-flex items-center gap-2">
                            {last ? <span aria-current="page">{c.name}</span> : <Link to={path} className="hover:text-accent transition-colors">{c.name}</Link>}
                            {!last && <span aria-hidden="true">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function Block({ block, route, index }) {
    if (block.type === 'p') {
        return <p className="mp-reveal font-sans text-lg text-text leading-relaxed mb-5 [text-wrap:pretty]"><InlineText text={block.text} /></p>;
    }
    if (block.type === 'ol') {
        return (
            <ol className="mp-reveal my-6 space-y-4">
                {block.items.map((item, i) => (
                    <li key={i} className="flex gap-4">
                        <span className="mt-1 shrink-0 inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-accent px-2 font-sans font-bold text-sm text-white tabular-nums">{i + 1}</span>
                        <p className="font-sans text-lg text-text leading-relaxed [text-wrap:pretty]"><InlineText text={item} /></p>
                    </li>
                ))}
            </ol>
        );
    }
    if (block.type === 'quote') {
        return (
            <blockquote className="mp-reveal my-6 rounded-callout border border-hairline bg-frost p-5 md:p-6">
                <p className="font-sans text-lg text-text leading-relaxed">{block.text}</p>
                {block.cite && <cite className="mt-3 block font-sans text-sm text-text not-italic">{block.cite}</cite>}
            </blockquote>
        );
    }
    if (block.type === 'cta') {
        return (
            <div className="mp-reveal my-8 rounded-callout border border-hairline bg-frost p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-sans font-bold text-lg text-text leading-snug [text-wrap:balance]"><InlineText text={block.lead} /></p>
                <Link to="/contact" onClick={() => push('cta_click', `service_${route}_body_${index}`)} className={`${btnPrimary} shrink-0`}>
                    {block.label}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
            </div>
        );
    }
    return null;
}

export default function MoneyPage({ route }) {
    const page = pages.find(p => p.route === route);
    const pageRef = useRef(null);

    useEffect(() => {
        if (!page) return undefined;
        const ctx = gsap.context(() => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduce) return;
            gsap.utils.toArray('.mp-reveal').forEach((el) => {
                gsap.from(el, {
                    y: 18,
                    duration: 0.5,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                });
            });
        }, pageRef);
        return () => ctx.revert();
    }, [route, page]);

    // The mobile call bar steps out of the way while the footer (which carries
    // its own CTA and the tap-to-call NAP line) is on screen.
    const [footerVisible, setFooterVisible] = useState(false);
    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer || typeof IntersectionObserver === 'undefined') return undefined;
        const io = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0 });
        io.observe(footer);
        return () => io.disconnect();
    }, [route]);

    if (!page) return null; // every route in App.jsx exists in the generated copy set; build-service-copy throws otherwise

    const v = visuals[route] || {};
    const isLocal = Boolean(page.city);

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: page.h1,
        description: page.meta,
        url: page.canonical,
        provider: { '@id': 'https://rsla.io/#business' },
        areaServed: isLocal
            ? [
                { '@type': 'City', name: 'Bakersfield', containedInPlace: { '@type': 'AdministrativeArea', name: 'Kern County, California' } },
                ...KERN_TOWNS.slice(1).map(name => ({ '@type': 'City', name })),
            ]
            : { '@type': 'Country', name: 'US' },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: page.breadcrumb.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
    };
    const faqSchema = generateFaqSchema(page.faqs);

    return (
        <div ref={pageRef} className={`min-h-screen bg-surface ${isLocal ? 'pb-20 md:pb-0' : ''}`}>
            <Seo title={page.title} description={page.meta} canonical={page.canonical} jsonLd={[serviceSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]} />

            {/* Hero: page at rest, no entrance animation on the H1 */}
            <section className="px-6 md:px-12 pt-28 md:pt-36 pb-8 md:pb-12">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-16 items-center">
                    <div>
                        <Breadcrumb crumbs={page.breadcrumb} />
                        <h1 className="font-sans font-bold text-text text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.05] [text-wrap:balance] mb-6">{page.h1}</h1>
                        <p className="font-sans font-bold text-text text-xl md:text-2xl leading-[1.4] [text-wrap:pretty] max-w-[40ch] mb-8"><Lead lead={page.lead} /></p>
                        <p className="font-sans text-base text-text mb-3">{page.heroCta.lead}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <Link to="/contact" onClick={() => push('cta_click', `service_${route}_hero`)} className={btnPrimary}>
                                {page.heroCta.label}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                            </Link>
                            <a href={PHONE_TEL} onClick={() => push('phone_click', `service_${route}_hero`)} className={telLink}>
                                <Phone size={16} strokeWidth={2} aria-hidden="true" />Call {PHONE_DISPLAY}
                            </a>
                        </div>
                    </div>
                    {v.hero && <div className="min-w-0">{v.hero}</div>}
                </div>
            </section>

            {/* Proof row: three real numbers */}
            <section className="px-6 md:px-12 pb-12 md:pb-16">
                <ul className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-3" aria-label="Proof">
                    {page.proof.map((p) => (
                        <li key={p} className="rounded-callout bg-surfaceAlt px-5 py-4 font-sans font-bold text-base text-text leading-snug [text-wrap:balance]">{p}</li>
                    ))}
                </ul>
            </section>

            {/* Body sections, one idea each, alternating like a slide deck */}
            {page.sections.map((section, i) => {
                const visual = visualFor(route, section.heading);
                const alt = i % 2 === 1;
                return (
                    <section key={section.heading || i} className={`px-6 md:px-12 py-14 md:py-20 border-t border-hairline ${alt ? 'bg-surfaceAlt' : 'bg-surface'}`}>
                        <div className={`max-w-6xl mx-auto ${visual ? 'grid lg:grid-cols-2 gap-10 lg:gap-16 items-start' : ''}`}>
                            <div className="max-w-[68ch] min-w-0">
                                {section.heading && (
                                    <h2 className="mp-reveal font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] [text-wrap:balance] mb-6">{section.heading}</h2>
                                )}
                                {section.blocks.map((block, j) => <Block key={j} block={block} route={route} index={`${i}_${j}`} />)}
                            </div>
                            {visual && <div className="mp-reveal min-w-0 lg:sticky lg:top-28">{visual}</div>}
                        </div>
                    </section>
                );
            })}

            <ServiceFaq faqs={page.faqs} heading={page.faqHeading} />

            {/* Final call to action */}
            <section className="bg-frost border-t border-hairline px-6 md:px-12 py-16 md:py-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
                    <h2 className="font-sans font-bold text-text text-2xl md:text-4xl tracking-tight leading-[1.15] [text-wrap:balance] max-w-[32ch]">{page.finalCta.text}</h2>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-6 lg:gap-3 sm:items-center lg:items-start">
                        <Link to="/contact" onClick={() => push('cta_click', `service_${route}_final`)} className={btnPrimary}>
                            {page.finalCta.label}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                        </Link>
                        <a href={PHONE_TEL} onClick={() => push('phone_click', `service_${route}_final`)} className={telLink}>
                            <Phone size={16} strokeWidth={2} aria-hidden="true" />Call {PHONE_DISPLAY}
                        </a>
                    </div>
                </div>
            </section>

            {/* Mobile call bar, local pages only */}
            {isLocal && (
                <div className={`md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-surface px-4 pt-3 flex gap-3 transition-transform duration-md ease-out-smooth ${footerVisible ? 'translate-y-full' : 'translate-y-0'}`} style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
                    <a href={PHONE_TEL} onClick={() => push('phone_click', `service_${route}_sticky`)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-button border border-hairline bg-surface px-4 py-3 font-sans font-medium text-base text-text active:scale-[0.97] transition-transform duration-150 ease-out-smooth min-h-[44px]">
                        <Phone size={16} strokeWidth={2} aria-hidden="true" />Call
                    </a>
                    <Link to="/contact" onClick={() => push('cta_click', `service_${route}_sticky`)} className={`flex-1 ${btnPrimary}`}>Book a call</Link>
                </div>
            )}
        </div>
    );
}
