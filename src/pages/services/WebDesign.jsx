import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, Search, Bot, MapPin, Zap, Shield } from 'lucide-react';
import { services } from '@/data/serviceData';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';
import CtaWithGlow from '@/components/CtaWithGlow';
import { TextAnimate } from '@/components/ui/text-animate';

gsap.registerPlugin(ScrollTrigger);

const service = services['web-design'];

const portfolioSites = [
  { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website' },
  { src: '/images/portfolio/solCantina.jpg', alt: 'Sol Cantina restaurant website' },
  { src: '/images/portfolio/owlOutreach.jpg', alt: 'Owl Outreach website' },
  { src: '/images/portfolio/46goat.jpg', alt: '46GOAT e-commerce website' },
  { src: '/images/portfolio/nexusRoasters.jpg', alt: 'Nexus Roasters website' },
  { src: '/images/portfolio/freedomDrivers.jpg', alt: 'Freedom Drivers website' },
];

const painCards = [
  {
    title: 'Pretty but invisible',
    body: 'AI tools can build a modern-looking site in minutes. But if it is not built to rank and not structured for search engines, nobody finds it.',
  },
  {
    title: 'Looks like every other site',
    body: "Your provider's free website follows the same 10 layouts used by hundreds of businesses. Nothing about it is you.",
  },
  {
    title: 'The messaging is wrong',
    body: 'If search engines cannot understand what your business does, your customers will not either. Vague copy and missing structure kill your chances before you even compete.',
  },
];

const deliverables = [
  { icon: Globe, title: 'Custom design', body: 'Built around your brand personality, voice, and story. Not a template with your logo swapped in.' },
  { icon: Search, title: 'SEO foundation', body: 'Site structure, page titles, speed, and content - all optimized so search engines can find and trust you from day one.' },
  { icon: Bot, title: 'Found by AI search, not just Google', body: 'Structured so your business shows up when people ask ChatGPT, Gemini, or Perplexity for recommendations.' },
  { icon: MapPin, title: 'Local search ready', body: 'If you serve a local area, we connect your site to your Google Business Profile and build it to rank in your service area.' },
  { icon: Zap, title: 'Fast delivery', body: 'As fast as one week for focused builds. Larger scopes up to two months. Real timeline, no guessing.' },
  { icon: Shield, title: 'You own everything', body: 'Your code, your content, your domain. No vendor lock-in. Full CMS access to update content yourself.' },
];

const processSteps = [
  { num: '01', title: 'Deep-dive onboarding', body: 'We learn your business, brand, audience, and goals before we touch a single design.' },
  { num: '02', title: 'Design and copy', body: 'You see a real mockup with real messaging - not a wireframe or a slide deck.' },
  { num: '03', title: 'Build and optimize', body: 'Development, SEO setup, speed optimization, and testing across every device.' },
  { num: '04', title: 'Launch and ongoing', body: 'We go live, train you on the CMS, and hand everything over. Ongoing management available.' },
];

export default function WebDesign() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.wd-hero-content', { opacity: 1, y: 0 });
        gsap.utils.toArray('.hr-reveal').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
        return;
      }

      gsap.fromTo('.wd-hero-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );

      gsap.utils.toArray('.hr-reveal').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    provider: { '@type': 'Organization', name: 'RSL/A', url: 'https://rsla.io' },
    url: service.canonical,
    areaServed: { '@type': 'Country', name: 'US' },
  };
  const faqSchema = generateFaqSchema(service.faqs);
  const jsonLd = faqSchema ? [serviceSchema, faqSchema] : serviceSchema;

  return (
    <div ref={pageRef}>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={service.canonical}
        jsonLd={jsonLd}
      />

      {/* ── 1. HERO ── */}
      <section className="bg-surface pt-36 pb-12 md:pb-16 px-6 md:px-12">
        <div className="wd-hero-content opacity-0 max-w-4xl mx-auto text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-10"
          >
            All Services
          </Link>
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-6">
            <TextAnimate animation="blurInUp" by="word" delay={0.06} startOnView={false} as="span">
              {service.headline}
            </TextAnimate>
          </h1>
          <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl mx-auto mb-8">
            {service.description}
          </p>
          <Link
            to="/contact"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_hero' })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Get a free homepage mockup
            <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
          </Link>
          <div className="mt-4">
            <Link to="/work" className="font-sans text-sm text-accent hover:underline">
              See our work
            </Link>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO STRIP ── */}
      <section className="bg-surface pb-16 md:pb-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="hr-reveal opacity-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {portfolioSites.map((site) => (
              <div
                key={site.src}
                className="group rounded-xl overflow-hidden border border-accent-border bg-white shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={site.src}
                    alt={site.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width="320"
                    height="200"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-sans text-sm text-textMuted">
            Every site is different. Because every business is different.
          </p>
        </div>
      </section>

      {/* ── 2. PAIN / PROBLEM ── */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
            The problem
          </p>
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-12">
            Most websites fail before they launch.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {painCards.map((card) => (
              <div
                key={card.title}
                className="hr-reveal opacity-0 rounded-2xl border border-accent-border bg-surface p-8"
              >
                <h3 className="font-sans font-bold text-lg text-text mb-3">{card.title}</h3>
                <p className="font-sans text-base text-textMuted leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT YOU GET ── */}
      <section className="bg-accent-light py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
            What you get
          </p>
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-12">
            A website built to be found, trusted, and acted on.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="hr-reveal opacity-0 rounded-2xl border border-accent-border bg-surface p-8"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 mb-5">
                    <Icon size={20} strokeWidth={1.8} className="text-accent" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-text mb-2">{item.title}</h3>
                  <p className="font-sans text-base text-textMuted leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. OUR PROCESS ── */}
      <section className="bg-surface py-20 md:py-28 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto">
          <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
            Our process
          </p>
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-14">
            From first conversation to live website.
          </h2>
          <div className="relative">
            {processSteps.map((step, idx) => (
              <div key={step.num} className="hr-reveal opacity-0 relative flex justify-end gap-2 scroll-mt-24">
                <div className="sticky top-24 flex w-36 flex-col items-end gap-2 self-start pb-4 max-md:hidden">
                  <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                    {step.num}
                  </span>
                </div>
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
                <div className="flex flex-1 flex-col gap-4 pb-14 pl-4 md:pl-6 lg:pl-9">
                  <div className="flex items-center gap-3 md:hidden">
                    <span className="inline-flex h-6 items-center px-2.5 rounded-md bg-accent text-white font-sans font-semibold text-sm">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-xl md:text-2xl text-text tracking-tight">{step.title}</h3>
                  <p className="font-sans font-normal text-lg text-textMuted leading-relaxed max-w-xl">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TRANSFORMATION ── */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
            Results
          </p>
          <div className="hr-reveal opacity-0 rounded-2xl border border-accent-border bg-surface overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-accent-border">
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-textMuted mb-4">Before</p>
                <div className="rounded-xl overflow-hidden border border-accent-border mb-4">
                  <img
                    src="/images/portfolio/fieldshare-before.jpg"
                    alt="Fieldshare website before RSL/A redesign"
                    className="w-full h-auto"
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                </div>
                <p className="font-sans text-sm text-textMuted leading-relaxed">
                  An outdated site that was not ranking, was not generating leads, and did not communicate what the business does.
                </p>
              </div>
              <div className="p-6 md:p-8">
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-accent mb-4">After</p>
                <div className="rounded-xl overflow-hidden border-2 border-accent mb-4">
                  <img
                    src="/images/portfolio/fieldshare-after.jpg"
                    alt="Fieldshare website after RSL/A redesign"
                    className="w-full h-auto"
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                </div>
                <p className="font-sans text-sm text-text leading-relaxed">
                  Page 1 on Google within 6 months. Complete rebrand and SEO overhaul that turned the website into the top lead source.
                </p>
              </div>
            </div>
            <div className="px-6 md:px-8 py-5 border-t border-accent-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-accent-light/50">
              <p className="font-sans font-bold text-base text-text">Fieldshare</p>
              <Link
                to="/work/fieldshare-seo-website-rebrand"
                className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-accent hover:underline"
              >
                Read the full case study <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. AI MYTH-BUSTER ── */}
      <section className="bg-accent-light py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="hr-reveal opacity-0">
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight leading-[1.1] text-text">
              But can't I just build it with AI?
            </h2>
          </div>
          <div className="hr-reveal opacity-0">
            <p className="font-sans text-lg text-textMuted leading-relaxed">
              You can. And it might look good. But a website without keyword strategy, content structure, and technical SEO is a brochure nobody sees. We build what AI cannot: a site engineered around your specific business, your market, and the search terms your customers actually use.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. FOUNDER ── */}
      <section className="bg-surface py-16 md:py-20 px-6 md:px-12 border-t border-accent-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent/20">
              <img src="/images/rahul.webp" alt="Rahul Lalia" className="w-full h-full object-cover" loading="lazy" width="80" height="80" />
            </div>
          </div>
          <div className="hr-reveal opacity-0 text-center md:text-left">
            <p className="font-caveat text-xl text-text leading-snug mb-2">
              "A website is your business's digital business card. If it does not communicate what you do, you are setting yourself up for failure."
            </p>
            <p className="font-sans text-sm text-textMuted">
              Rahul Lalia, Founder of RSL/A
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <ServiceFaq faqs={service.faqs} serviceName={service.title} />

      {/* ── 9. CTA ── */}
      <CtaWithGlow
        title="Get a free homepage mockup in 72 hours."
        subtitle="No commitment, no pitch. We will design your homepage so you can see the difference before you decide."
        buttonText="Claim Your Free Mockup"
        buttonTo="/contact"
      />
    </div>
  );
}
