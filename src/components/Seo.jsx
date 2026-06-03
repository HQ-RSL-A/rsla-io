import { useEffect } from 'react';
import { globalSchemas } from '@/lib/structuredData.mjs';

function setOrCreateMeta(attr, attrValue, content) {
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setOrCreateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function removeMeta(attr, attrValue) {
    const el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (el) el.remove();
}

export default function Seo({ title, description, canonical, noIndex, ogImage, ogType, jsonLd, keywords }) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (description) {
            setOrCreateMeta('name', 'description', description);
        }

        if (keywords) {
            setOrCreateMeta('name', 'keywords', keywords);
        } else {
            removeMeta('name', 'keywords');
        }

        if (title) {
            setOrCreateMeta('property', 'og:title', title);
        }
        if (description) {
            setOrCreateMeta('property', 'og:description', description);
        }
        if (canonical) {
            setOrCreateMeta('property', 'og:url', canonical);
        }
        setOrCreateMeta('property', 'og:type', ogType || 'website');
        const resolvedOgImage = ogImage || 'https://rsla.io/og-image.png';
        setOrCreateMeta('property', 'og:image', resolvedOgImage);
        setOrCreateMeta('property', 'og:locale', 'en_US');
        setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
        setOrCreateMeta('name', 'twitter:site', '@rahul_lalia');
        setOrCreateMeta('name', 'twitter:image', resolvedOgImage);

        if (title) {
            setOrCreateMeta('name', 'twitter:title', title);
        }
        if (description) {
            setOrCreateMeta('name', 'twitter:description', description);
        }

        if (canonical) {
            setOrCreateLink('canonical', canonical);
        }

        if (noIndex) {
            setOrCreateMeta('name', 'robots', 'noindex, follow');
        } else {
            removeMeta('name', 'robots');
        }

        // Always emit the global entity graph (Organization + WebSite) so the hydrated
        // DOM matches the prerendered HTML. Indexed pages get the globals; noIndex pages
        // get none, mirroring scripts/prerender.mjs inject().
        const pageSchemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
        const globalNodes = noIndex ? [] : globalSchemas;
        const schemas = [...globalNodes, ...pageSchemas];
        document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());
        schemas.forEach((schema) => {
            const script = document.createElement('script');
            script.setAttribute('data-seo-jsonld', '');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c');
            document.head.appendChild(script);
        });

        return () => {
            removeMeta('name', 'description');
            removeMeta('name', 'keywords');
            removeMeta('name', 'robots');
            removeMeta('property', 'og:title');
            removeMeta('property', 'og:description');
            removeMeta('property', 'og:url');
            removeMeta('property', 'og:type');
            removeMeta('property', 'og:image');
            removeMeta('property', 'og:locale');
            removeMeta('name', 'twitter:card');
            removeMeta('name', 'twitter:title');
            removeMeta('name', 'twitter:description');
            removeMeta('name', 'twitter:image');
            const canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) canonicalEl.remove();
            document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());
        };
    }, [title, description, canonical, noIndex, ogImage, ogType, jsonLd, keywords]);

    return null;
}
