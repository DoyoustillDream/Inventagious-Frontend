/**
 * Structured Data (JSON-LD) Components
 * Provides rich snippets for search engines
 */

import { siteConfig } from './config';

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": siteConfig.logo,
    "description": siteConfig.description,
    "sameAs": [
      "https://x.com/Inventagiousapp",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": `${siteConfig.url}/contact`,
    },
    "foundingDate": "2024",
    "founders": {
      "@type": "Organization",
      "name": siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({ 
  title, 
  description, 
  url 
}: { 
  title: string; 
  description?: string; 
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description || siteConfig.description,
    "url": url,
    "inLanguage": siteConfig.language,
    "isPartOf": {
      "@type": "WebSite",
      "name": siteConfig.name,
      "url": siteConfig.url,
    },
    "about": {
      "@type": "Thing",
      "name": "Crowdfunding Platform",
    },
    "mainEntity": {
      "@type": "Organization",
      "name": siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ 
  items 
}: { 
  items: Array<{ name: string; url: string }> 
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": siteConfig.name,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
    },
    "description": siteConfig.description,
    "url": siteConfig.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FinancialProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Crowdfunding Platform",
    "description": "A blockchain-based crowdfunding and fundraising platform for inventors and innovators",
    "provider": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url,
    },
    "category": "Crowdfunding",
    "feesAndCommissionsSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article Schema for project/campaign pages
 */
export function ArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description || siteConfig.description,
    "url": url,
    "image": image || siteConfig.ogImage,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author || siteConfig.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": siteConfig.logo,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "keywords": tags.join(", "),
    "inLanguage": siteConfig.language,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Schema for help pages
 */
export function FAQSchema({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ItemList Schema for listing pages (projects, campaigns, etc.)
 */
export function ItemListSchema({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: Array<{
    name: string;
    url: string;
    description?: string;
    image?: string;
  }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description || siteConfig.description,
    "url": url,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": item.name,
        "url": item.url,
        "description": item.description,
        "image": item.image,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Product Schema for project/campaign pages
 * Used for e-commerce style rich snippets
 */
export function ProductSchema({
  name,
  description,
  url,
  image,
  category,
  brand,
  offers,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  category?: string;
  brand?: string;
  offers?: {
    priceCurrency: string;
    availability: string;
    price?: number;
    url?: string;
  };
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description || siteConfig.description,
    "image": image || siteConfig.ogImage,
    "brand": {
      "@type": "Brand",
      "name": brand || siteConfig.name,
    },
    "category": category || "Crowdfunding",
    "url": url,
  };

  if (offers) {
    schema.offers = {
      "@type": "Offer",
      "priceCurrency": offers.priceCurrency || "SOL",
      "availability": offers.availability || "https://schema.org/InStock",
      ...(offers.price !== undefined && { price: offers.price }),
      ...(offers.url && { url: offers.url }),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * CrowdfundingCampaign Schema for campaign pages
 * Uses Organization + Offer as fallback since CrowdfundingCampaign is not standard Schema.org
 */
export function CrowdfundingCampaignSchema({
  name,
  description,
  url,
  image,
  fundingGoal,
  amountRaised,
  backersCount,
  deadline,
  creator,
  category,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  fundingGoal?: number;
  amountRaised?: number;
  backersCount?: number;
  deadline?: string;
  creator?: {
    name: string;
    url?: string;
  };
  category?: string;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description || siteConfig.description,
    "url": url,
    "image": image || siteConfig.ogImage,
    ...(category && { "category": category }),
  };

  // Add Offer for funding details
  if (fundingGoal !== undefined || amountRaised !== undefined) {
    schema.makesOffer = {
      "@type": "Offer",
      "priceCurrency": "SOL",
      ...(fundingGoal !== undefined && { "price": fundingGoal }),
      "availability": "https://schema.org/PreOrder",
      "url": url,
    };

    // Add aggregate data
    if (amountRaised !== undefined || backersCount !== undefined) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ...(amountRaised !== undefined && { "ratingValue": amountRaised }),
        ...(backersCount !== undefined && { "reviewCount": backersCount }),
      };
    }
  }

  if (deadline) {
    schema.foundingDate = deadline;
  }

  if (creator) {
    schema.founder = {
      "@type": "Person",
      "name": creator.name,
      ...(creator.url && { "url": creator.url }),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Person Schema for profile pages
 * Boosts trust + Knowledge Graph eligibility
 */
export function PersonSchema({
  name,
  description,
  url,
  image,
  sameAs,
  jobTitle,
  worksFor,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
  worksFor?: {
    name: string;
    url?: string;
  };
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": url,
    ...(description && { "description": description }),
    ...(image && { "image": image }),
    ...(sameAs && sameAs.length > 0 && { "sameAs": sameAs }),
    ...(jobTitle && { "jobTitle": jobTitle }),
  };

  if (worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      "name": worksFor.name,
      ...(worksFor.url && { "url": worksFor.url }),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

