import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/data/serviceData';
import Seo from '@/components/Seo';
import { generateFaqSchema } from '@/components/services/ServiceFaq';

gsap.registerPlugin(ScrollTrigger);

const service = services['web-design'];

const FEATURES = [
  { tag: 'Build', title: 'Custom-coded', body: 'No page builders, no bloat. Every site is hand-coded for speed, accessibility, and search performance.' },
  { tag: 'Visibility', title: 'On-page SEO', body: 'Schema markup, semantic HTML, meta tags, sitemaps, and keyword-aligned copy so search engines understand your business.' },
  { tag: 'Devices', title: 'Mobile optimized', body: 'Designed for phones first. Fast load times, proper tap targets, and a smooth experience on every screen size.' },
  { tag: 'Local', title: 'Local SEO', body: 'Google Business Profile integration, NAP consistency, location pages, and review schema so you show up in the map pack.' },
  { tag: 'AI ready', title: 'AEO / GEO ready', body: 'Structured so ChatGPT, Perplexity, and Google AI Overviews can find and cite your business in their answers.' },
  { tag: 'Craft', title: 'Meticulously designed', body: 'Typography, color, spacing, and layout tuned by hand. Your website should feel as good as the work you do.' },
];

const STEPS = [
  { n: '01', title: 'We learn your business', body: 'A conversation about who you are, who your customers are, and what your website needs to do. No intake forms.' },
  { n: '02', title: 'We design it for you', body: 'You see a real mockup of your homepage with real copy. Not a wireframe, not a slide deck. What you approve is what gets built.' },
  { n: '03', title: 'We build it by hand', body: 'Custom-coded from scratch. SEO, speed, and mobile optimization go in from the start, not bolted on after.' },
  { n: '04', title: 'We launch and stick around', body: 'We take your site live, show you how to update it, and hand over the keys. If you want ongoing help, we do that too.' },
];

const PORTFOLIO = [
  { src: '/images/portfolio/apexDetailing.jpg', alt: 'Apex Detailing custom website by RSL/A', name: 'Apex Detailing' },
  { src: '/images/portfolio/solCantina.jpg', alt: 'Sol Cantina restaurant website by RSL/A', name: 'Sol Cantina' },
  { src: '/images/portfolio/46goat.jpg', alt: '46GOAT e-commerce website by RSL/A', name: '46GOAT' },
  { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website by RSL/A', name: 'Caplan Communications' },
];

const FAQS = service.faqs;

const IcoCode = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M14 4l-4 16"/></svg>;
const IcoSEO = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/><path d="M9 11h4"/><path d="M11 9v4"/></svg>;
const IcoMobile = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/><path d="M6 6h12"/></svg>;
const IcoLocal = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IcoAI = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v6H7z"/><path d="M5 14h14"/><path d="M5 19h14"/><path d="M9 7h6"/></svg>;
const IcoDesign = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="3"/></svg>;

const ICONS = [IcoCode, IcoSEO, IcoMobile, IcoLocal, IcoAI, IcoDesign];

function Arrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
}

