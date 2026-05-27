import { useState } from 'react';
import { Link } from 'react-router-dom';
import { urlForImage } from '../../sanity/lib/image';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

const isUnsafeUrl = (url) => /^(javascript|data|vbscript):/i.test(url);

function GatedResourceBlock({ title, description, downloadUrl, buttonText }) {
    const [status, setStatus] = useState('idle'); // idle | submitting | unlocked | error
    const [email, setEmail] = useState('');

    const triggerDownload = (url) => {
        if (isUnsafeUrl(url)) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop() || 'resource';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: KIT_FORM_ID }),
            });
            if (res.ok) {
                setStatus('unlocked');
                triggerDownload(downloadUrl);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    if (status === 'unlocked') {
        return (
            <div className="my-12 p-8 rounded-[1.5rem] border-2 border-accent/30 bg-accent/5 text-center">
                <p className="font-sans text-sm text-accent uppercase tracking-widest mb-4">Download Ready</p>
                <h4 className="text-xl font-bold font-sans text-text mb-2">{title}</h4>
                <p className="font-sans text-sm text-textMuted mb-6">Your download should start automatically.</p>
                <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-sans font-bold rounded-xl hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 shadow-[0_0_20px_rgba(0,112,243,0.25)]"
                >
                    Download Again
                </a>
            </div>
        );
    }

    return (
        <div className="my-12 p-8 rounded-[1.5rem] border-2 border-dashed border-accent/30 bg-accent/5 text-center">
            <p className="font-sans text-sm text-accent uppercase tracking-widest mb-4">Free Resource</p>
            <h4 className="text-xl font-bold font-sans text-text mb-2">{title}</h4>
            {description && (
                <p className="font-sans text-sm text-textMuted mb-6 max-w-md mx-auto">{description}</p>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    required
                    className="flex-1 px-4 min-h-[44px] rounded-xl bg-surface border border-accent-border text-text font-sans text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-5 min-h-[44px] rounded-xl bg-accent text-white font-sans font-bold text-sm hover:bg-accent/90 active:scale-[0.97] transition-[background-color,transform] duration-sm ease-out-smooth disabled:opacity-50 cursor-pointer"
                >
                    {status === 'submitting' ? '...' : (buttonText || 'Download')}
                </button>
            </form>
            {status === 'error' && (
                <p className="font-sans text-sm text-coral mt-3">Something went wrong. Try again.</p>
            )}
        </div>
    );
}

// Helper function to generate slug from text for anchor links
export function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/[-\s]+/g, '-') // Replace spaces and dashes with a single dash
        .replace(/^-|-$/g, '') // Remove leading and trailing dashes
        .replace(/[^a-z0-9-]/g, ''); // Remove all other non-alphanumeric characters
}

