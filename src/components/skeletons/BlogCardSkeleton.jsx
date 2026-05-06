export default function BlogCardSkeleton() {
    return (
        <div className="flex flex-row md:flex-col gap-3 md:gap-0 bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-900/5 p-3 md:p-0 overflow-hidden animate-pulse">
            <div className="w-[110px] h-[74px] md:w-auto md:h-auto md:aspect-[374/237] rounded-lg md:rounded-none bg-gray-200 shrink-0" />
            <div className="flex-1 min-w-0 md:px-5 md:pt-4 md:pb-5 flex flex-col justify-center md:block">
                <div className="h-5 md:h-6 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-5 md:h-6 w-1/2 bg-gray-200 rounded mb-2 hidden md:block" />
                <div className="h-4 w-20 bg-gray-200 rounded mb-1.5" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
