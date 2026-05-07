import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RelatedCaseStudies({ caseStudies }) {
    if (!caseStudies || caseStudies.length === 0) return null;

    return (
        <section className="bg-surface py-20 md:py-28 px-6 md:px-12 border-t border-accent-border">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-10">
                    See it in action
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {caseStudies.map((cs) => (
                        <Link
                            key={cs.href}
                            to={cs.href}
                            className="group rounded-xl border border-accent-border bg-accent-light p-6 hover:border-accent/40 transition-colors"
                        >
                            {cs.metric && (
                                <p className="font-sans text-sm font-bold text-accent mb-2">
                                    {cs.metric}
                                </p>
                            )}
                            <h3 className="font-sans text-base font-semibold text-text group-hover:text-accent transition-colors mb-4 leading-snug">
                                {cs.title}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent">
                                Read case study
                                <ArrowRight size={14} strokeWidth={2} />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