export default function WebDesign2() {
  const pageRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.wd2-hero-text, .wd2-hero-mockup, .wd2-reveal', { opacity: 1, y: 0 });
        gsap.utils.toArray('.wd2-feat').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
        gsap.utils.toArray('.wd2-port-item').forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
        gsap.utils.toArray('.wd2-tl-row').forEach((el) => gsap.set(el, { opacity: 1, x: 0 }));
        return;
      }

      const ease = 'expo.out';

      gsap.fromTo('.wd2-hero-text', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease, delay: 0.1 });
      gsap.fromTo('.wd2-hero-mockup', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease, delay: 0.25 });

      gsap.utils.toArray('.wd2-feat').forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease, delay: i * 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      gsap.utils.toArray('.wd2-port-item').forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease, delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      gsap.utils.toArray('.wd2-reveal').forEach((el) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      gsap.utils.toArray('.wd2-tl-row').forEach((el, i) => {
        gsap.fromTo(el, { x: -16, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, ease, delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rsla.io/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://rsla.io/services' },
      { '@type': 'ListItem', position: 3, name: 'Web Design', item: 'https://rsla.io/services/web-design' },
    ],
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    provider: { '@id': 'https://rsla.io/#business' },
    url: 'https://rsla.io/services/web-design',
    areaServed: { '@type': 'Country', name: 'US' },
  };
  const faqSchema = generateFaqSchema(FAQS);
  const jsonLd = [breadcrumbSchema, serviceSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <main className="wd2" ref={pageRef}>
      <style>{WD2_STYLES}</style>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical="https://rsla.io/services/web-design"
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="wd2-hero wd2-section">
        <div className="wd2-wrap">
          <div className="wd2-hero-grid">
            <div className="wd2-hero-text opacity-0">
              <h1 className="wd2-h-display wd2-h1">
                Websites that <span className="wd2-emph">actually</span><br/>show up.
              </h1>
              <p className="wd2-lede">
                Custom-coded sites for plumbers, dentists, and the people who run real shops. Fast where it matters. Found where you live.
              </p>
              <div className="wd2-hero-ctas">
                <Link to="/contact" className="wd2-btn wd2-btn-primary">Get a quote <Arrow /></Link>
                <a href="#wd2-process" className="wd2-btn wd2-btn-ghost">See how we work</a>
              </div>
              <div className="wd2-meta-row">
                <span className="wd2-status-dot"></span>
                <span className="wd2-meta-text">Booking projects now</span>
              </div>
            </div>
            <div className="wd2-hero-mockup opacity-0">
              <div className="wd2-mockup">
                <div className="wd2-mockup-bar"><i></i><i></i><i></i><div className="wd2-mockup-url">yourshop.com</div></div>
                <div className="wd2-mockup-body">
                  <div className="wd2-lay wd2-l1"></div>
                  <div className="wd2-lay wd2-l2"></div>
                  <div className="wd2-lay wd2-l3"></div>
                  <div className="wd2-lay wd2-l4"></div>
                  <div className="wd2-lay wd2-l5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="wd2-section" id="wd2-services">
        <div className="wd2-wrap">
          <div className="wd2-features-head wd2-reveal opacity-0">
            <div>
              <h2 className="wd2-h-display wd2-h2">Here is what every site ships with.</h2>
            </div>
            <p className="wd2-lede">
              Most agencies charge extra for these or skip them altogether. We build all six into every project.
            </p>
          </div>
          <div className="wd2-feat-scroll-wrap">
            <div className="wd2-feat-grid">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[i];
                return (
                  <div className="wd2-feat opacity-0" key={i}>
                    <div className="wd2-feat-top">
                      <span className="wd2-feat-num">0{i + 1} / 06</span>
                      <Icon />
                    </div>
                    <span className="wd2-feat-tag">{f.tag}</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="wd2-mid-cta wd2-reveal opacity-0">
        <div className="wd2-wrap wd2-center">
          <Link to="/contact" className="wd2-btn wd2-btn-primary">Get a quote <Arrow /></Link>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="wd2-section wd2-section-alt">
        <div className="wd2-wrap">
          <div className="wd2-port-head wd2-reveal opacity-0">
            <div>
              <h2 className="wd2-h-display wd2-h2">Every site is different. Because every business is.</h2>
            </div>
            <p className="wd2-lede">No templates, no recycled layouts. Each project starts from scratch.</p>
          </div>
          <div className="wd2-port-grid">
            {PORTFOLIO.map((p) => (
              <div className="wd2-port-item opacity-0" key={p.name}>
                <div className="wd2-port-frame">
                  <div className="wd2-mockup-bar"><i></i><i></i><i></i></div>
                  <div className="wd2-port-img-wrap">
                    <img src={p.src} alt={p.alt} className="wd2-port-img" loading="lazy" width="640" height="400" />
                  </div>
                </div>
                <p className="wd2-port-name">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="wd2-section wd2-section-process" id="wd2-process">
        <div className="wd2-wrap">
          <div className="wd2-process-head wd2-reveal opacity-0">
            <div>
              <h2 className="wd2-h-display wd2-h2">Here is how we do it.</h2>
            </div>
            <p className="wd2-lede">One designer-developer from start to finish. No hand-offs, no agency telephone game.</p>
          </div>
          <div className="wd2-timeline">
            {STEPS.map((s, i) => (
              <div className={`wd2-tl-row opacity-0${i === 0 ? ' active' : ''}`} key={s.n}>
                <div className="wd2-tl-bullet">{s.n}</div>
                <div className="wd2-tl-main">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="wd2-section wd2-section-testimonial">
        <div className="wd2-wrap">
          <div className="wd2-testimonial wd2-reveal opacity-0">
            <div className="wd2-testimonial-initial" aria-hidden="true">C</div>
            <div>
              <div className="wd2-testimonial-quote">
                "Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, <span className="wd2-emph">ranks better</span>, and the automation saves us tons of time. Highly recommend."
              </div>
              <div className="wd2-testimonial-cite"><span className="wd2-cite-name">Chris K.</span> CEO/Co-Founder, Fieldshare</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="wd2-section wd2-reveal opacity-0" style={{ paddingTop: 0 }}>
        <div className="wd2-wrap">
          <div className="wd2-cta-band">
            <div>
              <h2 className="wd2-h-display wd2-h2" style={{ maxWidth: '16ch' }}>Tell us about your business.</h2>
              <p className="wd2-lede" style={{ marginTop: 16 }}>A 20-minute call, a written quote within 48 hours. No sales script.</p>
            </div>
            <div className="wd2-cta-btns">
              <Link to="/contact" className="wd2-btn wd2-btn-primary">Get a quote <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wd2-section" id="wd2-faq">
        <div className="wd2-wrap">
          <div className="wd2-faq-head wd2-reveal opacity-0">
            <div>
              <h2 className="wd2-h-display wd2-h2">Questions, answered.</h2>
            </div>
            <p className="wd2-lede">
              Something we did not cover? <Link to="/contact" style={{ borderBottom: '1px solid currentColor' }}>Get in touch</Link> and we will get back to you the same day.
            </p>
          </div>
          <div className="wd2-faq-list wd2-reveal opacity-0">
            {FAQS.map((f, i) => (
              <div className={`wd2-faq-item${openFaq === i ? ' open' : ''}`} key={i}>
                <button className="wd2-faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="wd2-faq-plus" aria-hidden="true"></span>
                </button>
                <div className="wd2-faq-a"><div><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const WD2_STYLES = `
.wd2{--paper:#ffffff;--paper-2:#f5f5f7;--card:#ffffff;--ink:#0a0a0a;--ink-2:#2b2b2e;--muted:#6b6b72;--line:rgba(10,10,10,.10);--line-strong:rgba(10,10,10,.22);--accent:#0066E0;--f-display:"Satoshi",ui-sans-serif,system-ui,sans-serif;--f-script:"Caveat","Segoe Script",cursive;--f-mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;--pad-section:clamp(64px,9vw,140px);--pad-x:clamp(20px,5vw,72px);--maxw:1280px;--radius:14px;font-family:var(--f-display);font-size:17px;line-height:1.55;color:var(--ink);-webkit-font-smoothing:antialiased}
.wd2 *{box-sizing:border-box}
.wd2-wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--pad-x)}
.wd2-center{text-align:center}
.wd2-section{padding:var(--pad-section) 0;position:relative}
.wd2-section-alt{background:var(--paper-2)}
.wd2-section-process{padding-bottom:clamp(40px,6vw,80px)}
.wd2-section-testimonial{padding-top:0;padding-bottom:clamp(48px,7vw,100px)}
.wd2-h-display{font-family:var(--f-display);font-weight:700;letter-spacing:-0.025em;line-height:.98;color:var(--ink);text-wrap:balance}
.wd2-h1{font-size:clamp(48px,7.5vw,112px)}
.wd2-h2{font-size:clamp(36px,5vw,72px)}
.wd2-lede{font-size:clamp(17px,1.4vw,21px);color:var(--ink-2);line-height:1.5;max-width:42ch;text-wrap:pretty}
.wd2-emph{font-family:var(--f-script);font-weight:600;color:var(--accent);letter-spacing:-.005em;display:inline-block;transform:translateY(.04em) rotate(-2deg);transform-origin:left bottom}

/* buttons */
.wd2-btn{display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 24px;border-radius:12px;font-family:var(--f-display);font-size:15px;font-weight:600;border:1px solid transparent;cursor:pointer;transition:transform 160ms cubic-bezier(0.23,1,0.32,1),background 200ms ease-out,color 200ms ease-out,box-shadow 200ms ease-out;white-space:nowrap;text-decoration:none}
.wd2-btn:hover{transform:translateY(-1px)}
.wd2-btn:active{transform:scale(0.97);transition-duration:100ms}
.wd2-btn-primary{background:var(--accent);color:#fff;box-shadow:0 1px 3px rgba(0,102,224,.2)}
.wd2-btn-primary:hover{background:color-mix(in oklab,var(--accent) 85%,black);box-shadow:0 4px 12px rgba(0,102,224,.25)}
.wd2-btn-ghost{background:transparent;color:var(--ink);border-color:var(--line-strong)}
.wd2-btn-ghost:hover{background:var(--ink);color:#fff;border-color:var(--ink)}

/* hero */
.wd2-hero{padding-top:clamp(80px,10vw,140px);padding-bottom:var(--pad-section)}
.wd2-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:end}
@media(max-width:960px){.wd2-hero-grid{grid-template-columns:1fr;gap:40px}}
.wd2-hero-text .wd2-lede{margin-top:28px}
.wd2-hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:36px}
.wd2-meta-row{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:18px}
.wd2-status-dot{width:8px;height:8px;border-radius:50%;background:#1f8a5b;box-shadow:0 0 0 3px rgba(31,138,91,.25);display:inline-block}
.wd2-meta-text{font-family:var(--f-display);font-size:13px;color:var(--muted);letter-spacing:.02em}

/* mockup */
.wd2-mockup{position:relative;aspect-ratio:4/3;border-radius:14px;border:1px solid var(--line-strong);background:var(--card);overflow:hidden;box-shadow:0 30px 60px -30px rgba(26,24,20,.18),0 2px 0 rgba(255,255,255,.6) inset}
.wd2-mockup-bar{height:34px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px;padding:0 12px;background:linear-gradient(180deg,rgba(245,245,247,.6),var(--card))}
.wd2-mockup-bar i{width:9px;height:9px;border-radius:50%;background:var(--line-strong);display:inline-block}
.wd2-mockup-url{margin-left:8px;flex:1;height:18px;border-radius:6px;background:var(--paper-2);font-family:var(--f-mono);font-size:10.5px;color:var(--muted);display:flex;align-items:center;padding:0 10px;letter-spacing:.03em}
.wd2-mockup-body{position:absolute;inset:34px 0 0 0;background-image:repeating-linear-gradient(135deg,rgba(10,10,10,.04) 0 1px,transparent 1px 12px);overflow:hidden}
.wd2-lay{position:absolute;background:var(--card);border:1px solid var(--line);border-radius:8px}
.wd2-l1{left:5%;top:8%;width:32%;height:6%}.wd2-l2{left:5%;top:18%;width:62%;height:14%}.wd2-l3{left:5%;top:36%;width:42%;height:8%}.wd2-l4{left:5%;top:50%;width:90%;height:30%;background:var(--ink);border-color:var(--ink)}.wd2-l5{left:5%;top:84%;width:18%;height:8%;background:var(--accent);border-color:var(--accent)}

/* mid-page cta */
.wd2-mid-cta{padding:0 0 clamp(48px,6vw,80px);position:relative}

/* features */
.wd2-features-head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end;margin-bottom:64px}
@media(max-width:820px){.wd2-features-head{grid-template-columns:1fr;gap:24px;margin-bottom:40px}}
.wd2-feat-scroll-wrap{overflow:visible}
.wd2-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--line);border-left:1px solid var(--line)}
@media(max-width:960px){.wd2-feat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){
  .wd2-feat-scroll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 calc(var(--pad-x) * -1);padding:0 var(--pad-x);scrollbar-width:none}
  .wd2-feat-scroll-wrap::-webkit-scrollbar{display:none}
  .wd2-feat-grid{grid-template-columns:repeat(6,280px);grid-template-rows:1fr;border-top:1px solid var(--line);border-left:1px solid var(--line);width:max-content}
}
.wd2-feat{padding:36px 28px 32px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:14px;position:relative;min-height:240px;transition:box-shadow 200ms cubic-bezier(0.23,1,0.32,1),border-color 200ms cubic-bezier(0.23,1,0.32,1)}
.wd2-feat:hover{box-shadow:0 8px 24px -8px rgba(10,10,10,.08);border-color:var(--line-strong)}
.wd2-feat-top{display:flex;align-items:center;justify-content:space-between}
.wd2-feat-num{font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;color:var(--muted);white-space:nowrap}
.wd2-feat h3{margin:0;font-family:var(--f-display);font-size:24px;font-weight:600;letter-spacing:-.015em;line-height:1.1}
.wd2-feat p{margin:0;color:var(--muted);font-size:15px;line-height:1.55}
.wd2-feat-tag{position:absolute;right:16px;top:16px;font-family:var(--f-mono);font-size:10px;letter-spacing:.1em;color:var(--accent);text-transform:uppercase}

/* portfolio */
.wd2-port-head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end;margin-bottom:56px}
@media(max-width:820px){.wd2-port-head{grid-template-columns:1fr;gap:24px;margin-bottom:40px}}
.wd2-port-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
@media(max-width:600px){.wd2-port-grid{grid-template-columns:1fr;gap:20px}}
.wd2-port-frame{border-radius:12px;overflow:hidden;border:1px solid var(--line-strong);background:var(--card);box-shadow:0 12px 40px -12px rgba(10,10,10,.1);transition:box-shadow 200ms cubic-bezier(0.23,1,0.32,1),transform 200ms cubic-bezier(0.23,1,0.32,1)}
.wd2-port-item:hover .wd2-port-frame{box-shadow:0 20px 50px -16px rgba(10,10,10,.15);transform:translateY(-2px)}
.wd2-port-frame .wd2-mockup-bar{height:30px;padding:0 10px;gap:5px}
.wd2-port-frame .wd2-mockup-bar i{width:7px;height:7px}
.wd2-port-img-wrap{aspect-ratio:16/10;overflow:hidden}
.wd2-port-img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.wd2-port-name{font-family:var(--f-display);font-size:14px;font-weight:500;color:var(--muted);margin-top:12px;text-align:center}

/* timeline */
.wd2-process-head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end;margin-bottom:64px}
@media(max-width:820px){.wd2-process-head{grid-template-columns:1fr;gap:24px;margin-bottom:40px}}
.wd2-timeline{position:relative}
.wd2-timeline::before{content:"";position:absolute;left:18px;top:8px;bottom:8px;width:1px;background:linear-gradient(180deg,var(--ink) 0%,var(--line) 100%)}
.wd2-tl-row{display:grid;grid-template-columns:64px 1fr;gap:32px;padding:36px 0;border-bottom:1px dashed var(--line);position:relative}
.wd2-tl-row:last-child{border-bottom:0}
@media(max-width:820px){.wd2-tl-row{grid-template-columns:48px 1fr;gap:20px}}
.wd2-tl-bullet{position:relative;z-index:1;width:36px;height:36px;border-radius:50%;background:var(--paper-2);border:1px solid var(--line-strong);display:flex;align-items:center;justify-content:center;font-family:var(--f-mono);font-size:12px;color:var(--ink)}
.wd2-tl-row.active .wd2-tl-bullet{background:var(--ink);color:#fff;border-color:var(--ink)}
.wd2-tl-main h3{margin:0 0 8px;font-family:var(--f-display);font-size:clamp(24px,3vw,36px);font-weight:600;letter-spacing:-.02em;line-height:1.05}
.wd2-tl-main p{margin:0;color:var(--muted);max-width:50ch;font-size:16px;line-height:1.6}

/* testimonial */
.wd2-testimonial{background:var(--ink);color:#fff;border-radius:var(--radius);padding:clamp(40px,6vw,80px);display:grid;grid-template-columns:auto 1fr;gap:clamp(28px,5vw,64px);align-items:center}
@media(max-width:720px){.wd2-testimonial{grid-template-columns:1fr;text-align:center}}
.wd2-testimonial-initial{width:100px;height:100px;border-radius:50%;background:color-mix(in oklab,var(--accent) 60%,var(--ink));border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-size:42px;font-weight:700;color:rgba(255,255,255,.9);flex-shrink:0}
@media(max-width:720px){.wd2-testimonial-initial{margin:0 auto}}
.wd2-testimonial-quote{font-family:var(--f-display);font-size:clamp(20px,2.4vw,28px);letter-spacing:-.015em;line-height:1.4;font-weight:500;text-wrap:balance}
.wd2-testimonial-quote .wd2-emph{color:#fff;font-size:1.1em;line-height:1;transform:none}
.wd2-testimonial-cite{margin-top:20px;font-family:var(--f-display);font-size:13px;color:rgba(255,255,255,.5);letter-spacing:.01em}
.wd2-cite-name{color:rgba(255,255,255,.85);font-weight:600;margin-right:6px}

/* faq */
.wd2-faq-head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end;margin-bottom:48px}
@media(max-width:820px){.wd2-faq-head{grid-template-columns:1fr;gap:24px}}
.wd2-faq-list{border-top:1px solid var(--ink)}
.wd2-faq-item{border-bottom:1px solid var(--line)}
.wd2-faq-q{display:flex;align-items:center;justify-content:space-between;gap:24px;width:100%;background:none;border:0;padding:28px 4px;text-align:left;cursor:pointer;color:var(--ink);font-family:var(--f-display);font-size:clamp(18px,1.8vw,24px);font-weight:600;letter-spacing:-.015em;min-height:44px}
.wd2-faq-plus{width:24px;height:24px;position:relative;flex:0 0 auto}
.wd2-faq-plus::before,.wd2-faq-plus::after{content:"";position:absolute;background:var(--ink);transition:transform .25s cubic-bezier(0.23,1,0.32,1)}
.wd2-faq-plus::before{left:0;right:0;top:50%;height:1.5px;transform:translateY(-50%)}
.wd2-faq-plus::after{top:0;bottom:0;left:50%;width:1.5px;transform:translateX(-50%)}
.wd2-faq-item.open .wd2-faq-plus::after{transform:translateX(-50%) rotate(90deg)}
.wd2-faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s cubic-bezier(0.23,1,0.32,1)}
.wd2-faq-item.open .wd2-faq-a{grid-template-rows:1fr}
.wd2-faq-a>div{overflow:hidden}
.wd2-faq-a p{margin:0 0 28px;color:var(--muted);max-width:60ch;padding-right:48px;font-size:16px;line-height:1.6}

/* cta band */
.wd2-cta-band{border-radius:var(--radius);background:linear-gradient(180deg,var(--paper-2),var(--card));border:1px solid var(--line);padding:clamp(36px,5vw,64px);display:grid;grid-template-columns:1.4fr auto;gap:48px;align-items:center;position:relative;overflow:hidden}
@media(max-width:820px){.wd2-cta-band{grid-template-columns:1fr;gap:28px}}
.wd2-cta-band::before{content:"";position:absolute;right:-80px;top:-80px;width:300px;height:300px;border-radius:50%;background:var(--accent);opacity:.12}
.wd2-cta-btns{display:flex;gap:12px;flex-wrap:wrap;position:relative}

/* mobile polish */
@media(max-width:600px){
  .wd2-hero-ctas{flex-direction:column}
  .wd2-hero-ctas .wd2-btn{width:100%;justify-content:center}
  .wd2-meta-row{justify-content:center}
  .wd2-features-head{text-align:center}
  .wd2-features-head .wd2-lede{margin:0 auto}
  .wd2-process-head{text-align:center}
  .wd2-process-head .wd2-lede{margin:0 auto}
  .wd2-faq-head{text-align:center}
  .wd2-faq-head .wd2-lede{margin:0 auto}
  .wd2-cta-band{text-align:center}
  .wd2-cta-band .wd2-lede{margin:0 auto}
  .wd2-cta-btns{justify-content:center}
}
`;
