// Tagged template literal for GROQ queries (identity function, no runtime dependency needed)
const groq = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  String.raw({ raw: strings }, ...values);

// Get related case studies by category (fallback when relatedCases is empty)
export const relatedCaseStudiesQuery = groq`
  *[_type == "caseStudyV2" && slug.current != $slug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(priority asc) [0...3] {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics
  }
`;

// Get a related case study for a blog post (match by mapped category names)
// Pass $categoryNames (array of case study category display names mapped from blog slugs)
export const relatedCaseStudyForBlogQuery = groq`
  *[_type == "caseStudyV2" && count((categories[]->name)[@ in $categoryNames]) > 0] | order(featured desc, priority asc) [0] {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics
  }
`;

// Fallback: get most recent featured case study (when no category match)
export const featuredCaseStudyFallbackQuery = groq`
  *[_type == "caseStudyV2" && featured == true] | order(priority asc) [0] {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics
  }
`;

// Get related V2 blog posts by category (for sidebar, excluding current post)
export const relatedBlogPostsByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && _id != $currentId && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt,
    featuredImage {
      asset->,
      alt
    }
  }
`;

// Get single V2 blog post by slug
export const blogPostBySlugV2Query = groq`
  *[_type == "blogPostV2" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    pullQuote,
    readingTime,
    publishedAt,
    updatedAt,
    status,
    showTableOfContents,
    featured,
    keyTakeaways,
    bottomLine,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      linkedin,
      image {
        asset->,
        alt
      },
      bio
    },
    categories[]->{
      name,
      slug
    },
    body,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      targetKeyphrase,
      socialImage {
        asset->
      }
    },
    faqSchema,
    steps,
    relatedCapability,
    relatedCaseStudies[]->{
      title,
      "slug": slug.current,
      tldr,
      clientName,
      metrics
    },
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readingTime,
      featuredImage {
        asset->,
        alt
      },
      categories[]->{
        name,
        slug
      }
    }
  }
`;

// Featured/latest posts for blog hero section (fetched once, separate from pagination)
export const blogHeroPostsQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()] | order(featured desc, publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage { asset->, alt },
    author->{ name, role, image { asset-> } },
    categories[]->{ name, slug }
  }
`;

// Posts for "Most popular" section (skip hero posts, fetch next 6)
export const blogPopularPostsQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()] | order(featured desc, publishedAt desc) [4...10] {
    _id,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage { asset->, alt },
    author->{ name, image { asset-> } },
    categories[]->{ name, slug }
  }
`;

// Categories with post counts (for "Explore topics" section)
export const blogCategoriesWithCountQuery = groq`
  *[_type == "category" && count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && references(^._id)]) > 0] {
    _id,
    name,
    slug,
    "postCount": count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && references(^._id)])
  }
`;

// Get all published V2 blog posts (primary listing query)
export const blogPostsUnionQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Count all published V2 blog posts
export const blogPostsCountUnionQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()])
`;

// Get all categories that have at least one published V2 blog post
export const blogCategoriesQuery = groq`
  *[_type == "category" && count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && references(^._id)]) > 0] | order(name asc) {
    _id,
    name,
    slug
  }
`;

// Get V2 blog posts filtered by category slug (with pagination)
export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Count V2 blog posts filtered by category slug
export const blogPostsCountByCategoryQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current])
`;

// Search V2 blog posts by title or excerpt (with pagination)
export const blogPostsSearchQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && (title match $searchQuery || excerpt match $searchQuery)] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Count V2 search results
export const blogPostsSearchCountQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && (title match $searchQuery || excerpt match $searchQuery)])
`;

// Search V2 blog posts filtered by category (with pagination)
export const blogPostsSearchByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current && (title match $searchQuery || excerpt match $searchQuery)] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Count V2 search results filtered by category
export const blogPostsSearchByCategoryCountQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current && (title match $searchQuery || excerpt match $searchQuery)])
`;

// Get all V2 case studies (ordered by priority)
export const caseStudiesV2Query = groq`
  *[_type == "caseStudyV2" && status == "published"] | order(priority asc) {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics,
    featured,
    categories[]->{ name, "slug": slug.current },
    priority,
    publishedAt,
    industry,
    thumbnailBackground {
      asset->
    },
    thumbnailLogo {
      asset->
    },
    thumbnailText,
    thumbnailTextColor,
    thumbnailTextSize,
    thumbnailOverlayColor,
    thumbnailOverlayOpacity,
    thumbnailGradientDirection
  }
`;

// Get single V2 case study by slug
export const caseStudyBySlugV2Query = groq`
  *[_type == "caseStudyV2" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics,
    featured,
    categories[]->{ _id, name, "slug": slug.current },
    priority,
    publishedAt,
    content,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      socialImage {
        asset->
      }
    },
    industry,
    problemStatement,
    solutionApproach,
    resultsOutcome,
    resultsMedia[] {
      asset->,
      alt,
      caption
    },
    thumbnailBackground {
      asset->
    },
    beforeAfter {
      before,
      after
    },
    testimonialText,
    testimonialAuthor,
    testimonialMedia[] {
      _type,
      _key,
      url,
      orientation,
      caption,
      alt,
      asset { asset-> }
    },
    relatedCases[]->{
      title,
      "slug": slug.current,
      tldr,
      clientName,
      metrics
    },
    relatedBlogPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset->,
        alt
      },
      categories[]->{
        name,
        slug
      }
    }
  }
`;

// Get featured V2 case studies for homepage
export const featuredCaseStudiesV2Query = groq`
  *[_type == "caseStudyV2" && featured == true] | order(priority asc) [0...3] {
    title,
    "slug": slug.current,
    tldr,
    clientName,
    metrics,
    featured,
    priority,
    thumbnailBackground {
      asset->
    },
    thumbnailLogo {
      asset->
    },
    thumbnailText,
    thumbnailTextColor,
    thumbnailTextSize,
    thumbnailOverlayColor,
    thumbnailOverlayOpacity,
    thumbnailGradientDirection
  }
`;

// ===== LEAD MAGNETS =====

// Get single lead magnet by slug
export const leadMagnetBySlugQuery = groq`
  *[_type == "leadMagnet" && slug.current == $slug && status == "published"][0] {
    title,
    "slug": slug.current,
    description,
    benefits,
    resourceUrl,
    kitTagId,
    ctaButtonText,
    tagline,
    seoTitle,
    seoDescription
  }
`;

