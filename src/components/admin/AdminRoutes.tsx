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

const AdminRoutes = () => {
  const { contestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Protect admin routes
  useEffect(() => {
    if (!user || user.email !== "renaudcanuel@me.com") {
      console.log("Unauthorized access attempt to admin routes");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { data: contest } = useQuery({
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
            status
          )
        `)
        .eq('id', contestId)
        .single();
      
      if (error) {
        console.error("Error fetching contest:", error);
        throw error;
      }
      return data;
    },
    enabled: !!contestId
  });

  if (!user || user.email !== "renaudcanuel@me.com") {
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
          element={contest ? <DrawManager contestId={contestId || ''} contest={contest} /> : null} 
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