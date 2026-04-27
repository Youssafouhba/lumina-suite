import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  AlertTriangle,
  Inbox,
  Map,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Patrimoine", url: "/patrimoine", icon: Building2 },
  { title: "Locataires", url: "/locataires", icon: Users },
  { title: "Baux & Contrats", url: "/baux", icon: FileText },
  { title: "Finances", url: "/finances", icon: Wallet },
  { title: "Impayés", url: "/impayes", icon: AlertTriangle },
];

const toolsItems = [
  { title: "Boîte unifiée", url: "/inbox", icon: Inbox, badge: "12" },
  { title: "Cartographie", url: "/carte", icon: Map },
  { title: "Configuration", url: "/configuration", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const linkClass =
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm";

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent shadow-glow">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-sidebar-foreground">Estala</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Property Suite</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
            Pilotage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
            Outils
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent/60 transition-colors">
          <Avatar className="h-8 w-8 ring-2 ring-sidebar-accent">
            <AvatarFallback className="bg-gradient-accent text-accent-foreground text-xs font-semibold">CM</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Camille Moreau</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Super Admin</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
