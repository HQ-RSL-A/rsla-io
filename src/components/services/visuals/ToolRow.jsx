/**
 * Logos of the tools a page names, from public/images/logos. Outcomes come
 * first on every page; this row sits inside the "how we build it" section.
 */
const catalog = {
    gohighlevel: { src: '/images/logos/gohighlevel.webp', name: 'GoHighLevel' },
    n8n: { src: '/images/logos/n8n.svg', name: 'n8n' },
    make: { src: '/images/logos/make.webp', name: 'Make' },
    notion: { src: '/images/logos/notion.svg', name: 'Notion' },
    twilio: { src: '/images/logos/twilio.svg', name: 'Twilio' },
    stripe: { src: '/images/logos/stripe.svg', name: 'Stripe' },
    supabase: { src: '/images/logos/supabase.svg', name: 'Supabase' },
    vercel: { src: '/images/logos/vercel.svg', name: 'Vercel' },
    github: { src: '/images/logos/github.svg', name: 'GitHub' },
    sanity: { src: '/images/logos/sanity.svg', name: 'Sanity' },
    resend: { src: '/images/logos/resend.svg', name: 'Resend' },
    zapier: { src: '/images/logos/zapier.svg', name: 'Zapier' },
    slack: { src: '/images/logos/slack.svg', name: 'Slack' },
    airtable: { src: '/images/logos/airtable.svg', name: 'Airtable' },
};

export default function ToolRow({ tools = ['n8n', 'make', 'gohighlevel', 'notion', 'twilio', 'stripe'], caption }) {
    return (
        <div>
            <ul className="flex flex-wrap gap-2.5" aria-label="Tools we build with">
                {tools.map((key) => {
                    const t = catalog[key];
                    if (!t) return null;
                    return (
                        <li key={key} className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5">
                            <img src={t.src} alt="" width="18" height="18" loading="lazy" className="w-[18px] h-[18px] object-contain" />
                            <span className="font-sans font-medium text-sm text-text">{t.name}</span>
                        </li>
                    );
                })}
            </ul>
            {caption && <p className="mt-3 font-sans text-sm text-text">{caption}</p>}
        </div>
    );
}
