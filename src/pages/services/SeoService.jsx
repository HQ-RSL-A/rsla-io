import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['seo'];

const whatWeCover = [
  {
    label: 'Local SEO',
    desc: 'Google Business Profile optimization, citation building, and map pack rankings for service-area businesses.',
  },
  {
    label: 'Technical SEO',
    desc: 'Core Web Vitals, crawl budget, indexing fixes, schema markup, and internal linking structured for Google.',
  },
  {
    label: 'Answer engine optimization',
    desc: 'Content structured so ChatGPT, Perplexity, and Google AI Overviews cite your pages as the authoritative source.',
  },
];

const howWeWork = [
  {
    step: 'Audit',
    desc: 'Full technical crawl, GBP review, keyword gap analysis, and competitor benchmarking to see exactly where you stand.',
  },
  {
    step: 'Fix the foundation',
    desc: 'Crawlability, indexing, site speed, and schema cleaned up before any content work starts. Broken foundation limits everything above it.',
  },
  {
    step: 'Build content',
    desc: 'Keyword-targeted pages and answer-optimized content that serves both traditional search and AI-generated answers.',
  },
  {
    step: 'Track and iterate',
    desc: 'Monthly reporting on ranking movement, traffic, and conversions. We adjust based on what Google and AI tools are actually rewarding.',
  },
];

export default function SeoService() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we cover
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {whatWeCover.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-accent-border bg-surface p-5"
                >
                  <p className="font-sans font-bold text-base text-text mb-1">{item.label}</p>
                  <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              How we work
            </h2>
            <ol className="space-y-4">
              {howWeWork.map((item, i) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-sans text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-sans font-bold text-base text-text">{item.step}</p>
                    <p className="font-sans text-sm text-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}
