import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, MapPin } from "lucide-react";

interface ProfileFormProps {
  formData: {
    facebook_profile_url: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    bio: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
}

export const ProfileForm = ({ formData, setFormData, isEditing }: ProfileFormProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facebook">Profil Facebook</Label>
          <div className="flex gap-2">
            <Facebook className="w-5 h-5 text-blue-600" />
            <Input
              id="facebook"
              value={formData.facebook_profile_url}
              onChange={(e) => setFormData({ ...formData, facebook_profile_url: e.target.value })}
              disabled={!isEditing}
              placeholder="URL de votre profil Facebook"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            placeholder="Parlez-nous un peu de vous..."
            className="h-32"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Adresse
          </Label>
          <Input
            value={formData.street_address}
            onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
            disabled={!isEditing}
            placeholder="Numéro et rue"
            className="mb-2"
          />
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            disabled={!isEditing}
            placeholder="Ville"
            className="mb-2"
          />
          <Input
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            disabled={!isEditing}
            placeholder="Code postal"
            className="mb-2"
          />
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            disabled={!isEditing}
            placeholder="Pays"
          />
        </div>
      </div>
    </div>
  );
};