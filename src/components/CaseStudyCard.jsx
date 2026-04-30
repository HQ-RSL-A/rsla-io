import { Link } from 'react-router-dom';
import { urlForImage } from '@/sanity/lib/image';

/**
 * Shared case-study card used on /work (with image) and inside
 * WorkInner related-cases section (text-only).
 *
 * Props:
 *   data       - Sanity case-study document (or plain object with slug, tag, title, etc.)
 *   showImage  - whether to render the featured image (default true)
 */
export default function CaseStudyCard({ data, showImage = true }) {
    const imageUrl =
        showImage && data.featuredImage?.asset
            ? urlForImage(data.featuredImage.asset)?.width(960).height(600).url()
            : null;

    return (
        <Link
            to={`/work/${data.slug}`}
            className="work-card opacity-0 group flex flex-col h-full bg-surfaceAlt rounded-2xl border border-accent-border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-md ease-out-smooth"
        >
            {imageUrl && (
                <div className="relative aspect-[16/10] overflow-hidden bg-surface border-b border-accent-border">
                    <img
                        src={imageUrl}
                        alt={data.featuredImage?.alt || data.title}
                        className="w-full h-full object-cover transition-transform duration-image-zoom ease-out-smooth group-hover:scale-[1.03]"
                        loading="lazy"
                        width="800"
                        height="500"
                    />
                    {data.featured && (
                        <span className="absolute top-4 right-4 font-sans text-sm uppercase tracking-wider text-white bg-accent px-2 py-1 rounded-sm shadow-md">
                            Featured
                        </span>
                    )}
                </div>
            )}
            <div className="p-8 flex flex-col flex-grow">
                <div className="mb-6 flex justify-between items-start">
                    <span className="font-sans text-sm uppercase tracking-wider text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-sm">
                        {data.tag}
                    </span>
                    {data.featured && !imageUrl && (
                        <span className="font-sans text-sm uppercase tracking-wider text-white bg-accent px-2 py-1 rounded-sm">
                            Featured
                        </span>
                    )}
                </div>
                <h3 className="font-sans font-semibold text-xl md:text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors">
                    {data.title}
                </h3>
                <p className="font-sans text-sm text-textMuted mb-8 flex-grow leading-relaxed">
                    {data.description}
                </p>

                {data.metrics && data.metrics.length > 0 && (
                    <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-accent-border">
                        {data.metrics.slice(0, 2).map((metric, idx) => (
                            <div key={idx}>
                                <strong className="block text-xl font-bold font-sans text-text">{metric.value}</strong>
                                <span className="font-sans text-sm uppercase tracking-wider text-accent">{metric.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}
