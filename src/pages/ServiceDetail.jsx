import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo';

const RELATED_CASE_STUDIES = {
    websites: [
        { href: '/work/fieldshare-seo-website-rebrand', title: 'Page 1 in 6 Months: Fieldshare SEO Case Study' },
        { href: '/work/adreviveai-saas-build', title: 'Idea to SaaS in 4 Weeks: AdReviveAI' },
    ],
    'search-visibility': [
        { href: '/work/seo-content-marketing-automation', title: 'Saved $18K/Year with AI Content Automation' },
        { href: '/work/local-seo-reputation-management', title: 'From 14 to 132 Google Reviews in 60 Days' },
    ],
    'ai-automations': [
        { href: '/work/ai-lead-response-autoresponder', title: 'AI Email Auto-Responder in 24 Seconds' },
        { href: '/work/ai-cold-email-personalization', title: 'How We Personalize 1,200 Cold Emails a Day' },
        { href: '/work/field-service-operations-automation', title: 'Field Service Operations Rebuild with GHL' },
    ],
    'crm-systems': [
        { href: '/work/nonprofit-crm-volunteer-automation', title: 'Automated Volunteer Onboarding Replaces $40K Role' },
        { href: '/work/salon-marketing-automation-roi', title: '$600 in Meta Ads Drove $36K in Rental Income' },
    ],
    'custom-development': [
        { href: '/work/adreviveai-saas-build', title: 'Idea to SaaS in 4 Weeks: AdReviveAI' },
        { href: '/work/notion-productivity-dashboard-anchor-safety', title: '300 Files to One Notion Dashboard' },
    ],
};

const services = {
    websites: {
        title: 'Websites',
        headline: 'Custom websites that convert.',
        description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready. Launches that ship in weeks, not quarters.',
    },
    'search-visibility': {
        title: 'Search Visibility',
        headline: 'Show up where buyers look.',
        description: 'Rankings on Google, ChatGPT, Perplexity, and Claude. One system that shows up everywhere buyers look.',
    },
    'ai-automations': {
        title: 'AI Automations',
        headline: 'Replace manual work with AI.',
        description: 'n8n, Make, and custom scripts that replace manual work. Leads qualified and tasks routed while you sleep.',
    },
    'crm-systems': {
        title: 'CRM Systems',
        headline: 'One dashboard for everything.',
        description: 'GoHighLevel pipelines, workflows, and integrations. One dashboard for leads, deals, and bookings.',
    },
    'custom-development': {
        title: 'Custom Development',
        headline: 'When off-the-shelf is not enough.',
        description: 'SaaS products, MVPs, internal tools, APIs. Built from scratch, owned by you.',
    },
};

export default function ServiceDetail() {
    const { slug } = useParams();
    const service = services[slug];

    if (!service) {
        return (
            <main className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-4">Service not found</h1>
                <Link to="/services" className="text-accent hover:text-accent/80 font-sans font-semibold">Back to Services</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface text-text pt-32 pb-24 px-6 md:px-12">
            <Seo
                title={`${service.title} | RSL/A`}
                description={service.description}
                canonical={`https://rsla.io/services/${slug}`}
                keywords={`${service.title.toLowerCase()}, AI services, RSL/A, B2B AI systems`}
                noIndex
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: service.title,
                    description: service.description,
                    provider: { '@type': 'Organization', name: 'RSL/A', url: 'https://rsla.io' },
                    url: `https://rsla.io/services/${slug}`,
                    areaServed: { '@type': 'Place', name: 'Worldwide' },
                }}
            />
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-12"
                >
                    Back to Services
                </Link>

                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-6">
                    {service.headline}
                </h1>
                <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl mb-12">
                    {service.description}
                </p>

                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
                >
                    Let's Talk
                    <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
                </Link>

                {RELATED_CASE_STUDIES[slug]?.length > 0 && (
                    <section className="mt-16">
                        <h2 className="font-sans text-sm text-textMuted uppercase tracking-widest mb-6">See it in action</h2>
                        <div className="flex flex-col gap-3">
                            {RELATED_CASE_STUDIES[slug].map(cs => (
                                <Link key={cs.href} to={cs.href} className="font-sans text-accent hover:underline">
                                    {cs.title}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10">
                    <Link to="/blog" className="font-sans text-sm text-textMuted hover:text-accent transition-colors">
                        Read our insights
                    </Link>
                </div>
            </div>
        </main>
    );
}
