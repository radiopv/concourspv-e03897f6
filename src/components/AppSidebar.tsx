import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Trophy, LayoutDashboard, Settings, Users, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const isAdmin = session?.user?.email === "renaudcanuel@me.com";

  const userMenuItems = [
    {
      title: "Accueil",
      url: "/",
      icon: Home,
    },
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Concours",
      url: "/contests",
      icon: Trophy,
    },
  ];

  const adminMenuItems = [
    {
      title: "Administration",
      url: "/admin",
      icon: Settings,
    },
    {
      title: "Participants",
      url: "/admin/participants",
      icon: Users,
    },
    {
      title: "Prix",
      url: "/admin/prizes",
      icon: Gift,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => navigate(item.url)}>
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}