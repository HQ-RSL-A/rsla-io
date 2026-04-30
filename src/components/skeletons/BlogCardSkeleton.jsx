export default function BlogCardSkeleton() {
    return (
        <div className="flex flex-col h-full bg-surfaceAlt rounded-2xl border border-accent-border overflow-hidden animate-pulse">
            <div className="aspect-[3/2] bg-accent-border/40" />
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex gap-2 mb-4">
                    <div className="h-5 w-16 bg-accent-border/40 rounded-sm" />
                    <div className="h-5 w-20 bg-accent-border/40 rounded-sm" />
                </div>
                <div className="h-7 w-3/4 bg-accent-border/40 rounded mb-2" />
                <div className="h-7 w-1/2 bg-accent-border/40 rounded mb-4" />
                <div className="space-y-2 mb-6 flex-grow">
                    <div className="h-4 w-full bg-accent-border/40 rounded" />
                    <div className="h-4 w-5/6 bg-accent-border/40 rounded" />
                    <div className="h-4 w-2/3 bg-accent-border/40 rounded" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-accent-border">
                    <div className="h-3 w-20 bg-accent-border/40 rounded" />
                    <div className="h-3 w-16 bg-accent-border/40 rounded" />
                </div>
            </div>
        </div>
    );
}
