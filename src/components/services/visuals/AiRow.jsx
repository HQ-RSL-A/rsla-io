/**
 * The AI assistants that cite Fieldshare's pages and our own. Logos from
 * public/images/ai. The claim lives in the copy; this only names them.
 */
const engines = [
    { src: '/images/ai/chatgpt.svg', name: 'ChatGPT' },
    { src: '/images/ai/gemini.svg', name: 'Gemini' },
    { src: '/images/ai/perplexity.svg', name: 'Perplexity' },
    { src: '/images/ai/claude.svg', name: 'Claude' },
];

export default function AiRow({ heading = 'Built to be cited by' }) {
    return (
        <div className="rounded-callout border border-hairline bg-surface p-5 md:p-6">
            <p className="font-sans font-bold text-base text-text mb-4">{heading}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="AI assistants">
                {engines.map((e) => (
                    <li key={e.name} className="flex items-center gap-2.5 rounded-lg bg-surfaceAlt px-3 py-2.5">
                        <img src={e.src} alt="" width="22" height="22" loading="lazy" className="w-[22px] h-[22px] object-contain" />
                        <span className="font-sans font-medium text-sm text-text">{e.name}</span>
                    </li>
                ))}
            </ul>
            <p className="mt-4 font-sans text-sm text-text leading-relaxed">Plus Google's AI Overviews and AI Mode, which read the same pages. Answer at the top, in plain text, and the assistants can quote you.</p>
        </div>
    );
}
