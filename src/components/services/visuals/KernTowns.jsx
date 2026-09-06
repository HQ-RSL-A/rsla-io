import { KERN_TOWNS } from '@/data/serviceConstants.mjs';

export default function KernTowns() {
    return (
        <div className="rounded-callout border border-hairline bg-surface p-5 md:p-6">
            <p className="font-sans font-bold text-base text-text mb-3">Where we work in Kern County</p>
            <ul className="flex flex-wrap gap-2" aria-label="Service areas">
                {KERN_TOWNS.map((t, i) => (
                    <li key={t} className={`rounded-full px-3 py-1.5 font-sans text-sm font-medium ${i === 0 ? 'bg-accent text-white' : 'bg-surfaceAlt text-text'}`}>{t}</li>
                ))}
            </ul>
            <p className="mt-4 font-sans text-sm text-text leading-relaxed">Home base first. In the smaller towns almost nobody local is competing for your customers' searches yet.</p>
        </div>
    );
}
