import { Globe, RefreshCw, Search, MapPin, LayoutGrid, Zap, Smartphone, Wrench } from 'lucide-react';
import SerpMock from '@/components/services/visuals/SerpMock';
import RankGrid from '@/components/services/visuals/RankGrid';
import TemplateDiagram from '@/components/services/visuals/TemplateDiagram';
import PhoneFlow from '@/components/services/visuals/PhoneFlow';
import DashboardMock from '@/components/services/visuals/DashboardMock';

/**
 * One entry per service page: what the service card shows when a page is
 * linked from the services index, the Bakersfield hub, or the "more of what
 * we build" row. Descriptions are one sentence, outcome first.
 */
export const catalog = {
    '/services/automations': {
        title: 'AI automations', chip: 'Automation', icon: Zap,
        description: 'Missed calls texted back, follow up that runs itself, intake that fills your CRM while you are on the job.',
        media: <PhoneFlow variant="missed-call" />,
    },
    '/services/crm': {
        title: 'CRM systems', chip: 'CRM', icon: Smartphone,
        description: 'GoHighLevel set up around how you sell, phone first, with every lead, quote, and customer in one place.',
        media: <PhoneFlow variant="voice-note" />,
    },
    '/services/seo': {
        title: 'SEO', chip: 'Search', icon: Search,
        description: 'Money pages, one article a week, and the structure that gets you cited by Google and ChatGPT.',
        media: <SerpMock query="plumber in your city" city="your city" />,
    },
    '/services/seo/local': {
        title: 'Local SEO', chip: 'Search', icon: MapPin,
        description: 'Google Maps, reviews, and a page per service in your city, tracked on a 49 point grid every week.',
        media: <RankGrid />,
    },
    '/services/seo/programmatic': {
        title: 'Programmatic SEO', chip: 'Search', icon: LayoutGrid,
        description: 'Hundreds of useful pages from one template and your own data, published in batches Google can index.',
        media: <TemplateDiagram />,
    },
    '/services/websites': {
        title: 'Websites', chip: 'Websites', icon: Globe,
        description: 'New builds and rebuilds that say what you do in one screen, with the search structure built in.',
        media: { src: '/images/portfolio/fieldshare-after.jpg', alt: 'Fieldshare website homepage, built by RSL/A' },
    },
    '/services/websites/redesign': {
        title: 'Website redesign', chip: 'Websites', icon: RefreshCw,
        description: 'A rebuild that keeps every ranking and inbound link the old site earned.',
        media: { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website homepage, rebuilt by RSL/A' },
    },
    '/services/custom-builds': {
        title: 'Custom builds', chip: 'Custom', icon: Wrench,
        description: 'The internal tool nobody sells, built in weeks, running on accounts in your name.',
        media: <DashboardMock />,
    },
    '/bakersfield': {
        title: 'Bakersfield, CA', chip: 'Kern County', icon: MapPin,
        description: 'Websites, search, automation, and CRM for Kern County businesses, set up in person.',
        media: { src: '/images/rahul.webp', alt: 'Rahul Lalia, founder of RSL/A, based in southwest Bakersfield' },
    },
    '/bakersfield/websites': {
        title: 'Web design in Bakersfield', chip: 'Websites', icon: Globe,
        description: 'A site that says what you do, where, and how to reach you before they scroll. Built here, priced up front.',
        media: { src: '/images/portfolio/owlOutreach.jpg', alt: 'Owl Outreach website homepage, built by RSL/A' },
    },
    '/bakersfield/seo': {
        title: 'SEO in Bakersfield', chip: 'Search', icon: Search,
        description: 'Into the map pack and the results under it, with the 49 point grid shared with you every week.',
        media: <RankGrid />,
    },
    '/bakersfield/automations': {
        title: 'AI automation in Bakersfield', chip: 'Automation', icon: Zap,
        description: 'The missed call that texts itself back and the follow up that runs while you are on a job.',
        media: <PhoneFlow variant="missed-call" />,
    },
    '/bakersfield/crm': {
        title: 'CRM setup in Bakersfield', chip: 'CRM', icon: Smartphone,
        description: 'Every lead, quote, and customer in one app you can run from the truck, set up with you in the room.',
        media: <PhoneFlow variant="voice-note" />,
    },
};

export const NATIONAL = ['/services/automations', '/services/crm', '/services/seo', '/services/websites', '/services/custom-builds'];
export const LOCAL = ['/bakersfield/websites', '/bakersfield/seo', '/bakersfield/automations', '/bakersfield/crm'];

/** Cards for the "more of what we build" row on a page: three siblings. */
export function relatedTo(route) {
    if (route === '/bakersfield') return { heading: null, routes: [] };
    if (route.startsWith('/bakersfield/')) {
        return { heading: 'The rest of what we do in Bakersfield', routes: LOCAL.filter((r) => r !== route) };
    }
    const parent = NATIONAL.find((r) => route === r || route.startsWith(`${r}/`));
    const others = NATIONAL.filter((r) => r !== parent);
    const routes = route === parent ? others.slice(0, 3) : [parent, ...others.slice(0, 2)];
    return { heading: 'More of what we build', routes };
}

export function cardFor(route, overrides = {}) {
    const c = catalog[route];
    if (!c) return null;
    return { to: route, ...c, ...overrides };
}
