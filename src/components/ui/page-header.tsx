import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>

      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {description}
        </p>
      )}

      {children && (
        <>
          <Separator className="my-6" />
          {children}
        </>
      )}
    </div>
  );
}
