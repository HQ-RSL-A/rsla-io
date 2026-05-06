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

const painCards = [
  {
    title: 'Looks like every other site',
    body: "Your POS provider's free website, your page builder template - they all follow the same 10 layouts across hundreds of businesses. Nothing about it is you.",
  },
  {
    title: 'Pretty but invisible',
    body: 'AI tools can build a modern-looking site in minutes. But if it is not optimized to rank, not structured for search engines, and not built around your keywords - nobody finds it.',
  },
  {
    title: 'The messaging is wrong',
    body: "If Google cannot understand what your business does, your customers will not either. Vague copy and missing structure kill your chances before you even compete.",
  },
];

const deliverables = [
  { icon: Globe, title: 'Custom design', body: 'Built around your brand personality, voice, and story. Not a template with your logo swapped in.' },
  { icon: Search, title: 'SEO foundation', body: 'Site structure, meta tags, keyword alignment, and speed - all set up correctly from day one so search engines can find and trust you.' },
  { icon: Bot, title: 'AEO and GEO ready', body: 'Structured so your business shows up in ChatGPT, Claude, Gemini, and Perplexity - not just Google.' },
  { icon: MapPin, title: 'Local SEO', body: 'If you serve a local area, we build your site to rank in Google Maps and local search results.' },
  { icon: Zap, title: 'Fast delivery', body: 'As fast as one week for focused builds. Larger scopes up to two months. We give you a real timeline and hit it.' },
  { icon: Shield, title: 'You own everything', body: 'Your code, your content, your domain. No vendor lock-in. Full CMS access so you can update content yourself.' },
];

const processSteps = [
  { num: '01', title: 'Deep-dive onboarding', body: 'We learn your business, your services, your audience, and your brand voice. If you have a brand pack, we work with it. If you do not, we will guide you through what we need.' },
  { num: '02', title: 'Design and copy', body: 'We design your homepage first and write the content that goes on it. You see a real mockup with real messaging - not a wireframe or a slide deck.' },
  { num: '03', title: 'Build and optimize', body: 'Development, SEO setup, speed optimization, and testing across devices. We build it once and build it right.' },
  { num: '04', title: 'Launch and ongoing', body: 'We go live, train you on the CMS, and hand everything over. For clients who want it, we offer ongoing management - because a website is a living product.' },
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
          <div className="mt-4 flex items-center justify-center gap-6">
            <Link to="/work" className="font-sans text-sm text-accent hover:underline">
              See our work
            </Link>
          </div>
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
        <div className="max-w-3xl mx-auto">
          <p className="hr-reveal opacity-0 mb-4 font-sans text-sm uppercase tracking-[0.2em] text-accent">
            Results
          </p>
          <div className="hr-reveal opacity-0 rounded-2xl border border-accent-border bg-surface p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-textMuted mb-3">Before</p>
                <p className="font-sans text-base text-textMuted leading-relaxed">
                  An outdated website that was not ranking, was not generating leads, and did not communicate what the business actually does.
                </p>
              </div>
              <div>
                <p className="font-sans text-sm font-bold uppercase tracking-widest text-accent mb-3">After</p>
                <p className="font-sans text-base text-text leading-relaxed">
                  Page 1 on Google within 6 months. A complete rebrand, SEO overhaul, and content strategy that turned the website into the business's top lead source.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-accent-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              You can. And it might even look good. But the questions that actually matter are: Is it conversion-optimized? Is it structured to rank? Is the on-page SEO strong enough for Google to even index it?
            </p>
            <p className="font-sans text-lg text-textMuted leading-relaxed mt-5">
              A website without keyword strategy, content structure, and technical SEO is a brochure nobody sees. We build what AI cannot: a site engineered around your specific business, your market, and the search terms your customers actually use.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <ServiceFaq faqs={service.faqs} serviceName={service.title} />

      {/* ── 8. CTA ── */}
      <CtaWithGlow
        title="Get a free homepage mockup in 72 hours."
        subtitle="No commitment, no pitch. We will design your homepage so you can see the difference before you decide."
        buttonText="Claim Your Free Mockup"
        buttonTo="/contact"
      />
    </div>
  );
}
