import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Gift, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          Bienvenue au Casino des Concours
        </h1>
        <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
          Tentez votre chance, participez à nos concours exclusifs et remportez des prix exceptionnels dans une ambiance festive et chaleureuse.
        </p>
        <Button
          onClick={() => navigate('/contests')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
        >
          Jouer Maintenant 🎲
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-xl bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm border border-amber-200/20 shadow-xl"
        >
          <CardHeader className="text-center">
            <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-2" />
            <CardTitle className="text-amber-800">Concours Exclusifs</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-amber-700">
            Des concours uniques avec des lots prestigieux
          </CardContent>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-xl bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-sm border border-orange-200/20 shadow-xl"
        >
          <CardHeader className="text-center">
            <Gift className="w-12 h-12 mx-auto text-orange-500 mb-2" />
            <CardTitle className="text-orange-800">Prix Luxueux</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-orange-700">
            Des récompenses qui font rêver
          </CardContent>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-xl bg-gradient-to-br from-white/80 to-yellow-50/80 backdrop-blur-sm border border-yellow-200/20 shadow-xl"
        >
          <CardHeader className="text-center">
            <Users className="w-12 h-12 mx-auto text-yellow-600 mb-2" />
            <CardTitle className="text-yellow-800">Club VIP</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-yellow-700">
            Rejoignez une communauté exclusive
          </CardContent>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-xl bg-gradient-to-br from-white/80 to-rose-50/80 backdrop-blur-sm border border-rose-200/20 shadow-xl"
        >
          <CardHeader className="text-center">
            <Award className="w-12 h-12 mx-auto text-rose-500 mb-2" />
            <CardTitle className="text-rose-800">Points Bonus</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-rose-700">
            Cumulez des points et débloquez des avantages
          </CardContent>
        </motion.div>
      </div>

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
            <p className="text-amber-700">Créez votre compte VIP en quelques clics</p>
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