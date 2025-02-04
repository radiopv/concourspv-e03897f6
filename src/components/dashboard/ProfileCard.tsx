import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface ProfileCardProps {
  userId: string;
}

const ProfileCard = ({ userId }: ProfileCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    street_address: '',
    city: '',
    postal_code: '',
    country: 'France'
  });

  const { data: userProfile, isLoading, refetch } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      console.log('User profile data:', data);
      return data;
    },
    enabled: !!userId
  });

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone_number: userProfile.phone_number || '',
        street_address: userProfile.street_address || '',
        city: userProfile.city || '',
        postal_code: userProfile.postal_code || '',
        country: userProfile.country || 'France'
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    try {
      if (!userId) {
        throw new Error("ID utilisateur manquant");
      }

      const { error: dbError } = await supabase
        .from("members")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          street_address: formData.street_address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country
        })
        .eq("id", userId);

      if (dbError) throw dbError;

      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Mon profil</CardTitle>
        <CardDescription>Gérez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.street_address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, street_address: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  if (userProfile) {
                    setFormData({
                      first_name: userProfile.first_name || '',
                      last_name: userProfile.last_name || '',
                      email: userProfile.email || '',
                      phone_number: userProfile.phone_number || '',
                      street_address: userProfile.street_address || '',
                      city: userProfile.city || '',
                      postal_code: userProfile.postal_code || '',
                      country: userProfile.country || 'France'
                    });
                  }
                }}>
                  Annuler
                </Button>
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;