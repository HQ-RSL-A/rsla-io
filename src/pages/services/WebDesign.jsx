import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, Search, Bot, MapPin, Zap, Shield, X as XIcon } from 'lucide-react';
import { services } from '@/data/serviceData';
import Seo from '@/components/Seo';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';
import CtaWithGlow from '@/components/CtaWithGlow';
import { TextAnimate } from '@/components/ui/text-animate';
import ImageComparisonSlider from '@/components/ui/imageComparisonSlider';

gsap.registerPlugin(ScrollTrigger);

const service = services['web-design'];

const portfolioSites = [
  { src: '/images/portfolio/apexDetailing.jpg', alt: 'Apex Detailing website', name: 'Apex Detailing', desc: 'Mobile auto detailing and ceramic coating' },
  { src: '/images/portfolio/solCantina.jpg', alt: 'Sol Cantina restaurant website', name: 'Sol Cantina', desc: 'Authentic Mexican restaurant' },
  { src: '/images/portfolio/ironPetal.jpg', alt: 'Iron Petal website', name: 'Iron Petal', desc: 'Modern tattoo studio in New York' },
  { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website', name: 'Caplan Communications', desc: 'Strategic PR and communications firm' },
  { src: '/images/portfolio/coldSpringJunkRemoval.jpg', alt: 'Cold Spring Junk Removal website', name: 'Cold Spring Junk Removal', desc: 'Local junk removal service' },
  { src: '/images/portfolio/46goat.jpg', alt: '46GOAT e-commerce website', name: '46GOAT', desc: 'Urban fashion e-commerce brand' },
  { src: '/images/portfolio/blackbirdInk.jpg', alt: 'Blackbird Ink website', name: 'Blackbird Ink', desc: 'Tattoo and salon studio' },
  { src: '/images/portfolio/owlOutreach.jpg', alt: 'Owl Outreach website', name: 'Owl Outreach', desc: 'B2B cold email outbound studio' },
  { src: '/images/portfolio/nexusRoasters.jpg', alt: 'Nexus Roasters website', name: 'Nexus Roasters', desc: 'Artisan coffee roasters' },
  { src: '/images/portfolio/unitedSikhs.jpg', alt: 'United Sikhs website', name: 'United Sikhs', desc: 'Global humanitarian nonprofit' },
  { src: '/images/portfolio/freedomDrivers.jpg', alt: 'Freedom Drivers website', name: 'Freedom Drivers', desc: 'Commercial driver advocacy nonprofit' },
];

const PORTFOLIO_INITIAL_COUNT = 6;

const painCards = [
  { title: 'Pretty but invisible', body: 'AI tools can build a modern-looking site in minutes. But if it is not built to rank and not structured for search engines, nobody finds it.' },
  { title: 'Looks like every other site', body: "Your provider's free website follows the same layouts used by hundreds of businesses. Nothing about it says you." },
  { title: 'The messaging is wrong', body: 'If search engines cannot understand what your business does, your customers will not either. Vague copy kills your chances before you compete.' },
];

const deliverables = [
  { icon: Globe, title: 'Custom design', body: 'Built around your brand personality, voice, and story. Not a template with your logo swapped in.' },
  { icon: Search, title: 'SEO foundation', body: 'Site structure, page titles, speed, and content optimized so search engines find and trust you from day one.' },
  { icon: Bot, title: 'Found by AI search, not just Google', body: 'Structured so your business shows up when people ask ChatGPT, Gemini, or Perplexity for recommendations.' },
  { icon: MapPin, title: 'Local search ready', body: 'Connected to your Google Business Profile and built to rank in your service area, Maps, and local results.' },
  { icon: Zap, title: 'Fast delivery', body: 'As fast as one week for focused builds. Larger scopes up to two months. Real timeline, no guessing.' },
  { icon: Shield, title: 'You own everything', body: 'Your code, your content, your domain. No vendor lock-in. Full CMS access to update content yourself.' },
];

const processSteps = [
  { num: '01', title: 'Deep-dive onboarding', body: 'We learn your business, brand, audience, and goals before we touch a single design.' },
  { num: '02', title: 'Design and copy', body: 'You see a real mockup with real messaging - not a wireframe or a slide deck.' },
  { num: '03', title: 'Build and optimize', body: 'Development, SEO setup, speed optimization, and testing across every device.' },
  { num: '04', title: 'Launch and ongoing', body: 'We go live, train you on the CMS, and hand everything over. Ongoing management available.' },
];

function PortfolioLightbox({ sites, selectedIndex, onClose }) {
  if (selectedIndex === null) return null;
  const site = sites[selectedIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <XIcon size={20} strokeWidth={2} />
      </button>
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={site.src}
          alt={site.alt}
          className="w-full h-auto rounded-xl shadow-2xl"
        />
        <div className="mt-4 text-center">
          <p className="font-sans font-bold text-lg text-white">{site.name}</p>
          <p className="font-sans text-base text-white/60">{site.desc}</p>
        </div>
      </div>
    </div>
  );
}

function MockupRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const honeypot = e.target.elements.website_url_confirm?.value;
    if (honeypot) return;
    window.dataLayer?.push({ event: 'mockup_request', cta_location: 'web_design_form' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-surface p-8 text-center">
        <p className="font-sans font-bold text-xl text-text mb-2">We got your request.</p>
        <p className="font-sans text-lg text-textMuted">You will hear from us within 24 hours with your mockup timeline.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-accent-border bg-surface p-6 md:p-8">
      <h3 className="font-sans font-extrabold text-xl text-text mb-2">Request your free homepage mockup</h3>
      <p className="font-sans text-base text-textMuted mb-6">Tell us about your business and we will design a mockup of your homepage. Delivered in 72 hours.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="mockup-name" className="block font-sans text-base font-semibold text-text mb-1.5">Your name</label>
          <input
            id="mockup-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-accent-border bg-background px-4 py-3 font-sans text-base text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="mockup-email" className="block font-sans text-base font-semibold text-text mb-1.5">Work email</label>
          <input
            id="mockup-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-accent-border bg-background px-4 py-3 font-sans text-base text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="john@company.com"
          />
        </div>
        <div>
          <label htmlFor="mockup-website" className="block font-sans text-base font-semibold text-text mb-1.5">Current website URL</label>
          <input
            id="mockup-website"
            name="currentWebsite"
            type="url"
            required
            className="w-full rounded-xl border border-accent-border bg-background px-4 py-3 font-sans text-base text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="https://yoursite.com"
          />
        </div>
        <div>
          <label htmlFor="mockup-goal" className="block font-sans text-base font-semibold text-text mb-1.5">What is the main thing your website should do for your business?</label>
          <textarea
            id="mockup-goal"
            name="goal"
            required
            rows={3}
            className="w-full rounded-xl border border-accent-border bg-background px-4 py-3 font-sans text-base text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            placeholder="Generate leads, book appointments, sell products..."
          />
        </div>
        <div>
          <label htmlFor="mockup-timeline" className="block font-sans text-base font-semibold text-text mb-1.5">When are you looking to get started?</label>
          <select
            id="mockup-timeline"
            name="timeline"
            required
            className="w-full rounded-xl border border-accent-border bg-background px-4 py-3 font-sans text-base text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            <option value="">Select a timeline</option>
            <option value="immediately">Immediately</option>
            <option value="1-2 weeks">Within 1-2 weeks</option>
            <option value="1 month">Within a month</option>
            <option value="just exploring">Just exploring options</option>
          </select>
        </div>

        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website_url_confirm">Leave this empty</label>
          <input type="text" id="website_url_confirm" name="website_url_confirm" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-accent px-8 py-4 font-sans font-bold text-lg text-white shadow-sm transition-colors hover:bg-accent/90 mt-2"
        >
          Send my mockup request
        </button>
        <p className="text-center font-sans text-base text-textMuted">No commitment. No credit card. We will follow up within 24 hours.</p>
      </div>
    </form>
  );
}

export default function WebDesign() {
  const pageRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);

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
      <section className="bg-surface pt-36 pb-16 md:pb-20 px-6 md:px-12">
        <div className="wd-hero-content opacity-0 max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-text mb-6">
            <TextAnimate animation="blurInUp" by="word" delay={0.06} startOnView={false} as="span">
              {service.headline}
            </TextAnimate>
          </h1>
          <p className="font-sans text-lg md:text-xl text-textMuted leading-relaxed max-w-2xl mx-auto mb-10">
            {service.description}
          </p>
          <a
            href="#mockup-form"
            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'web_design_hero' })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 font-sans font-bold text-lg text-white shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all hover:bg-accent/90 hover:shadow-[0_0_30px_rgba(0,112,243,0.4)] animate-[subtlePulse_3s_ease-in-out_infinite]"
          >
            Get a FREE homepage mockup
            <ArrowRight size={18} strokeWidth={2} className="opacity-70" />
          </a>
          <p className="mt-4 font-sans text-base text-textMuted">
            Delivered to your inbox in 72 hours.
          </p>
        </div>
      </section>

      {/* ── PORTFOLIO SHOWCASE ── */}
      <section className="bg-background py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-4">
            Every site is different. Because every business is.
          </h2>
          <p className="hr-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10 max-w-2xl">
            No templates, no recycled layouts. Each project is built from scratch around the brand it represents.
          </p>

          {/* Desktop: 2-col grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {(showAllPortfolio ? portfolioSites : portfolioSites.slice(0, PORTFOLIO_INITIAL_COUNT)).map((site, i) => (
              <div
                key={site.src}
                className={`group cursor-pointer ${i < PORTFOLIO_INITIAL_COUNT ? 'hr-reveal opacity-0' : ''}`}
                onClick={() => setLightboxIndex(i)}
              >
                <div className="rounded-xl overflow-hidden border border-accent-border bg-surface shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-center gap-1.5 border-b border-accent-border px-3 py-2 bg-background">
                    <span className="h-2 w-2 rounded-full bg-red-400/70" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                    <span className="h-2 w-2 rounded-full bg-green-400/70" />
                  </div>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={site.src}
                      alt={site.alt}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      width="640"
                      height="400"
                    />
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <p className="font-sans font-bold text-base text-text">{site.name}</p>
                  <p className="font-sans text-base text-textMuted">{site.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden">
            <div className="-mx-6 px-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {(showAllPortfolio ? portfolioSites : portfolioSites.slice(0, PORTFOLIO_INITIAL_COUNT)).map((site, i) => (
                  <div
                    key={site.src}
                    className="w-[300px] shrink-0 cursor-pointer"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="rounded-xl overflow-hidden border border-accent-border bg-surface shadow-sm">
                      <div className="flex items-center gap-1.5 border-b border-accent-border px-3 py-2 bg-background">
                        <span className="h-2 w-2 rounded-full bg-red-400/70" />
                        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                        <span className="h-2 w-2 rounded-full bg-green-400/70" />
                      </div>
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={site.src}
                          alt={site.alt}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          width="300"
                          height="188"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-sans font-bold text-base text-text">{site.name}</p>
                      <p className="font-sans text-base text-textMuted">{site.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-5">
              {(showAllPortfolio ? portfolioSites : portfolioSites.slice(0, PORTFOLIO_INITIAL_COUNT)).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-textMuted/30" />
              ))}
            </div>
          </div>

          {!showAllPortfolio && portfolioSites.length > PORTFOLIO_INITIAL_COUNT && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllPortfolio(true)}
                className="inline-flex items-center gap-2 font-sans font-semibold text-lg text-accent hover:text-accent/80 transition-colors"
              >
                See more projects
                <ArrowRight className="w-4 h-4 rotate-90" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </section>

      <PortfolioLightbox
        sites={portfolioSites}
        selectedIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      {/* ── 2. PAIN / PROBLEM ── */}
      <section className="bg-surface py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-12">
            Most websites fail before they launch.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {painCards.map((card) => (
              <div
                key={card.title}
                className="hr-reveal opacity-0 rounded-2xl border border-accent-border bg-background p-8"
              >
                <h3 className="font-sans font-bold text-lg text-text mb-3">{card.title}</h3>
                <p className="font-sans text-base text-textMuted leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT YOU GET ── */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
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

      {/* ── 4. PROCESS ── */}
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

      {/* ── 5. BEFORE / AFTER SLIDER ── */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="hr-reveal opacity-0 font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-4">
            The difference a real website makes.
          </h2>
          <p className="hr-reveal opacity-0 font-sans text-lg text-textMuted leading-relaxed mb-10 max-w-2xl">
            Fieldshare came to us with an outdated site that was not ranking or generating leads. Six months later, they were on page 1.
          </p>
          <div className="hr-reveal opacity-0">
            <ImageComparisonSlider
              beforeImage="/images/portfolio/fieldshare-before.jpg"
              afterImage="/images/portfolio/fieldshare-after.jpg"
              altBefore="Fieldshare website before RSL/A redesign"
              altAfter="Fieldshare website after RSL/A redesign"
              className="aspect-[16/9] border border-accent-border shadow-lg"
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 font-sans text-base font-semibold text-accent">
                Page 1 rankings
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 font-sans text-base font-semibold text-accent">
                3x organic traffic
              </span>
            </div>
            <Link
              to="/work/fieldshare-seo-website-rebrand"
              className="inline-flex items-center gap-1 font-sans text-base font-semibold text-accent hover:underline"
            >
              Read the full case study <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. AI MYTH-BUSTER ── */}
      <section className="bg-surface py-20 md:py-28 px-6 md:px-12 border-t border-accent-border">
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

      {/* ── 7. FOUNDER + TESTIMONIAL ── */}
      <section className="bg-background py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent/20 shadow-sm">
              <img src="/images/rahul.webp" alt="Rahul Lalia" className="w-full h-full object-cover" loading="lazy" width="96" height="96" />
            </div>
          </div>
          <div className="hr-reveal opacity-0 text-center md:text-left">
            <p className="font-caveat text-3xl md:text-4xl text-text leading-snug mb-2">
              "Build it once and expect to build it again. A website is a living product. It needs to be fed, optimized, and taken care of."
            </p>
            <p className="font-sans text-base text-textMuted">
              Rahul Lalia, Founder of RSL/A
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <ServiceFaq faqs={service.faqs} serviceName={service.title} />

      {/* ── 9. MOCKUP REQUEST FORM ── */}
      <section id="mockup-form" className="bg-surface py-20 md:py-28 px-6 md:px-12 border-t border-accent-border scroll-mt-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="hr-reveal opacity-0">
            <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1] text-text mb-4">
              See what your new site could look like.
            </h2>
            <p className="font-sans text-lg text-textMuted leading-relaxed mb-6">
              Fill out this form and we will design a mockup of your homepage. Delivered in 72 hours. No commitment, no pitch.
            </p>
            <p className="font-sans text-lg text-textMuted">We personally review every request.</p>
          </div>
          <div className="hr-reveal opacity-0">
            <MockupRequestForm />
          </div>
        </div>
      </section>

      {/* ── 10. CTA ── */}
      <CtaWithGlow
        title="Rather just talk? Book a free call."
        subtitle="No pitch, no pressure. We will look at your situation and tell you exactly what we would do."
        buttonText="Book a Call"
        buttonTo="/contact"
      />
    </div>
  );
}
