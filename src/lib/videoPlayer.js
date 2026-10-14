// Which host a video link points to, and the player address to load once the visitor presses play.
// YouTube plays from its no-cookie domain, Vimeo and Wistia with their tracking switched off.
const PROVIDERS = [
    {
        name: 'YouTube',
        test: /youtube\.com|youtu\.be/,
        id: /(?:youtu\.be\/|\/embed\/|\/shorts\/|[?&]v=)([\w-]+)/,
        src: (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
    },
    {
        name: 'Vimeo',
        test: /vimeo\.com/,
        id: /vimeo\.com\/(?:.*\/)?(\d+)/,
        src: (id) => `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
    },
    {
        name: 'Loom',
        test: /loom\.com/,
        id: /loom\.com\/(?:share|embed)\/([\w-]+)/,
        src: (id) => `https://www.loom.com/embed/${id}?autoplay=1`,
    },
    {
        name: 'Wistia',
        test: /wistia\.(?:com|net)/,
        id: /(?:\/medias\/|\/embed\/iframe\/)([\w-]+)/,
        src: (id) => `https://fast.wistia.net/embed/iframe/${id}?autoPlay=true&doNotTrack=true`,
    },
];

export function videoPlayer(url) {
    if (!url) return null;
    const provider = PROVIDERS.find((p) => p.test.test(url));
    const match = provider && url.match(provider.id);
    return match ? { provider: provider.name, src: provider.src(match[1]) } : null;
}
