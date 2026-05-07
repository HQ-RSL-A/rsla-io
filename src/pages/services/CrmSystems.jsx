import { services } from '@/data/serviceData';
import ServiceLayout from '@/components/services/ServiceLayout';

const service = services['crm-systems'];

const whatWeSetUp = [
  {
    label: 'Pipelines and workflows',
    desc: 'GoHighLevel pipelines built around your actual sales stages, with automated stage-move triggers and task assignments.',
  },
  {
    label: 'Email and SMS automation',
    desc: 'Multi-step follow-up sequences for new leads, no-shows, win-back campaigns, and post-purchase nurture, all inside GHL.',
  },
  {
    label: 'Booking and calendars',
    desc: 'GHL calendar setup with confirmation, reminder, and follow-up sequences so no-shows and missed appointments become the exception.',
  },
  {
    label: 'Integrations',
    desc: 'Connect GHL to your existing tools: Facebook Lead Ads, Google Ads, Stripe, Zapier, and your website contact forms.',
  },
];

export default function CrmSystems() {
  return (
    <ServiceLayout service={service}>
      <section className="bg-accent-light py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-text mb-4">
              What we set up
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatWeSetUp.map((item) => (
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
