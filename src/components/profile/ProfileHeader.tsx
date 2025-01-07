import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  userProfile: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ userProfile, onPhotoUpload }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={userProfile.avatar_url} />
        <AvatarFallback className="bg-primary/10">
          {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-4">
        <input
          type="file"
          id="photo"
          accept="image/*"
          className="hidden"
          onChange={onPhotoUpload}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("photo")?.click()}
        >
          <Camera className="w-4 h-4 mr-2" />
          Changer la photo
        </Button>
      </div>
    </div>
  );
};