import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setVisible(window.scrollY > 600);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollUp}
            aria-label="Scroll to top"
            className={`fixed bottom-6 right-6 z-40 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-surface border border-hairline shadow-md text-text hover:text-accent hover:border-accent/30 active:scale-[0.94] transition-[opacity,transform,color,border-color] duration-md ease-out-smooth cursor-pointer ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <ChevronUp size={20} />
        </button>
    );
}
