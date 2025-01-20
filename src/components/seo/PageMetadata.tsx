import React from 'react';
import { Helmet } from 'react-helmet';

interface PageMetadataProps {
  title: string;
  description: string;
  imageUrl?: string;
  pageUrl: string;
  siteName?: string;
  type?: string;
}

const PageMetadata = ({ 
  title, 
  description, 
  imageUrl, 
  pageUrl,
  siteName = "Concours",
  type = "website"
}: PageMetadataProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {/* Autres métadonnées importantes */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
};

export default PageMetadata;