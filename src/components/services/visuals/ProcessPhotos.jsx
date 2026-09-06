/**
 * The four real process photos from public/images/process, next to the
 * numbered steps on every page that has a "How it runs" section.
 */
const photos = [
    { src: '/images/process/onboarding.jpg', alt: 'First call: a notebook and laptop on a desk during a client kickoff', label: 'Call' },
    { src: '/images/process/design.jpg', alt: 'Design: website layouts being sketched and reviewed on screen', label: 'Design' },
    { src: '/images/process/build.jpg', alt: 'Build: code for a client website open in an editor', label: 'Build' },
    { src: '/images/process/launch.jpg', alt: 'Launch: the finished website open on a phone and a laptop', label: 'Launch' },
];

export default function ProcessPhotos() {
    return (
        <ul className="grid grid-cols-2 gap-3" aria-label="The four stages of a project">
            {photos.map((p) => (
                <li key={p.src} className="relative rounded-callout overflow-hidden border border-hairline bg-surfaceAlt">
                    <img src={p.src} alt={p.alt} width="600" height="450" loading="lazy" className="block w-full aspect-[4/3] object-cover" />
                    <span className="absolute left-3 bottom-3 rounded-md bg-surface/95 px-2 py-1 font-sans font-bold text-[12px] text-text">{p.label}</span>
                </li>
            ))}
        </ul>
    );
}
