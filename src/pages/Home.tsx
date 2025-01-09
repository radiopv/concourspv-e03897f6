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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Bienvenue sur notre Plateforme de Concours
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Participez à des concours passionnants, gagnez des prix exceptionnels et rejoignez une communauté dynamique de participants.
        </p>
        <Button
          onClick={() => navigate('/contests')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
        >
          Je Participe
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Trophy className="w-12 h-12 mx-auto text-indigo-600 mb-2" />
            <CardTitle>Concours Variés</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Des concours pour tous les goûts et tous les niveaux
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Gift className="w-12 h-12 mx-auto text-purple-600 mb-2" />
            <CardTitle>Prix Attractifs</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Gagnez des récompenses exceptionnelles
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 mx-auto text-blue-600 mb-2" />
            <CardTitle>Communauté Active</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Rejoignez une communauté passionnée
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Award className="w-12 h-12 mx-auto text-green-600 mb-2" />
            <CardTitle>Système de Points</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Cumulez des points et débloquez des avantages
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Comment Participer ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-indigo-600">1</div>
            <h3 className="font-semibold mb-2">Inscrivez-vous</h3>
            <p className="text-gray-600">Créez votre compte en quelques clics</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-indigo-600">2</div>
            <h3 className="font-semibold mb-2">Choisissez un Concours</h3>
            <p className="text-gray-600">Sélectionnez le concours qui vous intéresse</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-indigo-600">3</div>
            <h3 className="font-semibold mb-2">Participez</h3>
            <p className="text-gray-600">Répondez aux questions et gagnez des points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;