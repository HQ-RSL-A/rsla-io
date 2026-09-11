import { Link } from 'react-router-dom';
import { urlForImage } from '@/sanity/lib/image';

const LOGO_SRC = '/images/logo/logomark.svg';
const FALLBACK_PHOTO = '/images/rahul.webp';

/*
 * The "About" card in the article's right rail (Clay's ArticleShare_about):
 * photo, the logo in a round badge over its bottom-left corner, a bold name,
 * a short bio, and a "Learn more" link.
 */
export default function AboutCard({ author, className = '' }) {
    const name = author?.name || 'Rahul Lalia';
    const photo = author?.image?.asset ? urlForImage(author.image)?.width(468).height(306).fit('crop').url() : FALLBACK_PHOTO;
    const bio = author?.bio || 'Founder of RSL/A, a marketing agency in Bakersfield, CA. We put AI to work for small service businesses: websites, local SEO, automations, and CRM systems that run themselves.';

    return (
        <div className={`bg-blog-card text-blog-ink ${className}`}>
            <div className="aspect-[234/153] overflow-hidden">
                <img src={photo} alt={name} width="468" height="306" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </div>
            <div className="relative px-4 pt-8 pb-5">
                <span className="absolute -top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-blog-card">
                    <img src={LOGO_SRC} alt="" width="24" height="24" className="h-6 w-6 rounded-full" />
                </span>
                <p className="font-bold text-[15px] leading-[21px]">About {name}</p>
                {author?.role && <p className="mt-1 text-[13px] leading-[20px] text-blog-muted">{author.role}</p>}
                <p className="mt-2 mb-3.5 text-[13px] leading-[20px]">{bio}</p>
                <Link to="/about" className="link-draw text-[14px] leading-[1.4]">Learn more</Link>
            </div>
        </div>
    );
}
