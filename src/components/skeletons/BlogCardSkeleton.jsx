export default function BlogCardSkeleton({ size = 'narrow' }) {
    return (
        <div className="animate-pulse" aria-hidden="true">
            <div className="aspect-[327/182] md:aspect-[2/1] bg-blog-card" />
            <div className="mt-3 h-4 w-20 bg-blog-card" />
            <div className={`mt-3 bg-blog-card ${size === 'wide' ? 'h-8 w-4/5' : 'h-6 w-3/4'}`} />
            <div className="mt-3 h-4 w-40 bg-blog-card" />
        </div>
    );
}
