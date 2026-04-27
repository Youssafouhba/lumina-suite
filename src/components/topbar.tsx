import { Bell, Search, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative hidden md:block flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un immeuble, locataire, bail…"
          className="h-9 pl-9 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-border"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button size="sm" className="hidden sm:inline-flex h-9 gap-1.5 bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95">
          <Plus className="h-4 w-4" />
          Nouveau
        </Button>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-[1.15rem] w-[1.15rem]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
