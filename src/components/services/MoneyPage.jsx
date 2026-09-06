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
import MediaFrame from '@/components/services/ui/MediaFrame';
import { CardGrid, CardRows } from '@/components/services/ui/CardGrid';
import Steps from '@/components/services/ui/Steps';
import { QuoteGrid } from '@/components/services/ui/QuoteCard';
import ProofRow from '@/components/services/ui/ProofRow';
import { ServiceCardGrid } from '@/components/services/ui/ServiceCard';
import { cardFor, relatedTo } from '@/data/serviceCatalog';
import { PHONE_DISPLAY, PHONE_TEL, KERN_TOWNS } from '@/data/serviceConstants.mjs';
import pages from '@/data/servicePages.generated.json';

gsap.registerPlugin(ScrollTrigger);

export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-button bg-accent px-6 py-3 font-sans font-medium text-base text-white hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out-smooth min-h-[44px]';
const telLink = 'inline-flex items-center gap-2 font-sans font-medium text-base text-accent hover:text-accentDeep transition-colors duration-sm min-h-[44px]';

/** Chip on the hero visual, per page. Plain sentence case, never an eyebrow. */
const HERO_CHIP = {
    '/services/websites': 'Recent work',
    '/services/seo': 'What ranking looks like',
    '/services/seo/local': 'The map pack',
    '/services/seo/programmatic': 'One template, many pages',
    '/services/crm': 'Your pipeline',
    '/services/custom-builds': 'An internal tool',
    '/bakersfield/websites': 'Recent work',
    '/bakersfield/seo': 'Live scan, June 2026',
    '/bakersfield/crm': 'Your pipeline',
};
/** Visuals that are not already a card of their own get the Mist frame. */
const FRAMED = new Set(['/services/seo', '/services/seo/local', '/services/seo/programmatic', '/services/crm', '/services/custom-builds', '/bakersfield/seo', '/bakersfield/crm']);

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

const h2Cls = 'mp-reveal font-sans font-bold text-text text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05] [text-wrap:balance]';
const pCls = 'mp-reveal font-sans text-lg text-text leading-relaxed [text-wrap:pretty]';

function Paragraph({ block }) {
    if (block.title) {
        return (
            <div className="mp-reveal mb-5">
                <h3 className="font-sans font-bold text-text text-xl leading-snug mb-2">{block.title}</h3>
                <p className="font-sans text-lg text-text leading-relaxed [text-wrap:pretty]"><InlineText text={block.text} /></p>
            </div>
        );
    }
    if (block.link) {
        return <p className={`${pCls} mb-5`}><Link to={block.link.to} className="font-bold text-accent hover:text-accentDeep">{block.link.label}</Link>: <InlineText text={block.text} /></p>;
    }
    return <p className={`${pCls} mb-5`}><InlineText text={block.text} /></p>;
}

function CtaBand({ block, route, index }) {
    return (
        <div className="mp-reveal my-8 rounded-callout border border-hairline bg-frost p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="font-sans font-bold text-lg text-text leading-snug [text-wrap:balance]"><InlineText text={block.lead} /></p>
            <Link to="/contact" onClick={() => push('cta_click', `service_${route}_body_${index}`)} className={`${btnPrimary} shrink-0`}>
                {block.label}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
        </div>
    );
}

/**
 * Render a run of blocks. Consecutive quotes become a quote grid, a numbered
 * list becomes steps, everything else is a paragraph or a CTA band.
 */
function Blocks({ blocks, route, sectionIndex, tone, stepsLayout }) {
    const out = [];
    for (let j = 0; j < blocks.length; j++) {
        const b = blocks[j];
        if (b.type === 'quote') {
            const quotes = [];
            while (j < blocks.length && blocks[j].type === 'quote') { quotes.push(blocks[j]); j++; }
            j--;
            out.push(<div key={`q${j}`} className="my-6"><QuoteGrid quotes={quotes} tone={tone} /></div>);
        } else if (b.type === 'ol') {
            out.push(<div key={`ol${j}`} className="my-8"><Steps items={b.items} layout={stepsLayout} /></div>);
        } else if (b.type === 'cta') {
            out.push(<CtaBand key={`cta${j}`} block={b} route={route} index={`${sectionIndex}_${j}`} />);
        } else if (b.type === 'p') {
            out.push(<Paragraph key={`p${j}`} block={b} />);
        }
    }
    return out;
}

