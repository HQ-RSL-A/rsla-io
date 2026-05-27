import { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MediaLightbox({ images, activeIndex = 0, onClose }) {
    const [index, setIndex] = useState(activeIndex);
    const [zoomed, setZoomed] = useState(false);
    const image = images[index];

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && index > 0) { setIndex(i => i - 1); setZoomed(false); }
            if (e.key === 'ArrowRight' && index < images.length - 1) { setIndex(i => i + 1); setZoomed(false); }
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [index, images.length, onClose]);

    if (!image) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
        >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); setZoomed(z => !z); }}
                    className="p-2.5 text-white/60 hover:text-white transition-colors duration-150"
                    aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                >
                    {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-2.5 text-white/60 hover:text-white transition-colors duration-150"
                    aria-label="Close"
                >
                    <X size={22} />
                </button>
            </div>

            <div
                className={zoomed ? 'overflow-auto max-w-[95vw] max-h-[90vh] cursor-zoom-out' : 'cursor-zoom-in'}
                onClick={(e) => { e.stopPropagation(); setZoomed(z => !z); }}
            >
                <img
                    src={image.url}
                    alt={image.alt || ''}
                    className={`rounded-lg ${zoomed ? 'max-w-none' : 'max-w-[90vw] max-h-[85vh] object-contain'}`}
                    draggable={false}
                />
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                {image.caption && (
                    <p className="text-white/70 text-[15px] font-sans mb-1">{image.caption}</p>
                )}
                {images.length > 1 && (
                    <p className="text-white/40 text-[13px] font-sans">{index + 1} / {images.length}</p>
                )}
            </div>

            {images.length > 1 && index > 0 && (
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/40 hover:text-white transition-colors duration-150"
                    onClick={(e) => { e.stopPropagation(); setIndex(i => i - 1); setZoomed(false); }}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={28} />
                </button>
            )}
            {images.length > 1 && index < images.length - 1 && (
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/40 hover:text-white transition-colors duration-150"
                    onClick={(e) => { e.stopPropagation(); setIndex(i => i + 1); setZoomed(false); }}
                    aria-label="Next image"
                >
                    <ChevronRight size={28} />
                </button>
            )}
        </div>
    );
}
