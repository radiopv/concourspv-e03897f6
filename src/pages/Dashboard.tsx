import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import { ExtendedProfileCard } from "@/components/profile/ExtendedProfileCard";
import QuickActions from "@/components/dashboard/QuickActions";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log("Fetching user profile for ID:", user.id);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Fetched profile:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    }
  }, [user, navigate]);

  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Une erreur est survenue</h1>
          <p className="text-gray-600 mt-2">Impossible de charger votre profil</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <DashboardHeader firstName={userProfile?.first_name} />
      <StatsCards stats={userProfile} />
      <ExtendedProfileCard userProfile={userProfile} onUpdate={refetch} />
      <QuickActions />
    </div>
  );
};

export default Dashboard;