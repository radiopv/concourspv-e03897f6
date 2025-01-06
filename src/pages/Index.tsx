import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Trophy, Users, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      const [contestsResponse, participantsResponse, prizesResponse] = await Promise.all([
        supabase.from('contests').select('*', { count: 'exact', head: true }),
        supabase.from('participants').select('*', { count: 'exact', head: true }),
        supabase.from('prizes').select('*', { count: 'exact', head: true })
      ]);

      return {
        contests: contestsResponse.count || 0,
        participants: participantsResponse.count || 0,
        prizes: prizesResponse.count || 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            La Plateforme de Concours Interactive
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Participez à nos concours exclusifs, testez vos connaissances et gagnez des prix exceptionnels !
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate("/contests")}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
            >
              Voir les concours
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto border-2"
            >
              S'inscrire gratuitement
            </Button>
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-2" />
              <CardTitle className="text-2xl">{isLoading ? "..." : stats?.contests || 0}</CardTitle>
              <p className="text-gray-600">Concours Actifs</p>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-indigo-500 mb-2" />
              <CardTitle className="text-2xl">{isLoading ? "..." : stats?.participants || 0}</CardTitle>
              <p className="text-gray-600">Participants</p>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Award className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-2xl">{isLoading ? "..." : stats?.prizes || 0}</CardTitle>
              <p className="text-gray-600">Prix à Gagner</p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Participation Simple</h3>
            <p className="text-gray-600">
              Inscrivez-vous en quelques clics et commencez à participer immédiatement à nos concours thématiques.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-3">Prix Exceptionnels</h3>
            <p className="text-gray-600">
              Des récompenses uniques et des prix exclusifs à gagner pour les participants qualifiés.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-3">Tirages Équitables</h3>
            <p className="text-gray-600">
              Un système de tirage au sort transparent parmi tous les participants qualifiés.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-20 bg-gradient-to-r from-indigo-100 to-purple-100 p-12 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Prêt à Relever le Défi ?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez notre communauté et participez à des concours passionnants dès aujourd'hui !
          </p>
          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Commencer l'aventure
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;