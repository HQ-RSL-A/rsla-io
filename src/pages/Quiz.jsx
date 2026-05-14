import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ArrowLeft, Loader2, Check, ChevronDown, RotateCcw, Search, TrendingUp, Globe, Clock, BarChart3, Zap, Shield, Layout, ImageIcon, X } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';

const STEPS = {
    INTRO: 'intro',
    INFO: 'info',
    QUIZ: 'quiz',
    RESULT: 'result',
    OFFER: 'offer',
};

const QUESTIONS = [
    {
        id: 'awareness',
        icon: Search,
        question: "When you're looking for something new - a restaurant, a hotel, a service you've never used - where do you usually start?",
        options: [
            { label: 'Google', value: 'google' },
            { label: 'AI tools like ChatGPT or Perplexity', value: 'ai' },
            { label: 'Social media', value: 'social' },
            { label: 'I ask someone I know', value: 'ask' },
        ],
    },
    {
        id: 'confidence',
        icon: TrendingUp,
        question: 'How confident are you that your business shows up when someone searches for your services on ChatGPT or Perplexity?',
        options: [
            { label: 'Very confident', value: 'very' },
            { label: 'Somewhat confident', value: 'somewhat' },
            { label: 'Not confident', value: 'not' },
            { label: "I honestly don't know", value: 'unknown' },
        ],
    },
    {
        id: 'platform',
        icon: Globe,
        question: 'How was your website built?',
        options: [
            { label: 'Using Squarespace, Wix, GoDaddy, or a similar builder', value: 'builder' },
            { label: "It's built on WordPress", value: 'wordpress' },
            { label: 'A web designer or developer built it custom', value: 'custom' },
            { label: "I'm not sure / someone else handles it", value: 'unsure' },
        ],
    },
    {
        id: 'age',
        icon: Clock,
        question: 'When was your website last updated or redesigned?',
        options: [
            { label: 'Within the last 2 years', value: 'recent' },
            { label: '2 to 5 years ago', value: 'moderate' },
            { label: 'More than 5 years ago', value: 'old' },
            { label: 'Never', value: 'never' },
        ],
    },
    {
        id: 'seo',
        icon: BarChart3,
        question: 'Has anyone ever worked on getting your website to show up on Google (SEO)?',
        options: [
            { label: 'Yes, actively and recently', value: 'active' },
            { label: 'Yes, but not in a while', value: 'inactive' },
            { label: 'No, not that I know of', value: 'no' },
        ],
    },
];

const RESULT_CONTENT = {
    accelerate: {
        heading: "Your business has a head start, but there's a gap.",
        paragraphs: [
            "Your website has a solid foundation. The problem isn't where you started - it's where search is going.",
            "Traditional SEO gets you found on Google. But AI platforms work differently. ChatGPT, Perplexity, and Google AI Overview don't just crawl websites - they look for specific signals: how your content is structured, whether other sources reference you, and whether your site is built to be read by AI. Most businesses don't have that layer yet.",
            "The window is open right now. Your competitors probably aren't showing up in AI search either. That's the opportunity.",
        ],
    },
    bdWebsiteBuilder: {
        heading: 'Your website platform is the bottleneck.',
        paragraphs: [
            "Platforms like Squarespace, Wix, and GoDaddy are great for getting online quickly, but they don't give you the technical control that AI search requires. ChatGPT and Perplexity pull recommendations from websites with specific infrastructure: structured data, content APIs, and schema markup. Drag-and-drop builders can't support that, no matter how much you optimize on top of them.",
            "This isn't a content problem or a visibility problem. It's a foundation problem. And a foundation problem needs a foundation fix.",
        ],
    },
    bdOutdatedSite: {
        heading: "Search has changed. Your website hasn't.",
        paragraphs: [
            "The way people find businesses has shifted significantly, and AI has accelerated it. Older websites are missing the signals that AI platforms look for: how content is structured, how fast the site loads, and whether it's built to be read and understood by AI. Patching an outdated site gets you partial results at best.",
            "Building fresh means everything is set up correctly from day one - for traditional SEO, for AI search, and for however things continue to evolve.",
        ],
    },
    bdGeneral: {
        heading: "Right now, AI can't find you.",
        paragraphs: [
            "When someone asks ChatGPT or Perplexity to recommend a business like yours, your name probably isn't coming up. That's not a visibility problem - it's a foundation problem. AI platforms need specific signals to find, trust, and recommend a business. Without the right setup, you're invisible to an audience that's growing every day.",
            "The fix exists. But it starts with the right foundation.",
        ],
    },
};

