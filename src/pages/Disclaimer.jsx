import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Disclaimer() {
    return (
        <main className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Disclaimer | RSL/A"
                description="RSL/A disclaimer regarding website content, services, results, and professional advice."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 min-h-[44px] text-textMuted hover:text-accent font-sans text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-10 tracking-tight text-text">
                    Disclaimer
                </h1>

                <div className="prose-container max-w-none font-sans text-lg leading-relaxed text-textMuted">
                    <p className="mb-8">
                        <strong className="text-text">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-12">
                        This Disclaimer applies to the website at rsla.io (the "Site"), all content published on it, and any services provided by <strong className="text-accent">RSL/A</strong> ("Company," "we," "us," or "our"). Please read this Disclaimer carefully before using the Site or engaging our services.
                    </p>

                    {/* ── 1. GENERAL INFORMATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">1. General Information Only</h2>
                    <p className="mb-8">
                        The content on this Site, including blog posts, case studies, guides, videos, and social media content, is provided for general informational and educational purposes only. Nothing on this Site constitutes professional advice, whether legal, financial, tax, medical, or otherwise. You should consult with a qualified professional before making any decisions based on information found on this Site.
                    </p>

                    {/* ── 2. NO GUARANTEES OF RESULTS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">2. No Guarantees of Results</h2>
                    <div className="mb-8 space-y-4">
                        <p className="font-semibold">
                            We do not guarantee any specific results, outcomes, or return on investment from our services or from applying the information shared on this Site.
                        </p>
                        <p>
                            Any results, metrics, revenue figures, growth percentages, or performance data referenced in our blog posts, case studies, testimonials, social media, or marketing materials are specific to those particular clients and circumstances. They are not typical results and should not be interpreted as a promise, projection, or guarantee of what you will achieve.
                        </p>
                    </div>
                    <p className="mb-4">Results from marketing, SEO, paid advertising, automation, and AI services depend on many factors outside our control, including but not limited to:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Your industry, market conditions, and competitive landscape</li>
                        <li>Your existing brand authority, reputation, and audience</li>
                        <li>The quality and timeliness of content, materials, and access you provide</li>
                        <li>Platform algorithm changes (Google, Meta, TikTok, etc.)</li>
                        <li>Your own business operations, pricing, sales process, and customer experience</li>
                        <li>Economic conditions, seasonality, and external events</li>
                        <li>Your budget and the duration of the engagement</li>
                    </ul>

                    {/* ── 3. CASE STUDIES AND TESTIMONIALS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">3. Case Studies and Testimonials</h2>
                    <p className="mb-4">
                        Case studies, testimonials, and client success stories featured on this Site represent the experiences of specific clients. They are shared in good faith and reflect real results, but:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>They are not guarantees of future performance for any client.</li>
                        <li>Individual results will vary based on the factors listed above.</li>
                        <li>Some case studies may include approximated or rounded figures.</li>
                        <li>Testimonials reflect the personal opinions and experiences of the individuals quoted and may not represent the experience of all clients.</li>
                        <li>We may have received compensation from the individuals or businesses featured, as they were paying clients at the time of the engagement.</li>
                    </ul>

                    {/* ── 4. BLOG AND EDUCATIONAL CONTENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">4. Blog and Educational Content</h2>
                    <p className="mb-4">
                        Our blog posts, guides, tutorials, and educational content are written to share knowledge and perspective on marketing, AI, automation, and business growth. However:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Content may become outdated as tools, platforms, and best practices evolve. We make reasonable efforts to keep content current but do not guarantee accuracy at all times.</li>
                        <li>Strategies and tactics that worked for one business may not work for another. Context matters.</li>
                        <li>Mention of specific tools, platforms, or services does not constitute an endorsement or guarantee of their performance, pricing, or availability.</li>
                        <li>We are not responsible for any actions you take based on our content or any outcomes that result from those actions.</li>
                    </ul>

                    {/* ── 5. AI-GENERATED CONTENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">5. AI-Generated Content</h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            Some content on this Site and in our deliverables may be created or assisted by artificial intelligence tools, including but not limited to Anthropic (Claude) and OpenAI (ChatGPT).
                        </p>
                        <p>
                            AI-generated content is reviewed by our team before publication, but we do not guarantee that it is free from errors, inaccuracies, or omissions. AI tools may produce content that is factually incorrect, incomplete, or biased.
                        </p>
                        <p>
                            You should independently verify any critical information, data, statistics, or claims before relying on them for business decisions.
                        </p>
                    </div>

                    {/* ── 6. THIRD-PARTY LINKS AND TOOLS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">6. Third-Party Links, Tools, and References</h2>
                    <p className="mb-8">
                        This Site may contain links to third-party websites, tools, platforms, and services. These links are provided for convenience and informational purposes only. We do not control, endorse, or assume responsibility for the content, privacy practices, accuracy, or availability of any third-party site or service. Visiting third-party links is at your own risk.
                    </p>

                    {/* ── 7. AFFILIATE AND REFERRAL DISCLOSURE ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">7. Affiliate and Referral Disclosure</h2>
                    <p className="mb-8">
                        Some links on this Site may be affiliate or referral links, meaning we may earn a commission or receive a benefit if you click through and make a purchase or sign up for a service. This does not affect the price you pay and does not influence our recommendations. We only recommend tools and services we genuinely use or believe in. When applicable, affiliate relationships will be disclosed in context.
                    </p>

                    {/* ── 8. PROFESSIONAL ADVICE ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">8. Not Professional Advice</h2>
                    <p className="mb-4">
                        Nothing on this Site or in our communications should be construed as:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Legal advice.</strong> We are not attorneys. Consult a licensed attorney for legal questions.</li>
                        <li><strong className="text-text">Financial or investment advice.</strong> We are not financial advisors. Consult a licensed financial professional for financial decisions.</li>
                        <li><strong className="text-text">Tax advice.</strong> We are not tax professionals. Consult a qualified accountant or tax advisor.</li>
                        <li><strong className="text-text">Medical or health advice.</strong> We are not healthcare providers.</li>
                    </ul>
                    <p className="mb-8">
                        We provide marketing, automation, and technology services. Any information shared outside those domains is general in nature and should not replace professional counsel.
                    </p>

                    {/* ── 9. ERRORS AND OMISSIONS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">9. Errors and Omissions</h2>
                    <p className="mb-8">
                        While we make reasonable efforts to ensure the information on this Site is accurate and up to date, we do not warrant or represent that the Site content is complete, correct, or current. The Site may contain typographical errors, technical inaccuracies, or outdated information. We reserve the right to make corrections and changes at any time without notice.
                    </p>

                    {/* ── 10. LIMITATION OF LIABILITY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">10. Limitation of Liability</h2>
                    <p className="mb-8">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, RSL/A SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM YOUR USE OF OR RELIANCE ON THE CONTENT OF THIS SITE, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </p>

                    {/* ── 11. CHANGES ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">11. Changes to This Disclaimer</h2>
                    <p className="mb-8">
                        We may update this Disclaimer from time to time. When we make changes, we will update the "Effective Date" at the top of this page. Your continued use of the Site after changes are posted constitutes your acceptance of the updated Disclaimer.
                    </p>

                    {/* ── 12. CONTACT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">12. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Disclaimer, contact us:
                    </p>
                    <p className="mb-8">
                        <strong className="text-text">RSL/A</strong> - General Inquiries:{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline">team@rsla.io</a>
                    </p>

                    <p className="mt-16 pt-6 text-sm text-textMuted">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
