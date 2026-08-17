import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { client } from '@/sanity/lib/client';
import { leadMagnetBySlugQuery } from '@/sanity/lib/queries';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;

export default function LeadMagnet() {
  const { slug } = useParams();
  const [magnet, setMagnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    client.fetch(leadMagnetBySlugQuery, { slug }).then((data) => {
      if (!isMounted) return;
      if (!data) {
        setNotFound(true);
      } else {
        setMagnet(data);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setNotFound(true);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const body = {
        email,
        formId: KIT_FORM_ID,
        firstName: firstName || undefined,
      };
      if (magnet.kitTagId) {
        body.tags = [magnet.kitTagId];
      }

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Subscription failed');
      window.dataLayer?.push({ event: 'newsletter_subscribe', source: 'lead_magnet', slug });

      // Redirect to the resource — only allow absolute https:// URLs or
      // same-origin absolute paths (starting with a single slash).
      // Explicitly rejects:
      //   javascript:/data:/vbscript: — unsafe schemes
      //   http://       — insecure
      //   //evil.com/…  — protocol-relative (inherits protocol, escapes to any origin)
      //   relative      — ambiguous
      const url = (magnet.resourceUrl || '').trim();
      const isHttps = /^https:\/\//i.test(url);
      const isSameOriginPath = url.startsWith('/') && !url.startsWith('//');
      if (!isHttps && !isSameOriginPath) {
        throw new Error('Invalid resource URL');
      }
      window.location.href = url;
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <Seo title="Not Found | RSL/A" description="This resource could not be found." noIndex />
        <h1 className="font-sans font-bold text-3xl md:text-5xl text-text mb-4">Resource not found</h1>
        <p className="font-sans text-text mb-6">This link may have expired or been removed.</p>
        <Link to="/" className="font-sans font-bold text-sm text-accent hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  const pageTitle = magnet.seoTitle || `${magnet.title} | RSL/A`;
  const pageDescription = magnet.seoDescription || magnet.description;

  return (
    <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center px-6 py-24">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonical={`https://rsla.io/r/${slug}`}
        noIndex
      />

      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="rgb(0, 112, 243)"
        maxOpacity={0.06}
        flickerChance={0.1}
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Title */}
        <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 leading-[1.1] text-text">
          {magnet.title}
        </h1>

        {/* Description */}
        <p className="font-sans text-text text-lg mb-8 max-w-md mx-auto">
          {magnet.description}
        </p>

        {/* Benefits */}
        {magnet.benefits?.length > 0 && (
          <div className="text-left max-w-sm mx-auto mb-10 space-y-3">
            {magnet.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <p className="font-sans text-sm text-text">{benefit}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto mb-4">
          <input
            type="text"
            required
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-surfaceAlt border border-hairline text-text font-sans text-base placeholder:text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors"
          />
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-surfaceAlt border border-hairline text-text font-sans text-base placeholder:text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-accent text-white px-6 py-3 font-sans font-medium text-base hover:bg-accentDeep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : magnet.ctaButtonText || 'Get instant access'}
          </button>
        </form>

        {error && (
          <p className="font-sans text-sm text-error mb-2">{error}</p>
        )}

        {/* Trust line */}
        <p className="font-sans text-sm text-text">
          No spam, unsubscribe anytime.{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-text transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
