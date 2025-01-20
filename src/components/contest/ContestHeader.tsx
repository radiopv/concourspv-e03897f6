import React from 'react';
import { Helmet } from 'react-helmet';

interface ContestHeaderProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

const ContestHeader = ({ title, description, imageUrl }: ContestHeaderProps) => {
  const siteUrl = window.location.origin;
  const pageUrl = window.location.href;
  const defaultDescription = `Participez au concours ${title} et gagnez des prix exceptionnels !`;
  const finalDescription = description || defaultDescription;

  return (
    <>
      <Helmet>
        <title>{title} | Concours</title>
        <meta name="description" content={finalDescription} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={finalDescription} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Concours" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={finalDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}

        {/* Autres métadonnées importantes */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
        )}
      </div>
    </>
  );
};

export default ContestHeader;