export const PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            const imageUrl = urlForImage(value.asset)?.width(1000).fit('max').url() || '';

            const aspectRatio = value.aspectRatio;
            const hasRatio = aspectRatio && aspectRatio !== 'auto';
            const ratioClass = aspectRatio === '16:9' ? 'aspect-video'
                : aspectRatio === '1:1' ? 'aspect-square'
                : aspectRatio === '4:5' ? 'aspect-[4/5]'
                : '';

            return (
                <figure className="my-12">
                    <div className={`relative w-full overflow-hidden bg-surfaceAlt rounded-[1.5rem] border border-accent-border ${hasRatio ? ratioClass : ''}`}>
                        <img
                            src={imageUrl}
                            alt={value.alt || 'Blog illustration'}
                            title={value.alt}
                            loading="lazy"
                            className={hasRatio ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto object-cover max-h-[600px]'}
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm font-sans text-textMuted mt-4 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        caseStudyImage: ({ value }) => {
            // Case study images have double-nested refs: value.asset is { _type: "image", asset: { _ref } }
            const ref = value?.asset?.asset?._ref;
            if (!ref) return null;
            const imageUrl = urlForImage(value.asset)?.width(1000).fit('max').url() || '';

            const sizeClass = value.size === 'small' ? 'max-w-md mx-auto' :
                              value.size === 'large' ? 'max-w-5xl mx-auto' : '';

            return (
                <figure className={`my-12 ${sizeClass}`}>
                    <div className="relative w-full overflow-hidden bg-surfaceAlt rounded-[1.5rem] border border-accent-border">
                        <img
                            src={imageUrl}
                            alt={value.alt || 'Case study image'}
                            title={value.alt}
                            loading="lazy"
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                    {(value.caption || value.credit) && (
                        <figcaption className="text-center text-sm font-sans text-textMuted mt-4 italic">
                            {value.caption}{value.credit ? ` — ${value.credit}` : ''}
                        </figcaption>
                    )}
                </figure>
            );
        },
        code: ({ value }) => {
            return (
                <pre className="bg-slate-900 text-white rounded-xl p-6 overflow-x-auto my-8 max-w-full shadow-lg">
                    {value.filename && (
                        <div className="text-sm text-accent font-sans mb-4 border-b border-white/10 pb-3">
                            {value.filename}
                        </div>
                    )}
                    <code className="text-sm font-mono block leading-relaxed">{value.code}</code>
                </pre>
            );
        },
        videoEmbed: ({ value }) => {
            const { url, caption, orientation } = value;
            let embedUrl = '';

            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be')
                    ? url.split('youtu.be/')[1]?.split('?')[0]
                    : url.split('v=')[1]?.split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('vimeo.com')) {
                const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                embedUrl = `https://player.vimeo.com/video/${videoId}`;
            } else if (url.includes('loom.com')) {
                const videoId = url.split('/share/')[1]?.split('?')[0];
                embedUrl = `https://www.loom.com/embed/${videoId}`;
            } else if (url.includes('wistia.com/medias/')) {
                const videoId = url.split('/medias/')[1]?.split('?')[0];
                embedUrl = `https://fast.wistia.net/embed/iframe/${videoId}`;
            }

            if (!embedUrl) return null;

            const isVertical = orientation === 'vertical';

            return (
                <figure className="my-10 flex flex-col items-center">
                    <div className={`relative rounded-xl overflow-hidden bg-surfaceAlt border border-accent-border shadow-lg ${isVertical ? 'w-full max-w-sm aspect-[9/16]' : 'w-full aspect-video'}`}>
                        <iframe
                            src={embedUrl}
                            title={caption || 'Embedded video'}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                    {caption && (
                        <figcaption className="text-center text-sm font-sans text-textMuted mt-4 italic">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        callout: ({ value }) => {
            const { title, content } = value;
            return (
                <div className="my-10 p-8 rounded-[1.5rem] border bg-accent/5 border-accent/20">
                    <div className="flex items-start gap-4">
                        <span className="w-1 self-stretch bg-accent/40 rounded-full shrink-0"></span>
                        <div className="flex-1">
                            {title && <h4 className="text-xl font-bold font-sans text-text mb-3">{title}</h4>}
                            <p className="font-sans text-textMuted leading-relaxed text-lg">{content}</p>
                        </div>
                    </div>
                </div>
            );
        },
        statsCard: ({ value }) => {
            const { stats } = value;
            if (!stats || stats.length === 0) return null;

            return (
                <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-surfaceAlt border border-accent-border rounded-2xl p-6 text-center shadow-sm">
                            <div className="text-4xl font-bold font-sans text-accent mb-2">{stat.value}</div>
                            <div className="text-[14px] font-sans text-textMuted uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            );
        },
        divider: ({ value }) => {
            const { style } = value;
            if (style === 'dots') {
                return (
                    <div className="my-16 flex justify-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                        <span className="w-2 h-2 rounded-full bg-accent/40"></span>
                    </div>
                );
            }
            return <hr className="my-16 border-t border-accent-border" />;
        },
        ctaButton: ({ value }) => {
            const { text, url, style } = value;
            if (!text || !url || isUnsafeUrl(url)) return null;

            const isInternal = url.startsWith('/');
            const Tag = isInternal ? Link : 'a';
            const linkProps = isInternal
                ? { to: url }
                : { href: url, target: '_blank', rel: 'noopener noreferrer' };

            const isPrimary = style !== 'secondary';

            return (
                <div className="my-10 flex justify-center">
                    <Tag
                        {...linkProps}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-bold text-base transition-[transform,background-color,border-color,box-shadow] duration-md ease-out-smooth hover:scale-[1.02] active:scale-[0.97] ${
                            isPrimary
                                ? 'bg-accent text-white shadow-[0_0_20px_rgba(0,112,243,0.25)]'
                                : 'bg-transparent text-text border-2 border-accent-border hover:border-accent/40'
                        }`}
                    >
                        {text} <span className={isPrimary ? 'text-white/70' : 'text-accent'}>→</span>
                    </Tag>
                </div>
            );
        },
        gatedResource: ({ value }) => {
            const { title, description, downloadUrl, buttonText } = value;
            if (!title || !downloadUrl || isUnsafeUrl(downloadUrl)) return null;

            return <GatedResourceBlock title={title} description={description} downloadUrl={downloadUrl} buttonText={buttonText} />;
        },
        testimonial: ({ value }) => {
            const { quote, author, role } = value;
            if (!quote) return null;

            return (
                <div className="my-12 p-8 rounded-[1.5rem] bg-surfaceAlt border border-accent-border relative">
                    <span className="text-6xl text-accent/20 font-sans absolute top-4 left-6 leading-none">"</span>
                    <blockquote className="text-xl md:text-2xl text-textMuted font-sans italic leading-relaxed pl-8 pt-4">
                        {quote}
                    </blockquote>
                    {(author || role) && (
                        <div className="mt-6 pl-8 flex items-center gap-3">
                            <div className="w-8 h-[2px] bg-accent/40" />
                            <div className="font-sans text-[15px] text-textMuted">
                                {author && <span className="font-medium text-text">{author}</span>}
                                {author && role && <span className="mx-1">·</span>}
                                {role && <span>{role}</span>}
                            </div>
                        </div>
                    )}
                </div>
            );
        },
        techStack: ({ value }) => {
            const { tools } = value;
            if (!tools || tools.length === 0) return null;

            return (
                <div className="my-10 p-8 rounded-[1.5rem] border bg-slate-900 text-white border-slate-900">
                    <div className="flex items-start gap-4">
                        <span className="w-1 self-stretch bg-accent rounded-full shrink-0"></span>
                        <div className="flex-1">
                            <h4 className="text-xl font-bold font-sans mb-4">Tech Specs</h4>
                            <ul className="space-y-3 font-sans text-lg">
                                {tools.map((tool, idx) => (
                                    <li key={idx} className="flex items-baseline gap-3">
                                        <span className="text-accent">◆</span>
                                        <div>
                                            {tool.url && !isUnsafeUrl(tool.url) ? (
                                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors underline decoration-white/30 underline-offset-4">
                                                    {tool.name}
                                                </a>
                                            ) : (
                                                <span className="text-white/80">{tool.name}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        },
    },
    block: {
        h2: ({ children, value }) => {
            const text = (value?.children || []).map(c => c.text || '').join('');
            const id = slugify(text);
            return (
                <h2 id={id} className="text-[28px] font-sans font-extrabold text-text mt-14 mb-5 scroll-mt-32 tracking-tight leading-[34px]">
                    {children}
                </h2>
            );
        },
        h3: ({ children, value }) => {
            const text = (value?.children || []).map(c => c.text || '').join('');
            const id = slugify(text);
            return <h3 id={id} className="text-[22px] text-text mt-10 mb-4 font-sans font-bold scroll-mt-32 tracking-tight leading-[28px]">{children}</h3>;
        },
        h4: ({ children }) => <h4 className="text-xl text-text mt-8 mb-3 font-sans font-semibold">{children}</h4>,
        normal: ({ children }) => <p className="text-lg leading-[30px] text-text mb-6 font-sans">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-[3px] border-accent pl-6 my-10 font-cormorant italic text-2xl lg:text-[28px] text-text leading-[1.4]">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-lg leading-[30px] text-text space-y-2 marker:text-accent/40 font-sans">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-lg leading-[30px] text-text space-y-2 marker:text-accent/60 font-sans">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li className="font-sans text-textMuted">{children}</li>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-text">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="bg-surfaceAlt text-accent px-2 py-1 rounded text-[0.85em] font-mono border border-accent-border">{children}</code>,
        s: ({ children }) => <del className="text-textMuted line-through">{children}</del>,
        link: ({ value, children }) => {
            const href = value?.href || '#';
            const isUnsafe = /^(javascript|data|vbscript):/i.test(href);
            if (isUnsafe) return <span>{children}</span>;

            const target = value?.blank ? '_blank' : undefined;
            const rel = value?.blank ? 'noopener noreferrer' : undefined;

            if (href.startsWith('/')) {
                return <Link to={href} className="text-accent underline decoration-accent/30 hover:decoration-accent underline-offset-4 transition-[text-decoration-color] duration-sm ease-out-smooth">{children}</Link>;
            }
            return (
                <a href={href} target={target} rel={rel} className="text-accent underline decoration-accent/30 hover:decoration-accent underline-offset-4 transition-[text-decoration-color] duration-sm ease-out-smooth">
                    {children}
                </a>
            );
        },
    },
};
