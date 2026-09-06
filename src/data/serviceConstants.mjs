/**
 * Shared facts for the service pages. Imported by the React visuals,
 * MoneyPage, FooterV2, and scripts/prerender.mjs so the static HTML and the
 * hydrated DOM never drift.
 */

/** NAP as published on the Google Business Profile (rsla/local-seo/nap-canonical.md). */
export const PHONE_DISPLAY = '(661) 466-5919';
export const PHONE_TEL = 'tel:+16614665919';
export const MAPS_URL = 'https://www.google.com/maps/place/?q=place_id:ChIJkyh5elCY4yIRH-OW8tzVXBQ';

/** Service areas exactly as they appear on the profile. Keep in sync with nap-canonical.md. */
export const KERN_TOWNS = ['Bakersfield', 'Oildale', 'Shafter', 'Wasco', 'Delano', 'McFarland', 'Arvin', 'Lamont', 'Taft', 'Tehachapi', 'Lake Isabella'];

/** Real sites from public/images/portfolio. Order and alt text are fixed so prerender matches. */
export const portfolio = [
    { src: '/images/portfolio/fieldshare-after.jpg', alt: 'Fieldshare website homepage, a field management platform for oil and gas' },
    { src: '/images/portfolio/caplanCommunications.jpg', alt: 'Caplan Communications website homepage, a public relations agency' },
    { src: '/images/portfolio/owlOutreach.jpg', alt: 'Owl Outreach website homepage' },
    { src: '/images/portfolio/freedomDrivers.jpg', alt: 'Freedom Drivers website homepage' },
];
