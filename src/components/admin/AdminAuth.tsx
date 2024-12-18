import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === "renaudcanuel@me.com") {
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminEmail", email);
      onAuthenticated();
      toast({
        title: "Succès",
        description: "Vous êtes maintenant connecté",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Email non autorisé",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Connexion Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;