const SOCIAL_PROOF_IMAGES = [
    { src: '/images/quiz/chatGPT-1.png', alt: 'Business recommended in ChatGPT response' },
    { src: '/images/quiz/chatgpt.png', alt: 'Business appearing in ChatGPT search results' },
    { src: '/images/quiz/unitedSikhs.jpg', alt: 'Non-profit organization appearing in AI results' },
];

const OFFER_CONTENT = {
    accelerate: {
        name: 'GEO Accelerate',
        tagline: 'For businesses with an existing website that need the GEO/AEO/SEO layer',
        price: '$1,200',
        period: '/mo',
        commitment: '3-month minimum',
        features: [
            { icon: Zap, text: 'Free audit + competitor gap report' },
            { icon: Clock, text: 'Plan and infrastructure live within 14 days of kickoff' },
            { icon: TrendingUp, text: 'Appearing in 2+ AI platforms within 60 days, or we continue free until it does*' },
            { icon: Shield, text: 'Exclusive: we only work with one business per city' },
        ],
    },
    buildDominate: {
        name: 'Build + Dominate',
        tagline: 'Full website rebuild plus full GEO/AEO/SEO optimization',
        price: '$2,000',
        period: '/mo',
        commitment: '6-month minimum',
        features: [
            { icon: Zap, text: 'Free audit + competitor gap report' },
            { icon: Layout, text: 'New or redesigned website with up to 20 unique pages, existing content migrated' },
            { icon: Shield, text: "You own the website and hosting. We don't hold websites hostage." },
            { icon: TrendingUp, text: 'Appearing in 2+ AI platforms within 6 months of site going live, or we continue free until it does*' },
            { icon: Globe, text: 'Exclusive: we only work with one business per city' },
        ],
    },
};

const TERMS_TEXT = 'Results vary based on search query, geographic market, and competitive landscape. "Appearing" means being mentioned or recommended in response to at least three relevant queries across two LLM platforms (e.g., ChatGPT, Perplexity, Google AI Overview, Claude). Results are measured against target keywords agreed upon after the initial research phase, typically within the first 30 days. For Build + Dominate, the guarantee period begins on the date the website goes live and target keywords are approved. Guarantee applies when the client has fulfilled obligations including content approvals, site access, and timely feedback. LLM training data, update cycles, and ranking signals are outside our direct control and may affect timelines. Free continuation is capped at 3 months for both options.';

const BOOKING_URL = '/contact?utm_source=cold_email&utm_medium=quiz&utm_campaign=geo_quiz';

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function calculateResult(answers) {
    if (answers[2] === 'builder') {
        return { offer: 'buildDominate', variant: 'bdWebsiteBuilder' };
    }

    let aPoints = 0;
    if (answers[1] === 'very') aPoints++;
    if (answers[3] === 'recent') aPoints++;
    if (answers[4] === 'active') aPoints++;
    if (answers[2] === 'wordpress') aPoints--;

    if (aPoints >= 2) {
        return { offer: 'accelerate', variant: 'accelerate' };
    }

    if (answers[3] === 'old' || answers[3] === 'never') {
        return { offer: 'buildDominate', variant: 'bdOutdatedSite' };
    }

    return { offer: 'buildDominate', variant: 'bdGeneral' };
}

