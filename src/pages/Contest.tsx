import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Concours Exclusifs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participez à nos concours et gagnez des prix exceptionnels. Une expérience unique vous attend !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="glass-card transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Trophy className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Prix Exclusifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Des récompenses uniques et prestigieuses à gagner chaque mois.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Gift className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Participation Simple</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un processus de participation rapide et facile pour tous.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Communauté Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Rejoignez une communauté dynamique de participants passionnés.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="text-3xl font-bold">
                Comment Participer ?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">1. Inscrivez-vous</h3>
                    <p className="text-gray-600">Créez votre compte en quelques clics</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">2. Choisissez un Concours</h3>
                    <p className="text-gray-600">Sélectionnez le concours qui vous intéresse</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">3. Participez</h3>
                    <p className="text-gray-600">Répondez aux questions et validez votre participation</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
                  onClick={() => navigate("/admin")}
                >
                  Commencer Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contest;