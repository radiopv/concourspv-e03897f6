import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Settings, Trophy, Users } from "lucide-react";

const QuickActions = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Mes Concours</CardTitle>
          <CardDescription>
            Voir tous les concours disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/contests">
            <Button className="w-full">
              <Trophy className="w-4 h-4 mr-2" />
              Voir les concours
            </Button>
          </Link>
        </CardContent>
      </Card>

      {isAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>
                Gérer les concours et les participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Espace Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Gérer les participants aux concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/participants">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les participants
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QuickActions;