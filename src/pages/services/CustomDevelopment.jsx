import Seo from '@/components/Seo';
import { services } from '@/data/serviceData';

const service = services['custom-development'];

export default function CustomDevelopment() {
  return (
    <main className="min-h-screen bg-surface pt-36 pb-24 px-6 md:px-12">
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        keywords={service.keywords}
        canonical={service.canonical}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text">
          {service.title}
        </h1>
        {/* Page intentionally blank (content cleared 2026-07-22). Route + SEO title preserved; rebuild content here. */}
      </div>
    </main>
  );
}
