import { useState } from "react";
import { Send, Paperclip, Phone, Video, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { messages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelIcon: Record<string, string> = { WhatsApp: "💬", Email: "✉️", Appel: "📞", SMS: "📱" };

export default function Inbox() {
  const [active, setActive] = useState(messages[0].id);
  const current = messages.find((m) => m.id === active)!;

  const thread = [
    { from: "them", text: current.preview, time: current.time },
    { from: "me", text: "Bonjour, parfait merci pour votre retour. Je vous tiens informé dès réception du virement.", time: "il y a 5 min" },
    { from: "them", text: "Top, je reste à disposition si besoin de justificatif.", time: "il y a 3 min" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Communication"
        title="Boîte unifiée"
        description="WhatsApp, email, SMS et appels regroupés par contact."
      />

      <div className="p-4 md:p-8">
        <Card className="grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden border-border/60 h-[calc(100vh-260px)] min-h-[520px]">
          {/* Conversations list */}
          <div className="border-b md:border-b-0 md:border-r border-border/60 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur p-3 border-b border-border/60">
              <Input placeholder="Rechercher…" className="h-9 bg-muted/40 border-transparent" />
            </div>
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={cn(
                  "flex w-full items-start gap-3 p-3 text-left transition-colors border-l-2",
                  active === m.id
                    ? "bg-accent/5 border-accent"
                    : "border-transparent hover:bg-muted/40",
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                    {m.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{m.from}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{channelIcon[m.channel]} {m.preview}</p>
                </div>
                {m.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </button>
            ))}
          </div>

          {/* Conversation pane */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                    {current.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{current.from}</p>
                  <p className="text-xs text-muted-foreground truncate">{current.role}</p>
                </div>
                <Badge variant="outline" className="ml-2 text-[10px]">{channelIcon[current.channel]} {current.channel}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {thread.map((t, i) => (
                <div key={i} className={cn("flex", t.from === "me" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      t.from === "me"
                        ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border/60 rounded-bl-md",
                    )}
                  >
                    <p>{t.text}</p>
                    <p className={cn("mt-1 text-[10px]", t.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 p-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9"><Paperclip className="h-4 w-4" /></Button>
                <Input placeholder="Écrire un message…" className="h-9 bg-muted/40 border-transparent" />
                <Button size="icon" className="h-9 w-9 bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