function Section({ section, index, route }) {
    const visual = visualFor(route, section.heading);
    const alt = index % 2 === 1;
    const tone = alt ? 'alt' : 'base';
    const blocks = section.blocks;
    const titled = blocks.filter((b) => b.type === 'p' && b.title);
    const linked = blocks.filter((b) => b.type === 'p' && b.link);
    const shell = `px-6 md:px-12 py-14 md:py-20 border-t border-hairline ${alt ? 'bg-surfaceAlt' : 'bg-surface'}`;

    // Service cards: two or more "[Label](/route): sentence" paragraphs.
    if (linked.length >= 2) {
        const first = blocks.findIndex((b) => b.link);
        const lastLinked = blocks.length - 1 - [...blocks].reverse().findIndex((b) => b.link);
        const intro = blocks.slice(0, first);
        const after = blocks.slice(lastLinked + 1);
        const items = linked.map((b) => cardFor(b.link.to, { title: b.link.label, description: b.text }) || { to: b.link.to, title: b.link.label, description: b.text });
        return (
            <section className={shell}>
                <div className="max-w-6xl mx-auto">
                    <SectionHeader heading={section.heading} intro={intro} />
                    <ServiceCardGrid items={items} onClick={(to) => push('cta_click', `service_${route}_card_${to}`)} />
                    {after.length > 0 && <div className="mt-10 max-w-[68ch]"><Blocks blocks={after} route={route} sectionIndex={index} tone={tone} stepsLayout="column" /></div>}
                </div>
            </section>
        );
    }

    // Numbered cards: two or more titled paragraphs.
    if (titled.length >= 2) {
        const first = blocks.findIndex((b) => b.title);
        const lastTitled = blocks.length - 1 - [...blocks].reverse().findIndex((b) => b.title);
        const intro = blocks.slice(0, first);
        const after = blocks.slice(lastTitled + 1);
        const cards = blocks.slice(first, lastTitled + 1).filter((b) => b.title);
        if (visual) {
            return (
                <section className={shell}>
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <div className="min-w-0">
                            {section.heading && <h2 className={`${h2Cls} mb-6`}>{section.heading}</h2>}
                            <Blocks blocks={intro} route={route} sectionIndex={index} tone={tone} stepsLayout="column" />
                            <CardRows items={cards} tone={tone} />
                            {after.length > 0 && <div className="mt-8"><Blocks blocks={after} route={route} sectionIndex={index} tone={tone} stepsLayout="column" /></div>}
                        </div>
                        <div className="mp-reveal min-w-0 lg:sticky lg:top-28">{visual}</div>
                    </div>
                </section>
            );
        }
        return (
            <section className={shell}>
                <div className="max-w-6xl mx-auto">
                    <SectionHeader heading={section.heading} intro={intro} />
                    <CardGrid items={cards} tone={tone} />
                    {after.length > 0 && <div className="mt-10 max-w-[68ch]"><Blocks blocks={after} route={route} sectionIndex={index} tone={tone} stepsLayout="row" /></div>}
                </div>
            </section>
        );
    }

    // Steps across the page when the section is a numbered list with nothing beside it.
    const hasSteps = blocks.some((b) => b.type === 'ol');
    if (hasSteps && !visual) {
        const olIndex = blocks.findIndex((b) => b.type === 'ol');
        const intro = blocks.slice(0, olIndex);
        const after = blocks.slice(olIndex + 1);
        return (
            <section className={shell}>
                <div className="max-w-6xl mx-auto">
                    <SectionHeader heading={section.heading} intro={intro} />
                    <Steps items={blocks[olIndex].items} layout="row" />
                    {after.length > 0 && <div className="mt-10 max-w-[68ch]"><Blocks blocks={after} route={route} sectionIndex={index} tone={tone} stepsLayout="row" /></div>}
                </div>
            </section>
        );
    }

    // Prose, with the visual beside it when there is one.
    return (
        <section className={shell}>
            <div className={`max-w-6xl mx-auto ${visual ? 'grid lg:grid-cols-2 gap-10 lg:gap-16 items-start' : ''}`}>
                <div className="max-w-[68ch] min-w-0">
                    {section.heading && <h2 className={`${h2Cls} mb-6`}>{section.heading}</h2>}
                    <Blocks blocks={blocks} route={route} sectionIndex={index} tone={tone} stepsLayout="column" />
                </div>
                {visual && <div className="mp-reveal min-w-0 lg:sticky lg:top-28">{visual}</div>}
            </div>
        </section>
    );
}