export default function Quiz() {
    const [step, setStep] = useState(STEPS.INTRO);
    const [formData, setFormData] = useState({ email: '', name: '', phone: '', agency: '', city: '' });
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizResult, setQuizResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [termsOpen, setTermsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const stepRef = useRef(null);
    const resultIconRef = useRef(null);

    const animateEntrance = useCallback(() => {
        if (!stepRef.current) return;
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.quiz-reveal', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo('.quiz-reveal',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.06 }
            );
        }, stepRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const cleanup = animateEntrance();
        return cleanup;
    }, [step, currentQuestion, animateEntrance]);

    useEffect(() => {
        if (step !== STEPS.RESULT || !resultIconRef.current) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            gsap.set(resultIconRef.current, { scale: 1, opacity: 1 });
            return;
        }
        gsap.fromTo(resultIconRef.current,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 }
        );
    }, [step]);

    const handleStartOver = () => {
        setStep(STEPS.INTRO);
        setAnswers({});
        setCurrentQuestion(0);
        setQuizResult(null);
        setError('');
        setTermsOpen(false);
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name.trim()) {
            setError('Please enter your name.');
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        window.dataLayer?.push({ event: 'quiz_info_submitted' });
        setStep(STEPS.QUIZ);
    };

    const handleAnswer = (questionIndex, answerValue) => {
        const newAnswers = { ...answers, [questionIndex]: answerValue };
        setAnswers(newAnswers);
        window.dataLayer?.push({ event: 'quiz_answer', question: QUESTIONS[questionIndex].id, answer: answerValue });

        if (questionIndex < QUESTIONS.length - 1) {
            setCurrentQuestion(questionIndex + 1);
        } else {
            handleQuizComplete(newAnswers);
        }
    };

    const handleQuizComplete = async (finalAnswers) => {
        setSubmitting(true);
        const result = calculateResult(finalAnswers);
        setQuizResult(result);

        const answerLabels = {};
        QUESTIONS.forEach((q, i) => {
            const selected = q.options.find(o => o.value === finalAnswers[i]);
            const key = ['discovery', 'confidence', 'platform', 'lastUpdate', 'seo'][i];
            if (key && selected) answerLabels[key] = selected.label;
        });

        const offerName = result.offer === 'accelerate' ? 'GEO Accelerate' : 'Build + Dominate';

        try {
            await fetch('/api/quiz-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    answerLabels,
                    result: result.variant,
                    offer: offerName,
                }),
            });
        } catch {
            // Non-blocking
        }

        window.dataLayer?.push({ event: 'quiz_complete', offer: result.offer, variant: result.variant });
        setStep(STEPS.RESULT);
        setSubmitting(false);
    };

    const progressPercent = Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100);
    const QuestionIcon = QUESTIONS[currentQuestion]?.icon;
    const resultContent = quizResult ? RESULT_CONTENT[quizResult.variant] : null;
    const offerContent = quizResult ? OFFER_CONTENT[quizResult.offer] : null;

    return (
        <main className="min-h-screen bg-surfaceAlt flex flex-col items-center justify-center px-5 md:px-6 py-16 md:py-24 relative overflow-hidden">
            <Seo
                title="Is Your Business Invisible to AI? | RSL/A"
                description="ChatGPT, Perplexity, and Google are recommending businesses to millions of people every day. Most businesses have no idea where they stand. Take 60 seconds to find out."
                canonical="https://rsla.io/geo-quiz"
                noIndex
            />

            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.7) 0%, transparent 70%)' }}
            />

            {/* Image preview overlay */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setPreviewImage(null)}
                    role="dialog"
                    aria-label="Image preview"
                >
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="Close preview"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <img
                        src={previewImage.src}
                        alt={previewImage.alt}
                        className="max-w-full max-h-[85vh] rounded-xl object-contain"
                    />
                </div>
            )}

            <div ref={stepRef} key={`${step}-${currentQuestion}`} className="w-full max-w-[560px] mx-auto relative z-10">

                {/* ── INTRO ── */}
                {step === STEPS.INTRO && (
                    <div className="text-center">
                        <div className="quiz-reveal opacity-0 mb-5">
                            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-accent/80">
                                60-Second Assessment
                            </span>
                        </div>

                        <div className="mb-5">
                            <TextAnimate
                                animation="blurInUp"
                                by="word"
                                delay={0.08}
                                startOnView={false}
                                as="h1"
                                className="font-sans font-bold tracking-[-0.02em] leading-[1.08] text-text"
                                style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}
                            >
                                Is Your Business Invisible to AI?
                            </TextAnimate>
                        </div>

                        <div
                            className="quiz-reveal opacity-0 font-sans text-textMuted max-w-[460px] mx-auto mb-10 text-center"
                            style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.7 }}
                        >
                            <p>ChatGPT, Perplexity, and Google are now recommending</p>
                            <p>businesses to millions of people every day.</p>
                            <p className="mt-3">Most businesses have no idea where they stand.</p>
                            <p className="mt-3">Take 60 seconds to find out.</p>
                        </div>

                        <button
                            onClick={() => setStep(STEPS.INFO)}
                            className="quiz-reveal opacity-0 inline-flex items-center gap-2.5 bg-accent text-white font-semibold px-9 py-4 rounded-xl text-base transition-colors hover:bg-[#0059C2] active:scale-[0.98] active:transition-transform"
                        >
                            Start
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* ── INFO ── */}
                {step === STEPS.INFO && (
                    <div>
                        <button
                            onClick={() => setStep(STEPS.INTRO)}
                            className="quiz-reveal opacity-0 inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-text transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                        </button>

                        <h2
                            className="quiz-reveal opacity-0 font-sans font-bold tracking-[-0.02em] text-text mb-2"
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)' }}
                        >
                            Almost there
                        </h2>
                        <p className="quiz-reveal opacity-0 text-textMuted text-[17px] mb-9">
                            So we can send you your personalized results.
                        </p>

                        <form onSubmit={handleInfoSubmit} className="space-y-5">
                            <div className="quiz-reveal opacity-0">
                                <label htmlFor="quiz-name" className="block text-sm font-medium text-text mb-2">
                                    Full name <span className="text-coral">*</span>
                                </label>
                                <input
                                    id="quiz-name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Jane Smith"
                                    className="w-full px-4 py-3.5 rounded-xl border border-accent-border-strong bg-surface text-text placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-[16px]"
                                />
                            </div>

                            <div className="quiz-reveal opacity-0">
                                <label htmlFor="quiz-email" className="block text-sm font-medium text-text mb-2">
                                    Email address <span className="text-coral">*</span>
                                </label>
                                <input
                                    id="quiz-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3.5 rounded-xl border border-accent-border-strong bg-surface text-text placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-[16px]"
                                />
                            </div>

                            <div className="quiz-reveal opacity-0">
                                <label htmlFor="quiz-phone" className="block text-sm font-medium text-text mb-2">
                                    Phone number
                                </label>
                                <input
                                    id="quiz-phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-3.5 rounded-xl border border-accent-border-strong bg-surface text-text placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-[16px]"
                                />
                            </div>

                            <div className="quiz-reveal opacity-0">
                                <label htmlFor="quiz-agency" className="block text-sm font-medium text-text mb-2">
                                    Business name
                                </label>
                                <input
                                    id="quiz-agency"
                                    type="text"
                                    autoComplete="organization"
                                    value={formData.agency}
                                    onChange={e => setFormData(prev => ({ ...prev, agency: e.target.value }))}
                                    placeholder="Acme Inc."
                                    className="w-full px-4 py-3.5 rounded-xl border border-accent-border-strong bg-surface text-text placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-[16px]"
                                />
                            </div>

                            <div className="quiz-reveal opacity-0">
                                <label htmlFor="quiz-city" className="block text-sm font-medium text-text mb-2">
                                    City
                                </label>
                                <input
                                    id="quiz-city"
                                    type="text"
                                    value={formData.city}
                                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="New York"
                                    className="w-full px-4 py-3.5 rounded-xl border border-accent-border-strong bg-surface text-text placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-[16px]"
                                />
                            </div>

                            {error && <p className="text-coral text-sm" role="alert">{error}</p>}

                            <button
                                type="submit"
                                className="quiz-reveal opacity-0 w-full inline-flex items-center justify-center gap-2.5 bg-accent text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors hover:bg-[#0059C2] active:scale-[0.98] active:transition-transform mt-1"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}

                {/* ── QUIZ ── */}
                {step === STEPS.QUIZ && !submitting && (
                    <div>
                        <div className="quiz-reveal opacity-0 mb-10">
                            <div className="flex items-center justify-between text-[13px] text-textMuted mb-2.5">
                                <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full h-[5px] bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent rounded-full"
                                    style={{
                                        width: `${progressPercent}%`,
                                        transition: 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="quiz-reveal opacity-0 flex items-start gap-3 mb-8">
                            {QuestionIcon && (
                                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <QuestionIcon className="w-4.5 h-4.5 text-accent" />
                                </div>
                            )}
                            <h2
                                className="font-sans font-bold tracking-[-0.02em] text-text"
                                style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)' }}
                            >
                                {QUESTIONS[currentQuestion].question}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {QUESTIONS[currentQuestion].options.map((option, i) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(currentQuestion, option.value)}
                                    className="quiz-reveal opacity-0 w-full text-left px-5 py-4 rounded-xl border border-accent-border-strong bg-surface hover:border-accent hover:bg-accent-light group"
                                    style={{
                                        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                                        minHeight: '56px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <span className="font-medium text-[17px] text-text group-hover:text-accent transition-colors">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {currentQuestion > 0 && (
                            <button
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="quiz-reveal opacity-0 inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-text transition-colors mt-8"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Previous question
                            </button>
                        )}
                    </div>
                )}

                {/* ── SUBMITTING ── */}
                {submitting && (
                    <div className="text-center py-20">
                        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                            <Loader2 className="w-6 h-6 text-accent animate-spin" />
                        </div>
                        <p className="text-textMuted text-[17px]">Analyzing your answers...</p>
                    </div>
                )}

                {/* ── RESULT (Diagnosis) ── */}
                {step === STEPS.RESULT && resultContent && (
                    <div>
                        <div
                            ref={resultIconRef}
                            className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-7 opacity-0"
                        >
                            <Check className="w-5 h-5 text-accent" strokeWidth={2.5} />
                        </div>

                        <h2
                            className="quiz-reveal opacity-0 font-sans font-bold tracking-[-0.02em] text-text mb-6"
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
                        >
                            {resultContent.heading}
                        </h2>

                        <div className="space-y-4 mb-10">
                            {resultContent.paragraphs.map((p, i) => (
                                <p key={i} className="quiz-reveal opacity-0 text-textMuted leading-relaxed" style={{ fontSize: '17px' }}>
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* Social proof */}
                        <div className="quiz-reveal opacity-0 mb-10">
                            <p className="text-text font-medium text-[15px] mb-4">
                                Businesses we work with are already showing up here:
                            </p>
                            <div className="grid grid-cols-3 gap-2.5">
                                {SOCIAL_PROOF_IMAGES.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPreviewImage(img)}
                                        className="bg-surface border border-accent-border rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center hover:border-accent transition-colors group cursor-pointer"
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden items-center justify-center p-2 w-full h-full">
                                            <ImageIcon className="w-5 h-5 text-textLight" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-reveal opacity-0 text-center">
                            <button
                                onClick={() => setStep(STEPS.OFFER)}
                                className="inline-flex items-center gap-2.5 bg-accent text-white font-semibold px-9 py-4 rounded-xl text-base transition-colors hover:bg-[#0059C2] active:scale-[0.98] active:transition-transform"
                            >
                                See what we'd recommend
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="quiz-reveal opacity-0 text-center mt-6">
                            <button
                                onClick={handleStartOver}
                                className="inline-flex items-center gap-1.5 text-[13px] text-textLight hover:text-textMuted transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Start over
                            </button>
                        </div>
                    </div>
                )}

                {/* ── OFFER ── */}
                {step === STEPS.OFFER && offerContent && (
                    <div>
                        <h2
                            className="quiz-reveal opacity-0 font-sans font-bold tracking-[-0.02em] text-text text-center mb-8"
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
                        >
                            Here's what we'd recommend for you.
                        </h2>

                        {/* Offer card */}
                        <div className="quiz-reveal opacity-0 bg-surface border border-accent-border-strong rounded-2xl p-6 md:p-8 mb-8">
                            <div className="mb-6">
                                <h3 className="font-sans font-bold text-text text-xl mb-1">
                                    {offerContent.name}
                                </h3>
                                <p className="text-textMuted text-[15px]">
                                    {offerContent.tagline}
                                </p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="font-sans font-bold text-text" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>
                                    {offerContent.price}
                                </span>
                                <span className="text-textMuted text-lg">{offerContent.period}</span>
                            </div>
                            <p className="text-textLight text-sm mb-6">{offerContent.commitment}</p>

                            <div className="h-px bg-accent-border mb-6" />

                            <ul className="space-y-4">
                                {offerContent.features.map((feature, i) => {
                                    const FeatureIcon = feature.icon;
                                    return (
                                        <li key={i} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <FeatureIcon className="w-3 h-3 text-accent" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-text text-[15px] leading-relaxed">{feature.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* FOMO copy */}
                        <p className="quiz-reveal opacity-0 text-textMuted text-center text-[15px] leading-relaxed mb-8 max-w-[480px] mx-auto">
                            We partner with one business per city. No exceptions.
                            If a competitor in your market moves first, that slot is gone.
                            Most cities are still open - book a call to check yours.
                        </p>

                        {/* CTA */}
                        <div className="quiz-reveal opacity-0 text-center mb-6">
                            <a
                                href={BOOKING_URL}
                                className="inline-flex items-center gap-2.5 bg-accent text-white font-semibold px-9 py-4 rounded-xl text-base transition-colors hover:bg-[#0059C2] active:scale-[0.98] active:transition-transform"
                            >
                                Book Your Call
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Start over */}
                        <div className="quiz-reveal opacity-0 text-center mb-6">
                            <button
                                onClick={handleStartOver}
                                className="inline-flex items-center gap-1.5 text-[13px] text-textLight hover:text-textMuted transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Start over
                            </button>
                        </div>

                        {/* Terms */}
                        <div className="quiz-reveal opacity-0 mt-4">
                            <button
                                onClick={() => setTermsOpen(prev => !prev)}
                                className="flex items-center gap-1.5 text-[12px] text-textLight hover:text-textMuted transition-colors mx-auto"
                            >
                                *Terms and conditions
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${termsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {termsOpen && (
                                <p className="mt-3 text-[12px] text-textLight leading-relaxed max-w-[480px] mx-auto">
                                    {TERMS_TEXT}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Branding */}
            {step !== STEPS.OFFER && (
                <a
                    href="https://rsla.io"
                    className="relative z-10 mt-20 text-[11px] tracking-wide text-textMuted hover:text-text transition-colors"
                >
                    Powered by RSL/A
                </a>
            )}
        </main>
    );
}
