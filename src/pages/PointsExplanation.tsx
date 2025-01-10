import React from 'react';
import { Helmet } from 'react-helmet';
import { Star, TrendingUp, BookOpen, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PointsExplanation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <Helmet>
        <title>Système de Points | Comprendre la progression</title>
        <meta name="description" content="Découvrez comment gagner des points et progresser dans notre système de rangs cubains." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Comment Progresser et Gagner des Points
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez notre système de progression inspiré de la culture cubaine !
            </p>
          </div>

          {/* Points de base et bonus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                Points et Bonus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Points de base
                  </h3>
                  <p className="text-gray-600">1 point par bonne réponse</p>
                </div>
                <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Bonus de série
                  </h3>
                  <p className="text-gray-600">+2 points tous les 3 bonnes réponses consécutives</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Bonus quotidien
                </h3>
                <p className="text-gray-600">
                  +5 points pour votre première participation de la journée !
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Importance des articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                L'importance de la lecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Chaque article est soigneusement sélectionné pour enrichir vos connaissances sur Cuba.
                  Une lecture attentive vous permettra de :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Augmenter vos chances de bonnes réponses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Maintenir des séries plus longues pour plus de bonus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Découvrir la riche culture cubaine</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    Conseil : Prenez le temps de lire chaque article avant de répondre aux questions.
                    Une bonne compréhension est la clé du succès !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participations bonus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                Participations Supplémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Tous les 50 points cumulés, vous gagnez une participation supplémentaire aux concours !
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="font-semibold text-purple-700">50 points</p>
                    <p className="text-sm text-purple-600">1 participation bonus</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="font-semibold text-purple-700">100 points</p>
                    <p className="text-sm text-purple-600">2 participations bonus</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="font-semibold text-purple-700">150 points</p>
                    <p className="text-sm text-purple-600">3 participations bonus</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PointsExplanation;