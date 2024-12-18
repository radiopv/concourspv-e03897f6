import { motion } from "framer-motion";
import { RegisterForm } from "@/components/register/RegisterForm";
import { Trophy, Bell, Share2, Camera } from "lucide-react";

const Register = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Rejoignez notre communauté</h1>
          <p className="text-lg text-gray-600 mb-8">
            Participez à des concours passionnants et gagnez des prix exceptionnels !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Bell className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Notifications personnalisées</h3>
            <p className="text-gray-600">
              Recevez des alertes pour les nouveaux concours et ne manquez aucune opportunité.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Trophy className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tableau des scores</h3>
            <p className="text-gray-600">
              Suivez vos performances et comparez-les avec d'autres participants.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Share2 className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Partage social</h3>
            <p className="text-gray-600">
              Partagez vos victoires et invitez vos amis à participer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Camera className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Profil personnalisé</h3>
            <p className="text-gray-600">
              Ajoutez votre photo et personnalisez votre profil de participant.
            </p>
          </motion.div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;