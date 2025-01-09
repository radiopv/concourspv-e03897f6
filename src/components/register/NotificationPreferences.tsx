import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

export const NotificationPreferences = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Préférences de notification
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notif">Notifications par email</Label>
          <Switch id="email-notif" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="new-contests">Nouveaux concours</Label>
          <Switch id="new-contests" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="reminders">Rappels de participation</Label>
          <Switch id="reminders" defaultChecked />
        </div>
      </div>
    </div>
  );
};