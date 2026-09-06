import ImageComparisonSlider from '@/components/ui/imageComparisonSlider';

/**
 * Fieldshare's homepage before and after the rebuild. Real screenshots from
 * public/images/portfolio, dragged with the existing comparison slider.
 */
export default function BeforeAfter() {
    return (
        <figure>
            <div className="rounded-callout overflow-hidden border border-hairline bg-surfaceAlt">
                <ImageComparisonSlider
                    beforeImage="/images/portfolio/fieldshare-before.jpg"
                    afterImage="/images/portfolio/fieldshare-after.jpg"
                    altBefore="Fieldshare's homepage before the redesign"
                    altAfter="Fieldshare's homepage after the redesign"
                    className="rounded-callout"
                />
            </div>
            <figcaption className="mt-3 font-sans text-sm text-text">Fieldshare, before and after. Drag the handle. Same company, ranking URLs kept, new positioning.</figcaption>
        </figure>
    );
}
