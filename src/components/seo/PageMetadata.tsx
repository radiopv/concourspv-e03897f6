import React from 'react';
import { Helmet } from 'react-helmet';

interface PageMetadataProps {
  title: string;
  description: string;
  imageUrl?: string;
  pageUrl: string;
  siteName?: string;
  type?: string;
  author?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  locale?: string;
  priceAmount?: number;
  priceCurrency?: string;
}

const PageMetadata = ({ 
  title, 
  description, 
  imageUrl, 
  pageUrl,
  siteName = "Concours en ligne",
  type = "website",
  author = "Concours en ligne",
  keywords = [],
  publishedTime,
  modifiedTime,
  section = "Concours",
  locale = "fr_FR",
  priceAmount,
  priceCurrency = "CAD"
}: PageMetadataProps) => {
  const defaultKeywords = [
    "concours en ligne",
    "jeux concours",
    "gagner des prix",
    "concours gratuit",
    "participation concours",
    "prix à gagner",
    "tirage au sort"
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={pageUrl} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}
      <meta property="fb:app_id" content="1234567890" /> {/* Replace with your actual Facebook App ID */}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      
      {/* Article Specific (if type is article) */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content={section} />
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Product Specific (if price is available) */}
      {priceAmount && (
        <>
          <meta property="product:price:amount" content={priceAmount.toString()} />
          <meta property="product:price:currency" content={priceCurrency} />
        </>
      )}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebPage',
          "headline": title,
          "description": description,
          "image": imageUrl,
          "url": pageUrl,
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": "https://votre-site.com/logo.png" // Remplacer par votre logo
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": pageUrl
          }
        })}
      </script>
    </Helmet>
  );
};

export default PageMetadata;