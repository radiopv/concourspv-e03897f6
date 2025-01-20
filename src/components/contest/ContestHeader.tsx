import React from 'react';
import PageMetadata from '../seo/PageMetadata';

interface ContestHeaderProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

const ContestHeader = ({ title, description, imageUrl }: ContestHeaderProps) => {
  const pageUrl = window.location.href;
  const defaultDescription = `Participez au concours ${title} et gagnez des prix exceptionnels !`;
  const finalDescription = description || defaultDescription;

  return (
    <>
      <PageMetadata
        title={`${title} | Concours`}
        description={finalDescription}
        imageUrl={imageUrl}
        pageUrl={pageUrl}
      />

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