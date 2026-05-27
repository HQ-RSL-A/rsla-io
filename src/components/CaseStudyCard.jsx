import { Link } from 'react-router-dom';
import { urlForImage } from '@/sanity/lib/image';

const TEXT_SIZES = {
    small: 'text-[18px] leading-[24px]',
    medium: 'text-[22px] leading-[28px]',
    large: 'text-[26px] leading-[34px]',
    xl: 'text-[32px] leading-[40px]',
};

function getGradientCss(color, opacity, direction) {
    const hex = color || '#000000';
    const alpha = Math.round(((opacity ?? 50) / 100) * 255).toString(16).padStart(2, '0');
    const solid = `${hex}${alpha}`;
    const transparent = `${hex}00`;

    if (!direction || direction === 'none') {
        return { backgroundColor: solid };
    }

    const dirs = { 'to-b': 'to bottom', 'to-t': 'to top', 'to-r': 'to right', 'to-l': 'to left' };
    const cssDir = dirs[direction] || 'to bottom';
    return { backgroundImage: `linear-gradient(${cssDir}, ${transparent} 0%, ${solid} 100%)` };
}

export default function CaseStudyCard({ data }) {
    const bgImage = data.thumbnailBackground?.asset
        ? urlForImage(data.thumbnailBackground.asset)?.width(1200).height(700).url()
        : null;

    const logoUrl = data.thumbnailLogo?.asset
        ? urlForImage(data.thumbnailLogo.asset)?.height(40).url()
        : null;

    const displayText = data.thumbnailText || data.title;
    const textColor = data.thumbnailTextColor || '#FFFFFF';
    const textSizeClass = TEXT_SIZES[data.thumbnailTextSize] || TEXT_SIZES.large;
    const overlayStyle = getGradientCss(
        data.thumbnailOverlayColor,
        data.thumbnailOverlayOpacity,
        data.thumbnailGradientDirection
    );

    return (
        <Link
            to={`/work/${data.slug}`}
            className="work-card opacity-0 group relative block aspect-[16/9] rounded-lg overflow-hidden"
        >
            {/* Background image */}
            {bgImage && (
                <img
                    src={bgImage}
                    alt={data.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    width="1200"
                    height="700"
                />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 transition-opacity duration-300" style={overlayStyle} />

            {/* Hover gradient expansion */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundImage: `linear-gradient(to bottom, transparent 30%, ${data.thumbnailOverlayColor || '#000000'}cc 100%)` }}
            />

            {/* Client logo - top left */}
            {logoUrl && (
                <img
                    src={logoUrl}
                    alt={`${data.clientName || ''} logo`}
                    className="absolute top-5 left-5 h-8 w-auto object-contain z-10"
                    loading="lazy"
                />
            )}

            {/* Text - bottom left */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3
                    className={`font-sans font-semibold ${textSizeClass} mb-0 group-hover:mb-8 transition-[margin] duration-300`}
                    style={{ color: textColor }}
                >
                    {displayText}
                </h3>

                {/* Read story - appears on hover */}
                <span
                    className="inline-flex items-center gap-1.5 font-sans text-[15px] font-medium absolute bottom-5 left-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    style={{ color: textColor }}
                >
                    Read more <span className="text-lg">→</span>
                </span>
            </div>
        </Link>
    );
}
