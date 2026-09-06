import RankGrid from '@/components/services/visuals/RankGrid';
import SerpMock from '@/components/services/visuals/SerpMock';
import PipelineBoard from '@/components/services/visuals/PipelineBoard';
import PhoneFlow from '@/components/services/visuals/PhoneFlow';
import FlowDiagram from '@/components/services/visuals/FlowDiagram';
import BeforeAfter from '@/components/services/visuals/BeforeAfter';
import PortfolioStrip from '@/components/services/visuals/PortfolioStrip';
import ProcessPhotos from '@/components/services/visuals/ProcessPhotos';
import ToolRow from '@/components/services/visuals/ToolRow';
import AiRow from '@/components/services/visuals/AiRow';
import FactorBars from '@/components/services/visuals/FactorBars';
import TemplateDiagram from '@/components/services/visuals/TemplateDiagram';
import DashboardMock from '@/components/services/visuals/DashboardMock';
import LocalCard from '@/components/services/visuals/LocalCard';
import KernTowns from '@/components/services/visuals/KernTowns';

/**
 * Which visual sits where, per route. `hero` renders beside the H1.
 * `sections` keys are the first words of an H2 in the copy file; the visual
 * renders beside that section. Copy never changes here, only placement.
 */
export const visuals = {
    '/services/websites': {
        hero: <PortfolioStrip />,
        sections: {
            'Websites that get found': <AiRow />,
            'How a project runs': <ProcessPhotos />,
        },
    },
    '/services/websites/redesign': {
        hero: <BeforeAfter />,
        sections: {
            'What a redesign must not break': <FlowDiagram preset="redirect" />,
            'How a redesign runs': <ProcessPhotos />,
        },
    },
    '/services/seo': {
        hero: <SerpMock query="plumber in your city" city="your city" />,
        sections: {
            'Where the weekly article goes': <FlowDiagram preset="content" />,
            'What the numbers look like': <AiRow heading="Cited by" />,
        },
    },
    '/services/seo/local': {
        hero: <SerpMock query="electrician near me" city="your city" aiLine={false} />,
        sections: {
            'What actually ranks a Google Business Profile': <FactorBars />,
            'How you will see progress': <RankGrid />,
        },
    },
    '/services/seo/programmatic': {
        hero: <TemplateDiagram />,
    },
    '/services/automations': {
        hero: <PhoneFlow variant="missed-call" />,
        sections: {
            'What we automate most often': <FlowDiagram preset="lead" />,
            'How we build it': <ToolRow tools={['n8n', 'make', 'gohighlevel', 'notion', 'twilio', 'stripe', 'slack']} caption="Built around the tools you already pay for." />,
        },
    },
    '/services/crm': {
        hero: <PipelineBoard />,
        sections: {
            'Built for the phone': <PhoneFlow variant="voice-note" />,
            'Moving from spreadsheets': <ToolRow tools={['gohighlevel', 'twilio', 'stripe', 'zapier', 'make', 'airtable']} caption="GoHighLevel at the center, connected to what you already use." />,
        },
    },
    '/services/custom-builds': {
        hero: <DashboardMock />,
        sections: {
            'How we build': <ToolRow tools={['supabase', 'vercel', 'github', 'resend', 'sanity']} caption="Runs on accounts in your name." />,
        },
    },
    '/bakersfield': {
        hero: <LocalCard />,
        sections: {
            'Where we work': <KernTowns />,
            'What working with us looks like': <ProcessPhotos />,
        },
    },
    '/bakersfield/websites': {
        hero: <PortfolioStrip />,
        sections: {
            'Who we build websites for': <LocalCard note="Southwest Bakersfield, in person across Kern County." />,
            'How we are different': <AiRow />,
            'How it runs': <ProcessPhotos />,
        },
    },
    '/bakersfield/seo': {
        hero: <RankGrid />,
        sections: {
            'What search looks like in Bakersfield': <SerpMock query="plumber bakersfield" city="Bakersfield" />,
            'We ran this on ourselves first': <LocalCard note="The same scan, run on our own profile, every time we run it for you." />,
        },
    },
    '/bakersfield/automations': {
        hero: <PhoneFlow variant="missed-call" />,
        sections: {
            'What we build for local businesses': <FlowDiagram preset="lead" />,
            'Why hire a local automation agency': <LocalCard note="Home based in southwest Bakersfield. First setup is done with you, in person." />,
        },
    },
    '/bakersfield/crm': {
        hero: <PipelineBoard />,
        sections: {
            'From a voice note to a new lead': <PhoneFlow variant="voice-note" />,
            'Built for the owner': <LocalCard note="Set up in the room with you, on your own phone." />,
        },
    },
};

export function visualFor(route, heading) {
    const v = visuals[route];
    if (!v || !v.sections || !heading) return null;
    const key = Object.keys(v.sections).find(k => heading.startsWith(k));
    return key ? v.sections[key] : null;
}
