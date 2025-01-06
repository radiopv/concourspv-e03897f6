import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send } from "lucide-react";

export const EmailManager = () => {
  const [testEmail, setTestEmail] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const { toast } = useToast();
  const { 
    sendWelcomeEmail, 
    sendParticipationConfirmation, 
    sendWinnerAnnouncement,
    sendContestReminder 
  } = useNotifications();

  const handleSendTestEmail = async (type: string) => {
    try {
      switch (type) {
        case "welcome":
          await sendWelcomeEmail(testEmail, "Test User");
          break;
        case "participation":
          await sendParticipationConfirmation(testEmail, "Test Contest");
          break;
        case "winner":
          await sendWinnerAnnouncement(testEmail, "Test Contest");
          break;
        case "reminder":
          await sendContestReminder(testEmail, "Test Contest", new Date().toISOString());
          break;
        case "custom":
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: [testEmail],
              subject: customSubject,
              html: customContent,
            }),
          });
          break;
      }

      toast({
        title: "Email envoyé",
        description: `Email de test envoyé à ${testEmail}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Vérifiez les logs pour plus de détails.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          Gestion des Emails
        </CardTitle>
        <CardDescription>
          Testez l'envoi des différents types d'emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Email de test"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
          </div>

          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="custom">Email Personnalisé</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSendTestEmail("welcome")}
                  disabled={!testEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Email de Bienvenue
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSendTestEmail("participation")}
                  disabled={!testEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Confirmation Participation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSendTestEmail("winner")}
                  disabled={!testEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Annonce Gagnant
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSendTestEmail("reminder")}
                  disabled={!testEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Rappel Concours
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Input
                placeholder="Sujet de l'email"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
              <Textarea
                placeholder="Contenu HTML de l'email"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="min-h-[200px]"
              />
              <Button
                className="w-full"
                onClick={() => handleSendTestEmail("custom")}
                disabled={!testEmail || !customSubject || !customContent}
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer l'email personnalisé
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};