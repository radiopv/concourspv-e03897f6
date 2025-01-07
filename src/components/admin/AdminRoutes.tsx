import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminContestManager from "./AdminContestManager";
import QuestionBank from "../../pages/QuestionBank";
import PrizeCatalogManager from "./prize-catalog/PrizeCatalogManager";
import ParticipantsList from "./ParticipantsList";
import DrawManager from "./DrawManager";
import Winners from "../../pages/Winners";
import GlobalSettings from "./GlobalSettings";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Participant, ParticipantStatus } from "@/types/participant";

interface ContestWithParticipants {
  title: string;
  participants: Participant[];
}

const AdminRoutes = () => {
  const { contestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log("Checking admin access for user:", user?.email);
      
      if (!user) {
        console.log("No user found, redirecting to login");
        toast({
          title: "Accès refusé",
          description: "Veuillez vous connecter",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (user.email !== "renaudcanuel@me.com") {
        console.log("Non-admin user detected, redirecting");
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      console.log("Admin access granted");
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  const { data: contest, isLoading: isContestLoading } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) return null;
      console.log("Fetching contest data for:", contestId);
      
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants (
            id,
            first_name,
            last_name,
            email,
            score,
            status,
            created_at,
            contest_id
          )
        `)
        .eq('id', contestId)
        .single();
      
      if (error) {
        console.error("Error fetching contest:", error);
        throw error;
      }
      
      // Cast the status to ensure type safety
      const participantsWithCorrectStatus = data.participants?.map(p => ({
        ...p,
        status: p.status as ParticipantStatus
      })) || [];
      
      const contestWithParticipants: ContestWithParticipants = {
        title: data.title,
        participants: participantsWithCorrectStatus
      };
      
      console.log("Contest data fetched:", contestWithParticipants);
      return contestWithParticipants;
    },
    enabled: !!contestId && !!user
  });

  if (!user || user.email !== "renaudcanuel@me.com") {
    console.log("User not authorized for admin routes");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-8">
        <ul className="flex space-x-4 overflow-x-auto pb-4">
          <li>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link
              to="/admin/contests"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Concours
            </Link>
          </li>
          <li>
            <Link
              to="/admin/questions"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Banque de questions
            </Link>
          </li>
          <li>
            <Link
              to="/admin/prizes"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Catalogue des prix
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Paramètres
            </Link>
          </li>
          {contestId && (
            <>
              <li>
                <Link
                  to={`/admin/contests/${contestId}/participants`}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Participants
                </Link>
              </li>
              <li>
                <Link
                  to={`/admin/contests/${contestId}/draw`}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Tirage
                </Link>
              </li>
              <li>
                <Link
                  to={`/admin/contests/${contestId}/winners`}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Gagnants
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="contests" element={<AdminContestManager />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="prizes" element={<PrizeCatalogManager />} />
        <Route path="settings" element={<GlobalSettings />} />
        <Route 
          path="contests/:contestId/participants" 
          element={<ParticipantsList />} 
        />
        <Route 
          path="contests/:contestId/draw" 
          element={
            isContestLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : contest ? (
              <DrawManager contestId={contestId || ''} contest={contest} />
            ) : (
              <div className="text-center p-4 text-gray-500">
                Aucune donnée de concours disponible
              </div>
            )
          } 
        />
        <Route 
          path="contests/:contestId/winners" 
          element={<Winners />} 
        />
      </Routes>
    </div>
  );
};

export default AdminRoutes;