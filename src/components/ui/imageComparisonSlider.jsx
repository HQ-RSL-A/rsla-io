import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  altBefore = 'Before',
  altAfter = 'After',
  initialPosition = 50,
  className,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    setPosition(newPos);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const stopDragging = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchend', stopDragging);
      document.body.style.cursor = 'ew-resize';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleTouchMove, stopDragging]);

  useEffect(() => {
    if (hasInteracted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const timeout = setTimeout(() => {
          let frame = 0;
          const totalFrames = 40;
          const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const eased = 1 - Math.pow(1 - progress, 3);
            if (frame <= totalFrames / 2) {
              setPosition(50 - eased * 20);
            } else {
              setPosition(30 + (eased - 0.5) * 2 * 20);
            }
            if (frame < totalFrames) requestAnimationFrame(animate);
            else setPosition(50);
          };
          requestAnimationFrame(animate);
        }, 600);
        return () => clearTimeout(timeout);
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasInteracted]);

  const startInteraction = () => {
    setIsDragging(true);
    setHasInteracted(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden select-none group rounded-2xl', className)}
      onMouseDown={startInteraction}
      onTouchStart={startInteraction}
    >
      <img
        src={beforeImage}
        alt={altBefore}
        className="block w-full h-full object-cover object-top"
        draggable={false}
      />

      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 h-full w-0.5 bg-white/70 cursor-ew-resize"
        style={{ left: `calc(${position}% - 1px)` }}
      >
        <div className={cn(
          'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform',
          isDragging && 'scale-110'
        )}>
          <div className="flex items-center text-text">
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 rounded-md bg-black/60 backdrop-blur-sm px-3 py-1 pointer-events-none">
        <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">Before</span>
      </div>
      <div className="absolute top-4 right-4 rounded-md bg-accent/90 backdrop-blur-sm px-3 py-1 pointer-events-none">
        <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">After</span>
      </div>
    </div>
  );
}