/** H2 on the left, the untitled opening paragraph on the right, like a deck slide. */
function SectionHeader({ heading, intro }) {
    const lead = intro.filter((b) => b.type === 'p' && !b.title && !b.link);
    const rest = intro.filter((b) => !lead.includes(b));
    return (
        <div className="mb-10 md:mb-12">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-end">
                {heading && <h2 className={h2Cls}>{heading}</h2>}
                {lead.length > 0 && (
                    <div className="max-w-[60ch]">
                        {lead.map((b, i) => <p key={i} className={`${pCls} ${i < lead.length - 1 ? 'mb-4' : ''}`}><InlineText text={b.text} /></p>)}
                    </div>
                )}
            </div>
            {rest.length > 0 && <div className="mt-6 max-w-[68ch]"><Blocks blocks={rest} tone="base" stepsLayout="row" /></div>}
        </div>
    );
}

export default function MoneyPage({ route }) {
    const page = pages.find((p) => p.route === route);
    const pageRef = useRef(null);

    useEffect(() => {
        if (!page) return undefined;
        const ctx = gsap.context(() => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduce) return;
            // Transform only, never opacity: the page reads correctly at rest.
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
    const related = relatedTo(route);
    const relatedCards = related.routes.map((r) => cardFor(r)).filter(Boolean);

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
                ...KERN_TOWNS.slice(1).map((name) => ({ '@type': 'City', name })),
            ]
            : { '@type': 'Country', name: 'US' },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: page.breadcrumb.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
    };
    const faqSchema = generateFaqSchema(page.faqs);
    const heroVisual = v.hero
        ? (FRAMED.has(route) ? <MediaFrame chip={HERO_CHIP[route]}>{v.hero}</MediaFrame> : (
            <div className="relative">
                {HERO_CHIP[route] && <span className="absolute left-3 top-3 z-10 rounded-full border border-hairline bg-surface px-3 py-1 font-sans font-medium text-sm text-text shadow-[0_1px_2px_rgba(0,0,0,0.04)]">{HERO_CHIP[route]}</span>}
                {v.hero}
            </div>
        ))
        : null;

    return (
        <div ref={pageRef} className={`min-h-screen bg-surface ${isLocal ? 'pb-20 md:pb-0' : ''}`}>
            <Seo title={page.title} description={page.meta} canonical={page.canonical} jsonLd={[serviceSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]} />

            {/* Hero: page at rest, no entrance animation on the H1 */}
            <section className="px-6 md:px-12 pt-28 md:pt-36 pb-10 md:pb-14">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-16 items-center">
                    <div>
                        <Breadcrumb crumbs={page.breadcrumb} />
                        <h1 className="font-sans font-bold text-text text-4xl md:text-6xl lg:text-[4.25rem] tracking-tight leading-[1.02] [text-wrap:balance] mb-6">{page.h1}</h1>
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
                    {heroVisual && <div className="min-w-0">{heroVisual}</div>}
                </div>
            </section>

            {/* Proof row: three real numbers */}
            <section className="px-6 md:px-12 pb-14 md:pb-20">
                <div className="max-w-6xl mx-auto"><ProofRow items={page.proof} icons={v.proofIcons} /></div>
            </section>

            {page.sections.map((section, i) => <Section key={section.heading || i} section={section} index={i} route={route} />)}

            <ServiceFaq faqs={page.faqs} heading={page.faqHeading} />

            {relatedCards.length > 0 && (
                <section className="bg-surfaceAlt border-t border-hairline px-6 md:px-12 py-14 md:py-20" aria-labelledby="related-heading">
                    <div className="max-w-6xl mx-auto">
                        <h2 id="related-heading" className={`${h2Cls} mb-10`}>{related.heading}</h2>
                        <ServiceCardGrid items={relatedCards} onClick={(to) => push('cta_click', `service_${route}_related_${to}`)} />
                    </div>
                </section>
            )}

            {/* Final call to action */}
            <section className="bg-frost border-t border-hairline px-6 md:px-12 py-16 md:py-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
                    <h2 className="font-sans font-bold text-text text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] [text-wrap:balance] max-w-[30ch]">{page.finalCta.text}</h2>
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
