import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Privacy() {
    return (
        <main className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Privacy Policy | RSL/A"
                description="RSL/A privacy policy. How we collect, use, and protect your information."
                noIndex
            />
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 min-h-[44px] text-textMuted hover:text-accent font-sans text-sm transition-colors uppercase tracking-wider mb-12">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-10 tracking-tight text-text">
                    Privacy Policy
                </h1>

                <div className="prose-container max-w-none font-sans text-lg leading-relaxed text-textMuted">
                    <p className="mb-8">
                        <strong className="text-text">Effective Date:</strong> February 2026
                    </p>

                    <p className="mb-6">
                        This Privacy Policy ("Policy") describes how <strong className="text-accent">RSL/A</strong> ("Company," "we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website at rsla.io (the "Site"), engage our services, or interact with us through any channel, including email, SMS, social media, or third-party platforms.
                    </p>

                    <p className="mb-6">
                        We operate primarily in the United States and Canada and serve clients internationally. This Policy is designed to comply with applicable privacy laws including the California Consumer Privacy Act (CCPA/CPRA), the Canadian Personal Information Protection and Electronic Documents Act (PIPEDA), and other applicable data protection regulations worldwide.
                    </p>

                    <p className="mb-12">
                        By using our Site, engaging our services, or providing us with your personal information, you acknowledge that you have read and understood this Policy and consent to the collection, use, and disclosure of your information as described herein.
                    </p>

                    {/* ── 1. INFORMATION WE COLLECT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">1. Information We Collect</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">1.1 Information You Provide Directly</h3>
                    <p className="mb-4">
                        When you use our Site, submit inquiries, book a call, subscribe to our newsletter, engage our services, or communicate with us, you may voluntarily provide:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Contact Information:</strong> Name, email address, phone number, mailing address, company name, job title.</li>
                        <li><strong className="text-text">Payment and Billing Information:</strong> Credit or debit card details, billing address, and transaction records, processed securely through third-party payment processors (we do not store full card numbers on our servers).</li>
                        <li><strong className="text-text">Business Information:</strong> Industry, marketing goals, budget, website URLs, brand assets, login credentials for platforms you grant us access to.</li>
                        <li><strong className="text-text">Communications:</strong> Content of emails, SMS messages, chat messages, phone calls, and any files or documents you share with us.</li>
                        <li><strong className="text-text">Newsletter and Marketing Preferences:</strong> Email address and communication preferences when you subscribe to our mailing list or opt in to marketing communications.</li>
                        <li><strong className="text-text">User-Generated Content:</strong> Testimonials, reviews, feedback, or other content you submit to us or authorize us to use.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">1.2 Information Collected Automatically</h3>
                    <p className="mb-4">
                        When you visit our Site, certain information is collected automatically through cookies, pixels, and similar tracking technologies:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Device and Browser Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, and language preferences.</li>
                        <li><strong className="text-text">Usage Data:</strong> Pages visited, time spent on each page, referring URL, links clicked, scroll depth, and navigation paths.</li>
                        <li><strong className="text-text">Location Data:</strong> Approximate geographic location derived from your IP address.</li>
                        <li><strong className="text-text">Cookies and Tracking Technologies:</strong> We use first-party and third-party cookies, web beacons, and pixels. See Section 10 (Cookie Policy) for full details.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">1.3 Information from Third Parties</h3>
                    <p className="mb-4">
                        We may receive information about you from third-party sources, including:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>Analytics providers (such as Google Analytics)</li>
                        <li>Advertising platforms (such as Google Ads and Meta)</li>
                        <li>CRM and marketing automation platforms</li>
                        <li>Publicly available sources (business directories, social media profiles, public records)</li>
                        <li>Referral partners or other clients who provide your contact information with your knowledge</li>
                    </ul>

                    {/* ── 2. HOW WE USE YOUR INFORMATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">2. How We Use Your Information</h2>
                    <p className="mb-4">We use the information we collect for the following purposes:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Service Delivery:</strong> To provide, manage, and deliver the services you engage us for, including marketing campaigns, website development, CRM implementation, local SEO, paid advertising, and AI automation.</li>
                        <li><strong className="text-text">Communication:</strong> To respond to inquiries, send project updates, schedule calls, and provide customer support.</li>
                        <li><strong className="text-text">Billing and Payments:</strong> To process transactions, issue invoices, and maintain financial records.</li>
                        <li><strong className="text-text">Marketing:</strong> To send promotional emails, newsletters, and marketing materials. You can opt out at any time by clicking the unsubscribe link in any email or contacting us directly.</li>
                        <li><strong className="text-text">SMS and Text Messaging:</strong> To send appointment reminders, service updates, and promotional messages (with your express consent). See Section 6 for full SMS terms.</li>
                        <li><strong className="text-text">Analytics and Improvement:</strong> To analyze Site usage, measure campaign performance, and improve our services and user experience.</li>
                        <li><strong className="text-text">AI Processing:</strong> To use artificial intelligence tools to generate content, analyze data, build automations, and optimize deliverables on your behalf. See Section 4 for full details.</li>
                        <li><strong className="text-text">Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and enforceable governmental requests.</li>
                        <li><strong className="text-text">Security:</strong> To detect, prevent, and address fraud, abuse, security risks, and technical issues.</li>
                    </ul>

                    {/* ── 3. HOW WE SHARE YOUR INFORMATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">3. How We Share Your Information</h2>
                    <p className="mb-6 font-sans font-semibold text-text">
                        We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.
                    </p>
                    <p className="mb-4">We may share your information in the following circumstances:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Service Providers and Vendors:</strong> We share information with third-party platforms and tools that help us deliver our services (see Section 5 for a full list). These providers are contractually obligated to use your information only for the purposes we specify.</li>
                        <li><strong className="text-text">AI and Machine Learning Providers:</strong> Information may be processed by AI service providers (such as Anthropic and OpenAI) to generate content, analyze data, and build automations. See Section 4.</li>
                        <li><strong className="text-text">Payment Processors:</strong> Payment information is transmitted directly to our payment processor (Stripe) and is subject to their privacy policy.</li>
                        <li><strong className="text-text">Analytics Providers:</strong> We share usage data with analytics services (such as Google Analytics) to understand how our Site is used.</li>
                        <li><strong className="text-text">Legal Requirements:</strong> We may disclose your information if required by law, subpoena, court order, or other legal process, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</li>
                        <li><strong className="text-text">Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.</li>
                        <li><strong className="text-text">With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
                    </ul>

                    {/* ── 4. AI AND AUTOMATION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">4. Artificial Intelligence and Automation</h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            We use artificial intelligence ("AI") and machine learning tools as a core part of how we deliver services. This includes content generation, data analysis, workflow automation, chatbot interactions, and campaign optimization.
                        </p>
                        <p>
                            AI providers we use include, but are not limited to, <strong className="text-text">Anthropic (Claude)</strong> and <strong className="text-text">OpenAI (ChatGPT)</strong>. Your information may be processed through these platforms to fulfill the services you have engaged us for.
                        </p>
                        <p>
                            We take reasonable steps to limit the personal information shared with AI providers to what is necessary for the task at hand. However, by engaging our services, you acknowledge and consent to the use of AI tools to process information related to your project.
                        </p>
                        <p>
                            AI-generated outputs are reviewed by our team before delivery. We do not guarantee that AI-generated content is free from errors, and final deliverables may include AI-assisted or AI-generated material.
                        </p>
                    </div>

                    {/* ── 5. THIRD-PARTY SERVICES ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">5. Third-Party Services and Platforms</h2>
                    <p className="mb-4">
                        We use the following third-party services to operate our business and deliver services. Each has its own privacy policy governing how it handles your data:
                    </p>
                    <div className="mb-8 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-accent-border">
                                    <th className="py-3 pr-4 font-sans font-semibold text-text text-sm">Provider</th>
                                    <th className="py-3 pr-4 font-sans font-semibold text-text text-sm">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent-border">
                                <tr><td className="py-3 pr-4 text-text">Stripe</td><td className="py-3">Payment processing and billing</td></tr>
                                <tr><td className="py-3 pr-4 text-text">GoHighLevel</td><td className="py-3">CRM, SMS messaging, email marketing, booking, and automation</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Kit (ConvertKit)</td><td className="py-3">Email newsletter and subscriber management</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Google Analytics</td><td className="py-3">Website analytics and usage tracking</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Google Ads</td><td className="py-3">Advertising and conversion tracking</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Meta (Facebook/Instagram)</td><td className="py-3">Advertising and conversion tracking</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Vercel</td><td className="py-3">Website hosting and deployment</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Sanity</td><td className="py-3">Content management system (blogs, case studies)</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Anthropic (Claude)</td><td className="py-3">AI content generation, data analysis, and automation</td></tr>
                                <tr><td className="py-3 pr-4 text-text">OpenAI (ChatGPT)</td><td className="py-3">AI content generation, data analysis, and automation</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Notion</td><td className="py-3">Project management and internal documentation</td></tr>
                                <tr><td className="py-3 pr-4 text-text">GitHub</td><td className="py-3">Code hosting and version control</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Supabase</td><td className="py-3">Database and backend services</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Calendly / GHL Calendar</td><td className="py-3">Appointment scheduling</td></tr>
                                <tr><td className="py-3 pr-4 text-text">Instagram Messaging API (Meta)</td><td className="py-3">Automated DM responses to followers who interact with our Instagram content. Collects Instagram user IDs, message content, and email addresses voluntarily provided through DM conversations.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">Instagram DM Automation</h3>
                    <p className="mb-8">
                        We operate an automated messaging system that sends direct messages to Instagram users who interact with our content (such as commenting a keyword on a post or replying to a story). When you interact with our Instagram account in this way, we may collect your Instagram user ID, username, message content, and any information you voluntarily provide in the DM conversation (such as your email address). This data is stored securely and used solely to deliver the requested resource and track engagement with our content. You can request deletion of your data at any time by contacting{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4">team@rsla.io</a>.
                    </p>

                    <p className="mb-8">
                        This list is not exhaustive. We may use additional tools and services as our business evolves. Each provider processes your data according to their own privacy policies, which we encourage you to review.
                    </p>

                    {/* ── 6. SMS / TEXT MESSAGING ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">6. SMS and Text Messaging</h2>
                    <div className="mb-8 space-y-4">
                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text">6.1 Consent and Opt-In</h3>
                        <p>
                            By providing your phone number and opting in to receive text messages from RSL/A, you expressly consent to receive recurring SMS and MMS messages from us at the phone number you provide. Consent is not a condition of purchasing any goods or services. You can opt in by submitting a form on our Site, verbally during a phone call, or by texting a designated keyword.
                        </p>

                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text mt-6">6.2 Types of Messages</h3>
                        <p>Messages may include:</p>
                        <ul className="list-disc pl-8 space-y-2">
                            <li>Appointment confirmations and reminders</li>
                            <li>Service updates and project notifications</li>
                            <li>Promotional offers and marketing messages</li>
                            <li>Follow-ups and customer support communications</li>
                        </ul>

                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text mt-6">6.3 Message Frequency and Costs</h3>
                        <p>
                            Message frequency varies based on your engagement with our services. Standard message and data rates may apply depending on your mobile carrier and plan. We are not responsible for any charges from your carrier.
                        </p>

                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text mt-6">6.4 Opt-Out</h3>
                        <p>
                            You may opt out of receiving text messages at any time by replying <strong className="text-text">STOP</strong> to any message you receive from us. After opting out, you will receive a single confirmation message. You will no longer receive SMS messages from us unless you re-subscribe.
                        </p>

                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text mt-6">6.5 Help</h3>
                        <p>
                            For assistance with our SMS program, reply <strong className="text-text">HELP</strong> to any message or contact us at{' '}
                            <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4">team@rsla.io</a>.
                        </p>

                        <h3 className="text-xl md:text-2xl font-sans font-semibold text-text mt-6">6.6 No Sharing of SMS Consent Data</h3>
                        <p className="font-semibold text-text">
                            Your mobile phone number and SMS consent data will not be shared with or sold to third parties or affiliates for marketing or promotional purposes. SMS consent information is only shared with our SMS service provider (GoHighLevel) strictly for the purpose of delivering text messages on our behalf.
                        </p>
                    </div>

                    {/* ── 7. DATA RETENTION ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">7. Data Retention</h2>
                    <p className="mb-4">
                        We retain your personal information for as long as necessary to fulfill the purposes described in this Policy, unless a longer retention period is required or permitted by law. Specifically:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Client Data:</strong> Retained for the duration of the business relationship and for up to 3 years after the relationship ends, unless a longer period is required for legal or tax purposes.</li>
                        <li><strong className="text-text">Billing Records:</strong> Retained for up to 7 years as required by tax and accounting regulations.</li>
                        <li><strong className="text-text">Marketing Data:</strong> Retained until you opt out or request deletion.</li>
                        <li><strong className="text-text">Website Analytics:</strong> Retained according to the data retention settings of the analytics provider (typically 14 to 26 months for Google Analytics).</li>
                        <li><strong className="text-text">SMS Consent Records:</strong> Retained for as long as you remain opted in, plus a reasonable period afterward for compliance documentation.</li>
                    </ul>
                    <p className="mb-8">
                        When data is no longer needed, we will securely delete or anonymize it.
                    </p>

                    {/* ── 8. DATA SECURITY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">8. Data Security</h2>
                    <p className="mb-4">
                        We implement reasonable administrative, technical, and physical safeguards to protect your personal information, including:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>HTTPS/TLS encryption on all Site pages and data transmissions</li>
                        <li>Secure third-party payment processing (PCI-DSS compliant via Stripe)</li>
                        <li>Access controls and authentication on all internal systems and tools</li>
                        <li>Regular review of data handling practices</li>
                    </ul>
                    <p className="mb-8">
                        No method of electronic transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. If we become aware of a data breach that affects your personal information, we will notify you in accordance with applicable law.
                    </p>

                    {/* ── 9. CHILDREN'S PRIVACY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">9. Children's Privacy</h2>
                    <p className="mb-8">
                        Our Site and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4">team@rsla.io</a>{' '}
                        and we will take steps to delete that information.
                    </p>

                    {/* ── 10. COOKIE POLICY ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">10. Cookie Policy</h2>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.1 What Are Cookies</h3>
                    <p className="mb-6">
                        Cookies are small text files stored on your device when you visit a website. They help the website recognize your device and remember information about your visit, such as your preferences and browsing activity.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.2 How We Use Cookies</h3>
                    <p className="mb-4">We use the following categories of cookies:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Strictly Necessary Cookies:</strong> Required for the Site to function properly. These cannot be disabled. They include cookies for security, load balancing, and session management.</li>
                        <li><strong className="text-text">Performance and Analytics Cookies:</strong> Help us understand how visitors interact with our Site by collecting anonymous usage data (e.g., Google Analytics). These cookies are loaded when you visit our Site to help us understand usage patterns and improve your experience.</li>
                        <li><strong className="text-text">Functional Cookies:</strong> Remember your preferences and settings (e.g., language, region, cookie banner preference).</li>
                        <li><strong className="text-text">Marketing and Advertising Cookies:</strong> Used to measure campaign performance across platforms (e.g., Meta Pixel). These cookies are loaded when you visit our Site to help us understand which marketing channels are effective.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.3 Cookie Notice</h3>
                    <p className="mb-6">
                        When you first visit our Site, a cookie notice informs you about the cookies we use. As a US-based business serving primarily US and Canadian clients, we do not require opt-in consent for analytics and marketing cookies under applicable law. We provide this notice for transparency so you understand what data is collected during your visit.
                    </p>
                    <p className="mb-6">
                        You may adjust cookie behavior at any time through your browser settings or by clicking the "Cookie Settings" link in our website footer. Disabling cookies in your browser may affect your experience on our Site but will not prevent you from accessing our content.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">10.4 Managing Cookies</h3>
                    <p className="mb-8">
                        You can also manage cookies through your browser settings. Most browsers allow you to block or delete cookies. Please note that disabling cookies may affect the functionality of our Site.
                    </p>

                    {/* ── 11. YOUR PRIVACY RIGHTS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">11. Your Privacy Rights</h2>
                    <p className="mb-6">
                        Depending on where you are located, you may have certain rights regarding your personal information. We honor the following rights to the extent required by applicable law:
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">11.1 Rights for All Users</h3>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Access:</strong> Request a copy of the personal information we hold about you.</li>
                        <li><strong className="text-text">Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
                        <li><strong className="text-text">Deletion:</strong> Request that we delete your personal information, subject to certain legal exceptions.</li>
                        <li><strong className="text-text">Opt-Out of Marketing:</strong> Unsubscribe from marketing emails at any time. Reply STOP to opt out of SMS.</li>
                        <li><strong className="text-text">Withdraw Consent:</strong> Where processing is based on consent, you may withdraw that consent at any time.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">11.2 California Residents (CCPA/CPRA)</h3>
                    <p className="mb-4">If you are a California resident, you have additional rights under the California Consumer Privacy Act and California Privacy Rights Act:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Right to Know:</strong> You can request details about the categories and specific pieces of personal information we have collected, the sources of collection, the business purposes for collection, and the categories of third parties with whom we share it.</li>
                        <li><strong className="text-text">Right to Delete:</strong> You can request deletion of your personal information, with certain exceptions.</li>
                        <li><strong className="text-text">Right to Correct:</strong> You can request correction of inaccurate personal information.</li>
                        <li><strong className="text-text">Right to Opt-Out of Sale or Sharing:</strong> We do not sell your personal information. We do not share your personal information for cross-context behavioral advertising.</li>
                        <li><strong className="text-text">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your privacy rights.</li>
                        <li><strong className="text-text">Right to Limit Use of Sensitive Personal Information:</strong> If applicable, you can request that we limit use of sensitive personal information to what is necessary to provide the services.</li>
                    </ul>
                    <p className="mb-8">
                        To submit a request, contact us at{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline decoration-accent/50 underline-offset-4">team@rsla.io</a>.
                        We will verify your identity before processing your request and respond within 45 days as required by law.
                    </p>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">11.3 Canadian Residents (PIPEDA)</h3>
                    <p className="mb-4">If you are a Canadian resident, you have the following rights under PIPEDA:</p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li>The right to know what personal information we hold about you and how it is used.</li>
                        <li>The right to access your personal information.</li>
                        <li>The right to challenge the accuracy and completeness of your information and have it amended.</li>
                        <li>The right to withdraw consent for the collection, use, or disclosure of your information (subject to legal or contractual restrictions).</li>
                        <li>The right to file a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl mt-8 mb-4 font-sans font-semibold text-text">11.4 European Economic Area, UK, and Other International Users</h3>
                    <p className="mb-4">
                        If you are located in the EEA, United Kingdom, or another jurisdiction with applicable data protection laws, you may have additional rights including:
                    </p>
                    <ul className="list-disc pl-8 mb-8 space-y-3">
                        <li><strong className="text-text">Data Portability:</strong> Request a copy of your data in a structured, commonly used, machine-readable format.</li>
                        <li><strong className="text-text">Restriction of Processing:</strong> Request that we restrict processing of your data in certain circumstances.</li>
                        <li><strong className="text-text">Right to Object:</strong> Object to processing of your personal data for direct marketing or based on legitimate interests.</li>
                        <li><strong className="text-text">Lodge a Complaint:</strong> File a complaint with your local data protection authority.</li>
                    </ul>
                    <p className="mb-8">
                        For international data transfers, we rely on standard contractual clauses and other lawful transfer mechanisms to ensure your data is protected.
                    </p>

                    {/* ── 12. DO NOT TRACK ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">12. Do Not Track Signals</h2>
                    <p className="mb-8">
                        Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. There is currently no uniform standard for interpreting DNT signals. Our Site does not currently respond to DNT browser signals, but we respect your cookie preferences as set through our cookie consent banner.
                    </p>

                    {/* ── 13. THIRD-PARTY LINKS ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">13. Third-Party Links</h2>
                    <p className="mb-8">
                        Our Site may contain links to third-party websites, platforms, or services that are not operated by us. We are not responsible for the privacy practices or content of those third-party sites. We encourage you to review the privacy policies of any third-party site you visit.
                    </p>

                    {/* ── 14. CHANGES ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">14. Changes to This Policy</h2>
                    <p className="mb-8">
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will update the "Effective Date" at the top of this page. We encourage you to review this Policy periodically. Your continued use of the Site or our services after changes are posted constitutes your acceptance of the updated Policy.
                    </p>

                    {/* ── 15. CONTACT ── */}
                    <h2 className="text-2xl md:text-4xl mt-16 mb-6 font-sans font-extrabold text-text">15. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, want to exercise your privacy rights, or have concerns about how we handle your data, contact us:
                    </p>
                    <p className="mb-8">
                        <strong className="text-text">RSL/A</strong> - Privacy Inquiries:{' '}
                        <a href="mailto:team@rsla.io" className="text-accent hover:underline">team@rsla.io</a>
                    </p>
                    <p className="mb-8">
                        We will respond to all privacy-related requests within 30 days (or sooner if required by applicable law). If you are not satisfied with our response, you have the right to lodge a complaint with the applicable data protection authority in your jurisdiction.
                    </p>

                    <p className="mt-16 pt-6 text-sm text-textMuted">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
