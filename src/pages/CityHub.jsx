import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';
import { cities } from '@/data/cityData';
import { services } from '@/data/serviceData';

gsap.registerPlugin(ScrollTrigger);

export default function CityHub() {
    const { citySlug } = useParams();
    const pageRef = useRef(null);
    const city = cities[citySlug];

    useEffect(() => {
        if (!city) return;

        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                gsap.set('.city-hero-content', { opacity: 1, y: 0 });
                gsap.set('.city-section', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo(
                '.city-hero-content',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
            );

            gsap.fromTo(
                '.city-section',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    delay: 0.3,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.city-section',
                        start: 'top 85%',
                        once: true,
                    },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [citySlug, city]);

    if (!city) {
        return (
            <main className="min-h-screen bg-surface text-text flex flex-col items-center justify-center px-6">
                <p className="font-sans text-lg text-textMuted mb-6">Location not found</p>
                <Link to="/services" className="font-sans font-semibold text-accent hover:text-accent/80 transition-colors">
                    Back to Services
                </Link>
            </main>
        );
    }

    const serviceHighlightData = city.serviceHighlights
        .map(slug => ({ slug, ...services[slug] }))
        .filter(Boolean);

    const professionalServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: `RSL/A - ${city.name}`,
        description: city.metaDescription,
        url: city.canonical,
        areaServed: {
            '@type': city.areaServed.type,
            name: city.areaServed.name,
            containedInPlace: {
                '@type': 'AdministrativeArea',
                name: city.areaServed.containedIn,
            },
        },
        provider: {
            '@type': 'Organization',
            name: 'RSL/A',
            url: 'https://rsla.io',
            logo: 'https://rsla.io/images/logo/lockup-nobg.webp',
        },
    };

    const faqSchema = generateFaqSchema(city.faqs);
    const jsonLd = [professionalServiceSchema, faqSchema].filter(Boolean);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title={city.metaTitle}
                description={city.metaDescription}
                keywords={city.keywords}
                canonical={city.canonical}
                jsonLd={jsonLd}
            />

            <section className="bg-surface pt-36 pb-12 px-6 md:px-12">
                <div className="city-hero-content opacity-0 max-w-4xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold mb-5">
                        <MapPin size={14} />
                        {city.name}, {city.state}
                    </span>
                    <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-6">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            {city.headline}
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl">
                        {city.subheadline}
                    </p>
                </div>
            </section>

            <section className="city-section bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-4xl mx-auto">
                    <p className="font-sans text-lg text-text leading-relaxed mb-5">
                        {city.localContent.intro}
                    </p>
                    <p className="font-sans text-base text-textMuted leading-relaxed">
                        {city.localContent.whyLocal}
                    </p>
                </div>
            </section>

            <section className="city-section bg-surface py-16 md:py-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-8">
                        What we do in {city.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {serviceHighlightData.map((service) => (
                            <Link
                                key={service.slug}
                                to={`/services/${service.slug}`}
                                className="group rounded-xl border border-accent-border bg-surface p-6 transition-colors hover:border-accent/40"
                            >
                                <p className="font-sans font-bold text-base text-text mb-2 group-hover:text-accent transition-colors">
                                    {service.displayName}
                                </p>
                                <p className="font-sans text-sm text-textMuted leading-relaxed mb-4">
                                    {service.description}
                                </p>
                                <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-accent">
                                    Learn more
                                    <ArrowRight size={14} strokeWidth={2} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="city-section bg-accent-light py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-8">
                        Industries we serve in {city.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {city.localContent.industries.map((industry) => (
                            <div key={industry} className="flex items-start gap-2">
                                <span className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-accent" />
                                <p className="font-sans text-base text-textMuted">{industry}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {city.nearbyAreas && city.nearbyAreas.length > 0 && (
                <section className="city-section bg-surface py-12 px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <p className="font-sans text-sm text-textMuted">
                            Also serving: {city.nearbyAreas.join(', ')}
                        </p>
                    </div>
                </section>
            )}

            <ServiceFaq faqs={city.faqs} />

            <section className="city-section bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-4">
                        Ready to grow your {city.name} business?
                    </h2>
                    <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
                        Book a call and we'll talk through what you need. No pitch, no pressure.
                    </p>
                    <Link
                        to="/contact"
                        onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: `city_${citySlug}` })}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
                    >
                        Book a call
                        <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
