import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Terms() {
    return (
        <main className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Terms & Conditions | RSL/A"
                description="RSL/A terms and conditions for services and website usage."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 min-h-[44px] text-textMuted hover:text-accent font-sans text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-10 tracking-tight text-text">
                    Terms & Conditions
                </h1>

                <div className="prose-container max-w-none font-sans text-lg leading-relaxed text-textMuted">
                    <p className="mb-8">
                        <strong className="text-text">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-6">
                        These Terms and Conditions ("Terms") govern your access to and use of the website, services, and products provided by <strong className="text-accent">RSL/A</strong> ("Company," "we," "us," or "our"). By accessing or using our website at rsla.io (the "Site") or engaging our services, you agree to be bound by these Terms.
                    </p>

                    <p className="mb-12">
                        These Terms should be read together with our{' '}
                        <Link to="/privacy-policy" className="text-accent hover:underline decoration-accent/50 underline-offset-4">Privacy Policy</Link>,
                        which describes how we collect, use, and protect your personal information.
                    </p>

                    {/* ── 1. ACCEPTANCE OF TERMS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing or using the Site, submitting any inquiry, booking a call, subscribing to our newsletter, or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                    </p>
                    <p className="mb-8">
                        If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms. If you do not agree to these Terms, do not use the Site or engage our services.
                    </p>

                    {/* ── 2. DEFINITIONS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">2. Definitions</h2>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">"Services"</strong> means any professional services provided by RSL/A, including but not limited to marketing, automation, website development, CRM implementation, local SEO, paid advertising, AI automation, content creation, and consulting.</li>
                        <li><strong className="text-text">"Client"</strong> or <strong className="text-text">"you"</strong> means any individual or entity that accesses the Site, submits an inquiry, or engages our Services.</li>
                        <li><strong className="text-text">"Deliverables"</strong> means the final work product created specifically for you as part of an engagement, such as websites, marketing campaigns, automations, content, designs, or reports.</li>
                        <li><strong className="text-text">"Service Agreement"</strong> means any separate proposal, statement of work, contract, or written agreement that defines the scope, timeline, and pricing for a specific engagement.</li>
                        <li><strong className="text-text">"Content"</strong> means all text, images, graphics, videos, code, data, and other materials available on or through the Site.</li>
                    </ul>

                    {/* ── 3. SERVICES PROVIDED ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">3. Services Provided</h2>
                    <p className="mb-4">
                        RSL/A provides marketing, automation, website development, CRM implementation, local SEO, paid advertising, AI automation, content creation, and related professional services for businesses and founders.
                    </p>
                    <p className="mb-4">
                        The specific scope, timeline, deliverables, and pricing of Services will be outlined in a separate Service Agreement or proposal before work begins. In the event of any conflict between these Terms and a Service Agreement, the Service Agreement will govern with respect to that specific engagement.
                    </p>
                    <p className="mb-8">
                        We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time, with reasonable notice to active clients.
                    </p>

                    {/* ── 4. CLIENT RESPONSIBILITIES ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">4. Client Responsibilities</h2>
                    <p className="mb-4">To enable us to deliver Services effectively, you agree to:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Provide accurate, complete, and timely information, materials, and access required for us to perform the Services.</li>
                        <li>Respond to requests for feedback, approvals, or decisions within a reasonable timeframe. Delays in client response may affect project timelines and deliverables.</li>
                        <li>Ensure that any content, materials, or assets you provide to us do not infringe on the intellectual property rights, privacy rights, or other rights of any third party.</li>
                        <li>Maintain the confidentiality of any login credentials or access you share with us and notify us immediately of any unauthorized access.</li>
                        <li>Comply with all applicable laws and regulations in connection with your use of the Services and any content or campaigns we create on your behalf.</li>
                    </ul>

                    {/* ── 5. PAYMENT TERMS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">5. Payment Terms</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">5.1 Fees and Billing</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>All fees and pricing will be specified in the applicable Service Agreement or proposal.</li>
                        <li>Setup fees, one-time project fees, and deposits are due in full before work commences, unless otherwise agreed in writing.</li>
                        <li>Monthly retainers are billed in advance on the first of each billing cycle.</li>
                        <li>All prices are quoted in US Dollars (USD) unless otherwise specified.</li>
                        <li>Payments are processed securely through Stripe. By making a payment, you also agree to Stripe's terms of service.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">5.2 Late Payments</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Payments not received within 7 days of the due date are considered late.</li>
                        <li>Late payments will incur a late fee of 1.5% per month (18% per year) on the outstanding balance.</li>
                        <li>We reserve the right to suspend or pause all work and deliverables until outstanding balances are paid in full.</li>
                        <li>If payment remains outstanding for 30 or more days, we may terminate the engagement and pursue collection, including reasonable attorney's fees and collection costs.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">5.3 Taxes</h3>
                    <p className="mb-8">
                        All fees are exclusive of applicable taxes. You are responsible for paying any sales tax, use tax, VAT, GST, HST, or other taxes imposed by any jurisdiction in connection with the Services, except for taxes based on RSL/A's income.
                    </p>

                    {/* ── 6. NO REFUND POLICY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">6. No Refund Policy</h2>
                    <div className="mb-4 bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg">
                        <strong>ALL SALES ARE FINAL. RSL/A DOES NOT OFFER REFUNDS UNDER ANY CIRCUMSTANCES.</strong>
                    </div>
                    <ul className="list-disc pl-8 mb-4 space-y-3">
                        <li>No refunds will be issued for any Services, whether completed, in progress, or not yet started.</li>
                        <li>All payments are non-refundable, including setup fees, deposits, monthly retainers, and project fees.</li>
                        <li>Dissatisfaction with results does not entitle you to a refund. Marketing, SEO, and automation outcomes depend on many variables outside our control.</li>
                        <li>Cancellation of a Service Agreement does not entitle you to a refund of amounts already paid.</li>
                    </ul>
                    <p className="mb-8">
                        If you have concerns about the quality or progress of work, we encourage you to raise them with us directly. We are committed to delivering strong work and will make reasonable efforts to address legitimate concerns within the agreed scope.
                    </p>

                    {/* ── 7. CANCELLATION AND TERMINATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">7. Cancellation and Termination</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">7.1 Cancellation by Client</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Monthly retainer Services may be cancelled with 30 days' written notice. Cancellation takes effect at the end of the current billing cycle.</li>
                        <li>Project-based Services may be cancelled at any time with written notice, but no refund will be issued for work already completed or fees already paid.</li>
                        <li>Upon cancellation, we will deliver any completed or in-progress Deliverables that have been paid for, in their current state.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">7.2 Termination by RSL/A</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>We reserve the right to terminate any engagement immediately if you breach these Terms, fail to make timely payments, engage in abusive or unethical conduct, or request work that is illegal or violates our values.</li>
                        <li>We may also terminate with 30 days' written notice for any reason, in which case we will deliver completed work and refund any prepaid fees for Services not yet rendered.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">7.3 Effect of Termination</h3>
                    <p className="mb-8">
                        Upon termination, all rights and licenses granted under these Terms and any applicable Service Agreement will cease, except for provisions that by their nature should survive (including payment obligations, intellectual property, limitation of liability, indemnification, and governing law).
                    </p>

                    {/* ── 8. NO GUARANTEES / DISCLAIMER OF WARRANTIES ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">8. No Guarantees and Disclaimer of Warranties</h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            WE DO NOT GUARANTEE ANY SPECIFIC RESULTS, OUTCOMES, OR RETURN ON INVESTMENT FROM OUR SERVICES. MARKETING, SEO, PAID ADVERTISING, CONTENT CREATION, AND AUTOMATION SERVICES ARE INHERENTLY VARIABLE AND DEPEND ON NUMEROUS FACTORS OUTSIDE OUR CONTROL, INCLUDING MARKET CONDITIONS, COMPETITION, PLATFORM ALGORITHM CHANGES, AND YOUR OWN BUSINESS OPERATIONS.
                        </p>
                        <p>
                            THE SITE AND ALL SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                        </p>
                        <p>
                            WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS. WE DO NOT WARRANT THAT ANY CONTENT ON THE SITE IS ACCURATE, COMPLETE, OR CURRENT.
                        </p>
                    </div>

                    {/* ── 9. USE OF AI TOOLS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">9. Use of Artificial Intelligence</h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            We use artificial intelligence tools, including but not limited to Anthropic (Claude), OpenAI (ChatGPT), and other AI services, to generate content, analyze data, build automations, and deliver Services.
                        </p>
                        <p>
                            By engaging our Services, you acknowledge and consent to the following:
                        </p>
                        <ul className="list-disc pl-8 space-y-3">
                            <li>AI tools may be used to create, draft, edit, or optimize Deliverables, including written content, code, visuals, and campaign materials.</li>
                            <li>Information related to your project may be processed through third-party AI platforms as necessary to deliver the Services.</li>
                            <li>AI-generated outputs are reviewed and refined by our team, but we do not guarantee that all AI-generated content is error-free.</li>
                            <li>You are responsible for reviewing and approving all final Deliverables before they are published, deployed, or distributed.</li>
                            <li>AI tools and their capabilities may change over time. We reserve the right to adopt new AI tools or discontinue existing ones as the technology evolves.</li>
                        </ul>
                    </div>

                    {/* ── 10. INTELLECTUAL PROPERTY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">10. Intellectual Property</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.1 Client Deliverables</h3>
                    <p className="mb-8">
                        Upon receipt of full payment for the applicable engagement, you will own the final Deliverables created specifically for you, including custom designs, written content, and code developed as part of your project. Ownership transfers only upon full payment. Until that point, all Deliverables remain the property of RSL/A.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.2 RSL/A Retained Rights</h3>
                    <p className="mb-4">We retain full ownership of:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>All pre-existing materials, templates, frameworks, methodologies, processes, and tools used in delivering the Services.</li>
                        <li>Any general knowledge, skills, techniques, or ideas developed or refined during the course of an engagement.</li>
                        <li>The RSL/A brand, name, logo, and all associated trademarks and intellectual property.</li>
                        <li>Third-party tools, libraries, fonts, stock assets, or open-source components incorporated into Deliverables (which remain subject to their respective licenses).</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.3 Portfolio and Case Study Rights</h3>
                    <p className="mb-8">
                        Unless otherwise agreed in writing, we reserve the right to display completed work in our portfolio, case studies, marketing materials, and social media. If you require confidentiality regarding your engagement, please notify us in writing before work begins.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.4 Site Content</h3>
                    <p className="mb-8">
                        All content on the Site, including text, graphics, logos, images, videos, and code, is the property of RSL/A or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from Site content without our prior written consent.
                    </p>

                    {/* ── 11. CONFIDENTIALITY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">11. Confidentiality</h2>
                    <p className="mb-4">
                        Both parties agree to keep confidential any proprietary or sensitive information disclosed during the course of an engagement, including business strategies, financials, login credentials, customer data, and trade secrets.
                    </p>
                    <p className="mb-4">Confidentiality obligations do not apply to information that:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Is or becomes publicly available through no fault of the receiving party.</li>
                        <li>Was already known to the receiving party before disclosure.</li>
                        <li>Is independently developed without use of the disclosing party's confidential information.</li>
                        <li>Is required to be disclosed by law, regulation, or court order (with reasonable notice to the other party where possible).</li>
                    </ul>
                    <p className="mb-8">
                        Confidentiality obligations survive termination of these Terms for a period of 2 years.
                    </p>

                    {/* ── 12. INDEMNIFICATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">12. Indemnification</h2>
                    <p className="mb-4">
                        You agree to indemnify, defend, and hold harmless RSL/A, its owner, employees, contractors, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from or related to:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Your use of the Site or Services.</li>
                        <li>Your breach of these Terms.</li>
                        <li>Any content, materials, or information you provide to us that infringes on the rights of a third party.</li>
                        <li>Any claims related to campaigns, content, or materials that we create based on information, instructions, or approvals you provide.</li>
                        <li>Your violation of any applicable law or regulation.</li>
                    </ul>

                    {/* ── 13. LIMITATION OF LIABILITY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">13. Limitation of Liability</h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RSL/A SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, BUSINESS OPPORTUNITIES, GOODWILL, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF THE CAUSE OF ACTION OR THEORY OF LIABILITY.
                        </p>
                        <p>
                            OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO RSL/A IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
                        </p>
                        <p>
                            SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IN SUCH JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
                        </p>
                    </div>

                    {/* ── 14. FORCE MAJEURE ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">14. Force Majeure</h2>
                    <p className="mb-8">
                        Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including but not limited to acts of God, natural disasters, pandemics, war, terrorism, government actions, power outages, internet disruptions, cyberattacks, or failures of third-party platforms and services. The affected party will provide prompt notice and make reasonable efforts to resume performance.
                    </p>

                    {/* ── 15. WEBSITE USE ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">15. Acceptable Use of the Site</h2>
                    <p className="mb-4">When using the Site, you agree not to:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Use the Site for any unlawful purpose or in violation of any applicable law or regulation.</li>
                        <li>Attempt to gain unauthorized access to any part of the Site, its servers, or any systems connected to the Site.</li>
                        <li>Use automated tools, bots, scrapers, or crawlers to access, scrape, or index the Site without our prior written consent.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Site.</li>
                        <li>Upload or transmit viruses, malware, or any other harmful code.</li>
                        <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
                        <li>Copy, reproduce, distribute, or create derivative works from Site content without our written consent.</li>
                    </ul>
                    <p className="mb-8">
                        We reserve the right to restrict or terminate your access to the Site at any time if we reasonably believe you have violated these acceptable use provisions.
                    </p>

                    {/* ── 16. THIRD-PARTY PLATFORMS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">16. Third-Party Platforms and Services</h2>
                    <p className="mb-4">
                        Our Services may involve the use of third-party platforms, tools, and services (including but not limited to GoHighLevel, Stripe, Vercel, Sanity, Google Analytics, Meta, and others).
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>We are not responsible for the availability, performance, terms, privacy practices, or policies of any third-party platform.</li>
                        <li>Your use of third-party platforms may be subject to their own terms of service and privacy policies, which you are responsible for reviewing.</li>
                        <li>We are not liable for any changes, outages, data loss, or disruptions caused by third-party platforms.</li>
                        <li>If a third-party platform modifies its features, pricing, or API in a way that affects the Services, we will make reasonable efforts to adapt, but we do not guarantee continuity of specific features that depend on third-party infrastructure.</li>
                    </ul>

                    {/* ── 17. SMS / TEXT MESSAGING ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">17. SMS and Text Messaging</h2>
                    <p className="mb-4">
                        If you opt in to receive SMS or text messages from us, the following terms apply in addition to the SMS terms in our{' '}
                        <Link to="/privacy-policy" className="text-accent hover:underline decoration-accent/50 underline-offset-4">Privacy Policy</Link>:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>By opting in, you consent to receive recurring automated text messages from RSL/A at the phone number you provide, including appointment reminders, service updates, and promotional messages.</li>
                        <li>Consent is not a condition of purchasing any goods or services.</li>
                        <li>Message frequency varies. Standard message and data rates may apply.</li>
                        <li>Reply <strong className="text-text">STOP</strong> at any time to opt out. Reply <strong className="text-text">HELP</strong> for assistance.</li>
                        <li>We will not share your phone number or SMS consent data with third parties for their marketing purposes.</li>
                        <li>We are not liable for delayed or undelivered messages due to carrier issues or technical failures.</li>
                    </ul>

                    {/* ── 18. DISPUTE RESOLUTION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">18. Dispute Resolution</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">18.1 Informal Resolution</h3>
                    <p className="mb-8">
                        Before filing any formal claim, you agree to first contact us at{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4">team@rsla.io</a>{' '}
                        and attempt to resolve the dispute informally for at least 30 days.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">18.2 Binding Arbitration</h3>
                    <p className="mb-8">
                        If we cannot resolve the dispute informally, any controversy or claim arising out of or relating to these Terms or the Services shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association (AAA). The arbitration shall take place in the State of New York, and the arbitrator's decision shall be final and binding. Judgment on the arbitration award may be entered in any court of competent jurisdiction.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">18.3 Class Action Waiver</h3>
                    <p className="mb-8 font-semibold text-text">
                        You agree that any dispute resolution proceedings will be conducted only on an individual basis and not as a class action, consolidated action, or representative action. You waive any right to participate in a class action lawsuit or class-wide arbitration against RSL/A.
                    </p>

                    {/* ── 19. GOVERNING LAW ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">19. Governing Law</h2>
                    <p className="mb-8">
                        These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions. For any matters not subject to arbitration, you consent to the exclusive jurisdiction of the state and federal courts located in New York.
                    </p>

                    {/* ── 20. SEVERABILITY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">20. Severability</h2>
                    <p className="mb-8">
                        If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, or severed if modification is not possible, and the remaining provisions shall continue in full force and effect.
                    </p>

                    {/* ── 21. ENTIRE AGREEMENT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">21. Entire Agreement</h2>
                    <p className="mb-8">
                        These Terms, together with our Privacy Policy and any applicable Service Agreement, constitute the entire agreement between you and RSL/A regarding the subject matter herein. These Terms supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written, between you and RSL/A with respect to the Site and Services (except as specified in an applicable Service Agreement).
                    </p>

                    {/* ── 22. AMENDMENTS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">22. Amendments</h2>
                    <p className="mb-8">
                        We reserve the right to modify these Terms at any time. When we make material changes, we will update the "Effective Date" at the top of this page. Your continued use of the Site or Services after changes are posted constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.
                    </p>

                    {/* ── 23. CONTACT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">23. Contact Information</h2>
                    <p className="mb-4">
                        If you have any questions about these Terms, need to report a concern, or wish to provide notice under these Terms, contact us:
                    </p>
                    <p className="mb-8">
                        <strong className="text-text">RSL/A</strong> - Legal Inquiries:{' '}
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
