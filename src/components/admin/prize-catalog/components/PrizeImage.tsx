interface PrizeImageProps {
  imageUrl?: string;
  altText: string;
  children?: React.ReactNode;
}

export const PrizeImage = ({ imageUrl, altText, children }: PrizeImageProps) => {
  return (
    <div className="aspect-square relative mb-4">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className="object-cover rounded-lg w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          Aucune image
        </div>
      )}
      {children}
    </div>
  );
};