import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Accessibility() {
    return (
        <main className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Accessibility Statement | RSL/A"
                description="RSL/A commitment to digital accessibility and WCAG compliance."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 min-h-[44px] text-textMuted hover:text-accent font-sans text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-10 tracking-tight text-text">
                    Accessibility Statement
                </h1>

                <div className="prose-container max-w-none font-sans text-lg leading-relaxed text-textMuted">
                    <p className="mb-8">
                        <strong className="text-text">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-12">
                        <strong className="text-accent">RSL/A</strong> is committed to making our website at rsla.io (the "Site") accessible to all users, including individuals with disabilities. We believe that everyone should be able to access the information and services we offer online.
                    </p>

                    {/* ── 1. OUR COMMITMENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">1. Our Commitment</h2>
                    <p className="mb-4">
                        We are committed to providing a website that is accessible to the widest possible audience. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as published by the World Wide Web Consortium (W3C).
                    </p>
                    <p className="mb-8">
                        These guidelines provide a framework for making web content more accessible to people with a range of disabilities, including visual, auditory, motor, and cognitive impairments.
                    </p>

                    {/* ── 2. MEASURES TAKEN ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">2. Accessibility Measures</h2>
                    <p className="mb-4">We take the following measures to support accessibility on our Site:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Semantic HTML:</strong> We use proper heading structures, landmarks, and semantic elements to support screen readers and assistive technologies.</li>
                        <li><strong className="text-text">Keyboard Navigation:</strong> Core navigation and interactive elements are designed to be operable via keyboard.</li>
                        <li><strong className="text-text">Color Contrast:</strong> We aim to maintain sufficient color contrast ratios between text and background colors to meet WCAG AA standards.</li>
                        <li><strong className="text-text">Alt Text:</strong> We provide descriptive alternative text for meaningful images.</li>
                        <li><strong className="text-text">Responsive Design:</strong> Our Site is designed to work across a range of devices and screen sizes, and supports browser zoom up to 200%.</li>
                        <li><strong className="text-text">Focus Indicators:</strong> We maintain visible focus indicators for keyboard users navigating interactive elements.</li>
                        <li><strong className="text-text">Link Purpose:</strong> We aim to ensure that the purpose of each link can be determined from the link text or its surrounding context.</li>
                    </ul>

                    {/* ── 3. KNOWN LIMITATIONS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">3. Known Limitations</h2>
                    <p className="mb-4">
                        Despite our best efforts, some areas of the Site may not yet be fully accessible. Known limitations include:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Third-Party Embeds:</strong> Some embedded content from third-party services (such as booking widgets, video players, or analytics tools) may not be fully accessible. We do not control the accessibility of third-party content but choose providers that demonstrate commitment to accessibility where possible.</li>
                        <li><strong className="text-text">PDF Documents:</strong> Some downloadable documents may not be fully optimized for screen readers. We are working to improve document accessibility over time.</li>
                        <li><strong className="text-text">Animations:</strong> Some scroll-triggered animations on the Site may present challenges for users with motion sensitivities. We respect the prefers-reduced-motion media query where technically feasible.</li>
                        <li><strong className="text-text">Older Content:</strong> Some blog posts or case studies published before this statement may not fully meet our current accessibility standards. We are progressively reviewing and updating older content.</li>
                    </ul>

                    {/* ── 4. THIRD-PARTY CONTENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">4. Third-Party Content</h2>
                    <p className="mb-8">
                        Our Site may include content, tools, or widgets provided by third parties that are not under our control. While we select third-party tools with accessibility in mind, we cannot guarantee that all third-party content meets WCAG 2.1 AA standards. If you encounter accessibility issues with third-party content on our Site, we encourage you to contact the third-party provider directly and to let us know so we can evaluate alternatives.
                    </p>

                    {/* ── 5. FEEDBACK ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">5. Feedback and Contact</h2>
                    <p className="mb-4">
                        We welcome your feedback on the accessibility of our Site. If you encounter any accessibility barriers, have difficulty accessing any content, or have suggestions for improvement, please contact us:
                    </p>
                    <p className="mb-8">
                        <strong className="text-text">RSL/A</strong> - Accessibility Feedback:{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline">team@rsla.io</a>
                    </p>
                    <p className="mb-8">
                        When contacting us about an accessibility issue, please include the URL of the page, a description of the problem, and the assistive technology you are using (if applicable). We will make reasonable efforts to respond within 5 business days and to address the issue.
                    </p>

                    {/* ── 6. CONTINUOUS IMPROVEMENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">6. Continuous Improvement</h2>
                    <p className="mb-8">
                        Accessibility is an ongoing effort. We are committed to regularly reviewing our Site, addressing known issues, and improving the experience for all users. As web technologies and accessibility standards evolve, we will update our practices accordingly.
                    </p>

                    {/* ── 7. LEGAL ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">7. Conformance Status</h2>
                    <p className="mb-8">
                        We aim to conform to WCAG 2.1 Level AA. This statement was prepared based on a self-assessment of the Site. We plan to conduct periodic reviews and, when appropriate, engage third-party accessibility auditors to evaluate conformance.
                    </p>

                    <p className="mt-16 pt-6 text-sm text-textMuted">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
