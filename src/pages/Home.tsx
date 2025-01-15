import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-6 drop-shadow-lg">
          Bienvenue aux Concours Passion Varadero
        </h1>
        <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
          Tentez votre chance, participez à nos concours exclusifs et gagnez des cadeaux formidables dans une ambiance festive et chaleureuse.
        </p>
        <Button
          onClick={() => navigate('/contests')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
        >
          Jouer Maintenant 🎲
        </Button>
      </motion.div>

      <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-2xl p-8 mb-12 shadow-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-amber-800 mb-6">
          Comment Participer ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white shadow-lg">1</div>
            <h3 className="font-semibold mb-2 text-amber-800">Inscrivez-vous</h3>
            <p className="text-amber-700">Créez votre compte en quelques clics</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white shadow-lg">2</div>
            <h3 className="font-semibold mb-2 text-amber-800">Choisissez un Concours</h3>
            <p className="text-amber-700">Sélectionnez parmi nos concours exclusifs</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white shadow-lg">3</div>
            <h3 className="font-semibold mb-2 text-amber-800">Tentez votre Chance</h3>
            <p className="text-amber-700">Participez et gagnez des prix incroyables</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;