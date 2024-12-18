import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";

export const SharingPreferences = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        Préférences de partage
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="share-scores">Partager mes scores</Label>
          <Switch id="share-scores" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="share-achievements">Partager mes réussites</Label>
          <Switch id="share-achievements" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="public-profile">Profil public</Label>
          <Switch id="public-profile" />
        </div>
      </div>
    </div>
  );
};