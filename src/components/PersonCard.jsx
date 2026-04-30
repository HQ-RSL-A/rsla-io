import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { ShineBorder } from '@/components/ui/shine-border';
import { TextAnimate } from '@/components/ui/text-animate';

/**
 * Shared digital business card layout used by /rahul and /sid pages.
 *
 * Props:
 *   seo            - { title, description } passed to Seo component
 *   photo          - { src, alt }
 *   name           - display name
 *   title          - role / title line
 *   subtitle       - second line under title
 *   email          - email address
 *   contactActions - array of { label, icon (Lucide component), href, highlight?, external? }
 *   socials        - array of { name, href, icon (JSX) }
 */
export default function PersonCard({ seo, photo, name, title, subtitle, email, contactActions, socials }) {
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
            <Seo
                title={seo.title}
                description={seo.description}
                noIndex
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm bg-surfaceAlt border border-accent-border rounded-3xl px-8 py-10 flex flex-col items-center shadow-sm overflow-hidden">
                <ShineBorder shineColor={['#0070F3', '#00C2FF']} borderWidth={1} duration={10} />
                {/* Profile photo */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent/30 shadow-lg shadow-accent/10 mb-6">
                    <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" loading="lazy" width="112" height="112" />
                </div>

                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-1.5 text-text">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        {name}
                    </TextAnimate>
                </h1>
                <p className="font-sans text-accent text-sm font-bold mb-1">{title}</p>
                <p className="font-sans text-textMuted text-sm mb-8">{subtitle}</p>

                {/* Contact actions */}
                <div className="w-full flex flex-col gap-3 mb-8">
                    {contactActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <a
                                key={action.label}
                                href={action.href}
                                target={action.external ? '_blank' : undefined}
                                rel={action.external ? 'noopener noreferrer' : undefined}
                                className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl text-base font-sans font-bold transition-colors ${action.highlight
                                    ? 'bg-accent text-white hover:bg-accent/90'
                                    : 'bg-surface border border-accent-border text-text hover:border-accent/40 hover:bg-accent-light'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={2} />
                                <span>{action.label}</span>
                            </a>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-accent-border mb-6" />

                {/* Email */}
                <a
                    href={`mailto:${email}`}
                    className="font-sans text-sm tracking-wider text-textMuted hover:text-accent transition-colors mb-5 inline-flex items-center min-h-[44px]"
                >
                    {email}
                </a>

                {/* Socials */}
                <div className="flex items-center gap-2 mb-8">
                    {socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-textMuted hover:text-accent transition-colors duration-300"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-accent-border mb-6" />

                {/* Footer */}
                <Link to="/" className="font-sans text-sm uppercase tracking-widest text-textMuted/70 hover:text-textMuted transition-colors inline-flex items-center min-h-[44px] px-4">
                    Powered by RSL/A
                </Link>
            </div>
        </main>
    );
}
