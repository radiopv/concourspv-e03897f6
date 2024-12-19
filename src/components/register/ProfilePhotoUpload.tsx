import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const ProfilePhotoUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo de profil
      </label>
      <div className="mt-1 flex items-center justify-center">
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Aperçu"
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Télécharger une photo de profil"
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Cliquez pour télécharger une photo
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;