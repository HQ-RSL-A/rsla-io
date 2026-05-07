import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['ai-automations'];

const whatWeAutomate = [
  {
    label: 'Lead follow-up',
    desc: 'n8n or Make workflows that fire within 90 seconds of a new lead hitting your CRM, no manual action required.',
  },
  {
    label: 'Client onboarding',
    desc: 'Automated intake forms, contract delivery, welcome sequences, and kickoff scheduling from a single trigger.',
  },
  {
    label: 'Reporting and analytics',
    desc: 'Scheduled reports pulled from your ad platforms, CRM, and analytics tools and delivered to Slack or email daily.',
  },
  {
    label: 'Content and outreach',
    desc: 'AI-assisted content repurposing pipelines and personalized cold email sequences built on OpenAI or Claude.',
  },
];

export default function AiAutomations() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we automate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatWeAutomate.map((item) => (
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
