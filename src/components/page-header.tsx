import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-hero-glow">
      <div className="px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
            )}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
