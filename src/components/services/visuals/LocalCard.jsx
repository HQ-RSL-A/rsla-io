import { Phone, MapPin } from 'lucide-react';

import { PHONE_DISPLAY, PHONE_TEL, MAPS_URL } from '@/data/serviceConstants.mjs';

/**
 * The person behind the Bakersfield pages. Every competitor page in the local
 * results is faceless; this one is not. Photo is the real one from /images.
 */
export default function LocalCard({ note = 'Based in southwest Bakersfield. First call at your shop, on site, or over video.' }) {
    return (
        <div className="rounded-callout border border-hairline bg-surface p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4">
                <img src="/images/rahul.webp" alt="Rahul Lalia, founder of RSL/A" width="72" height="72" loading="lazy" className="w-[72px] h-[72px] rounded-full object-cover border border-hairline" />
                <div>
                    <p className="font-sans font-bold text-lg text-text leading-tight">Rahul Lalia</p>
                    <p className="font-sans text-sm text-text">Founder, RSL/A</p>
                </div>
            </div>
            <p className="mt-4 font-sans text-base text-text leading-relaxed">{note}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <a href={PHONE_TEL} className="inline-flex items-center gap-2 font-sans font-medium text-base text-accent hover:text-accentDeep transition-colors min-h-[44px]" onClick={() => window.dataLayer?.push({ event: 'phone_click', cta_location: 'local_card' })}>
                    <Phone size={16} strokeWidth={2} aria-hidden="true" />{PHONE_DISPLAY}
                </a>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans font-medium text-base text-accent hover:text-accentDeep transition-colors min-h-[44px]">
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />Google Maps listing
                </a>
            </div>
        </div>
    );
}
