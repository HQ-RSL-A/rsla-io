import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['custom-development'];

const whatWeBuild = [
  {
    label: 'SaaS products',
    desc: 'Full-stack React and Next.js applications with auth, billing via Stripe, and a Supabase or PostgreSQL backend.',
  },
  {
    label: 'MVPs',
    desc: 'Scoped to validate the core use case in 4 to 8 weeks. Production-ready code, not a throwaway prototype.',
  },
  {
    label: 'Internal tools',
    desc: 'Operations dashboards, admin panels, and workflow apps that replace spreadsheets and disconnected point tools.',
  },
  {
    label: 'APIs and integrations',
    desc: 'Node.js REST and GraphQL APIs, webhook handlers, and third-party integration layers between your existing systems.',
  },
];

export default function CustomDevelopment() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we build
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatWeBuild.map((item) => (
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
        </div>
      </section>
    </ServiceLayout>
  );
}
