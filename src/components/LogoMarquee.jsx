/**
 * LogoMarquee — single-row seamless logo strip with label on the left.
 * Layout: "Rahul and his team have worked with" label on the left column,
 * one horizontal row of logos scrolling on the right.
 *
 * On mobile the label stacks above the marquee for readability.
 */

import { Marquee } from '@/components/ui/marquee';

// Order hand-shuffled so brand cousins never land next to each other:
// Anthropic/Claude are 7 apart (max for 21-slot loop), Google's trio
// (Google Ads + Gemini + Antigravity) each sit ~7 positions from the others,
// and tool clusters (LLM chatbots, automation, dev, ads, email) are
// interleaved instead of grouped.
const logos = [
    { name: 'ChatGPT',       file: 'chatgpt.svg'      },
    { name: 'Supabase',      file: 'supabase.svg'     },
    { name: 'Make',          file: 'make.webp'        },
    { name: 'Antigravity',   file: 'antigravity.webp' },
    { name: 'Sanity',        file: 'sanity.svg'       },
    { name: 'Meta',          file: 'meta.svg'         },
    { name: 'Anthropic',     file: 'anthropic.svg'    },
    { name: 'GoHighLevel',   file: 'gohighlevel.webp' },
    { name: 'Stripe',        file: 'stripe.svg'       },
    { name: 'Resend',        file: 'resend.svg'       },
    { name: 'Google Ads',    file: 'googleads.svg'    },
    { name: 'Vercel',        file: 'vercel.svg'       },
    { name: 'Notion',        file: 'notion.svg'       },
    { name: 'Claude',        file: 'claude.svg'       },
    { name: 'Zapier',        file: 'zapier.svg'       },
    { name: 'GitHub',        file: 'github.svg'       },
    { name: 'LinkedIn',      file: 'linkedin.svg'     },
    { name: 'Google Gemini', file: 'gemini.svg'       },
    { name: 'Instantly',     file: 'instantly.webp'   },
    { name: 'n8n',           file: 'n8n.svg'          },
    { name: 'Airtable',      file: 'airtable.svg'     },
];

function LogoItem({ name, file }) {
    return (
        <div className="shrink-0 flex items-center justify-center px-5 md:px-8">
            <img
                src={`/images/logos/${file}`}
                alt={name}
                width="80"
                height="40"
                className="h-7 md:h-10 w-auto max-w-[80px] md:max-w-[120px] object-contain opacity-75 hover:opacity-100 transition-opacity duration-200"
            />
        </div>
    );
}

export default function LogoMarquee() {
    return (
        <section className="w-full bg-surfaceAlt border-y border-hairline py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Left column: label */}
                <div className="shrink-0 text-left">
                    <p className="font-sans text-[15px] text-text whitespace-nowrap">
                        Rahul and his team have worked with
                    </p>
                </div>

                {/* Right column: single-row marquee */}
                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:60s] py-0">
                        {logos.map((logo) => (
                            <LogoItem key={logo.name} {...logo} />
                        ))}
                    </Marquee>
                    {/* Edge fade to blend into the section background */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surfaceAlt to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surfaceAlt to-transparent" />
                </div>
            </div>
        </section>
    );
}
