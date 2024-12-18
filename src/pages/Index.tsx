import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Participez à nos Concours Exclusifs
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Testez vos connaissances, relevez des défis passionnants et gagnez des prix exceptionnels !
          </p>
          <Button 
            onClick={() => navigate("/contests")}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto animate-pulse"
          >
            Commencer maintenant
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">Participation Simple</h3>
            <p className="text-gray-600">
              Inscrivez-vous en quelques clics et commencez à participer immédiatement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-3">Prix Exceptionnels</h3>
            <p className="text-gray-600">
              Des récompenses uniques à gagner pour les participants qualifiés.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-indigo-600 text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-3">Tirage au Sort</h3>
            <p className="text-gray-600">
              Une chance de gagner parmi tous les participants qualifiés.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;