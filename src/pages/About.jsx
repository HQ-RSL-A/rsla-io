import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '../components/Seo';

export default function About() {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.about-hero-content', { opacity: 1, y: 0 });
                gsap.set('.about-section', { opacity: 1, y: 0 });
                gsap.set('.words-section blockquote p', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo('.about-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.about-section',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.25 }
            );

            gsap.fromTo('.words-section blockquote p',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title="About Rahul Lalia & RSL/A | AI Growth Agency"
                description="Meet Rahul Lalia, founder of RSL/A. Five years in marketing, automation, and business infrastructure, building systems that actually run businesses."
                keywords="Rahul Lalia, RSL/A founder, AI automation expert, marketing automation consultant, business systems builder"
                canonical="https://rsla.io/about"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'Rahul Lalia',
                    jobTitle: 'Founder & CEO',
                    url: 'https://rsla.io/about',
                    image: 'https://rsla.io/images/rahul.webp',
                    description: 'Founder of RSL/A. Builds AI growth systems for B2B companies. Five years in marketing, automation, and business infrastructure.',
                    worksFor: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                    },
                    sameAs: [
                        'https://www.linkedin.com/in/rahullalia/',
                        'https://www.instagram.com/rahul.lalia/',
                        'https://www.youtube.com/@rahul_lalia',
                        'https://www.tiktok.com/@rahul_lalia',
                        'https://github.com/rahullalia',
                    ],
                }}
            />
            <section className="bg-surface pt-36 pb-16 md:pt-44 md:pb-20 px-6 md:px-12">
                <div className="about-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-caveat font-medium text-4xl md:text-6xl text-text tracking-tight mb-6 leading-[1.15]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            "What a privilege to be tired from work you once begged the universe for..."
                        </TextAnimate>
                    </h1>
                </div>
            </section>

            {/* Body Content */}
            <section className="about-body bg-surfaceAlt pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-3xl mx-auto">
                    {/* Origin Story */}
                    <div className="about-section opacity-0 mb-16 md:mb-20">
                        <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-6">
                            How it started
                        </h2>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            I started my career in marketing analytics. Numbers, dashboards, attribution models. I was the guy staring at spreadsheets while everyone else was making the creative decisions.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            Then I got laid off.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            And honestly? It was the best thing that happened to me. Because it forced me to build something on my own.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            I started an agency. The classic social media marketing agency thing. Posting content, running accounts, doing the hustle. But I kept noticing the same pattern with every client I worked with.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            They were not struggling because they lacked talent. They were drowning in manual work.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            Following up with leads at midnight. Copy-pasting between three different tools. Losing deals because they forgot to reply. Running ads with zero tracking. Paying for five different software subscriptions that did not talk to each other.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            And you know what? Most of the "solutions" out there made it worse. More tools, more complexity, more things to manage.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed">
                            So I started asking a different question. What if AI could handle all the stuff that founders should not be doing manually? Not theoretical AI. Not "we will build you a chatbot" AI. Practical, measured, actually-useful-for-your-business AI. That became the whole thing.
                        </p>
                    </div>

                    {/* What I Actually Do */}
                    <div className="about-section opacity-0 mb-16 md:mb-20">
                        <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-6">
                            What I actually do
                        </h2>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            I show founders how to put AI to work in their business. Then I build it for them.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            The teaching part is free. I post the workflows, the tools, the exact systems. No gatekeeping. If you can build it yourself after watching my content, I genuinely want that for you.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed">
                            But here is the thing. There is a difference between knowing what to build and building it right. A system that works for 10 leads breaks at 500. An AI bot that sounds great in a demo falls apart with real customers. The gap between a prototype and a production system is where most founders get stuck. That is where RSL/A comes in. My team and I are the ones who build the production version. The one that actually scales, actually handles edge cases, and actually shows you the numbers so you know it is working.
                        </p>
                    </div>

                    {/* Why I Am Different */}
                    <div className="about-section opacity-0 mb-16 md:mb-20">
                        <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-6">
                            Why I am different
                        </h2>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed mb-4">
                            I came from analytics. That matters.
                        </p>
                        <p className="font-sans font-normal text-lg text-textMuted leading-relaxed">
                            Most people in this space show you a demo and call it done. I show you a dashboard. Real numbers. What the AI system did this week, how many leads it handled, how many meetings it booked, what the conversion rate was. Because if you cannot measure it, it is just a toy. And founders do not need toys. They need infrastructure.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="about-section opacity-0">
                        <Link to="/work" className="inline-flex items-center gap-2 font-sans font-semibold text-lg text-accent hover:text-accent/80 transition-colors group">
                            See what we have built
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="words-section bg-surface py-20 md:py-28 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="relative">
                        <blockquote className="relative z-10">
                            <p className="font-caveat font-medium text-2xl md:text-4xl text-text leading-[1.4] md:leading-[1.45]">What a privilege to be tired from work you once begged the universe for. What a privilege to feel overwhelmed by growth you used to dream about. What a privilege to be challenged by a life you created on purpose. What a privilege to outgrow things you used to settle for.</p>
                        </blockquote>
                    </div>
                    <cite className="block mt-8 md:mt-10 font-sans font-normal text-lg text-textMuted not-italic">
                        Aryan Sachdeva, via Medium
                    </cite>
                </div>
            </section>

        </main>
    );
}
