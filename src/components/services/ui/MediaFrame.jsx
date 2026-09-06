/**
 * Rounded Mist frame around a visual, with an optional chip label in the
 * corner. The chip is a plain sentence case label, never an eyebrow.
 */
export default function MediaFrame({ children, chip, className = '', padded = true }) {
    return (
        <div className={`relative rounded-callout border border-hairline bg-surfaceAlt ${padded ? 'p-4 sm:p-6 md:p-8' : ''} ${className}`}>
            {chip && (
                <span className="absolute left-4 top-4 z-10 rounded-full border border-hairline bg-surface px-3 py-1 font-sans font-medium text-sm text-text shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {chip}
                </span>
            )}
            <div className={chip && padded ? 'pt-8' : ''}>{children}</div>
        </div>
    );
}
