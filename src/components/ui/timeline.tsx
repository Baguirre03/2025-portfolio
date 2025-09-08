import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status?: "completed" | "in-progress" | "upcoming";
  tags?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Timeline line */}
          {index < items.length - 1 && (
            <div className="absolute left-4 top-12 w-px h-16 bg-border" />
          )}

          <div className="flex gap-4">
            {/* Timeline dot */}
            <div
              className={`
              relative z-10 w-8 h-8 rounded-full border-2 border-background shadow-sm
              ${
                item.status === "completed"
                  ? "bg-green-500"
                  : item.status === "in-progress"
                  ? "bg-blue-500"
                  : "bg-muted"
              }
            `}
            />

            {/* Content */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.date}
                    </CardDescription>
                  </div>
                  {item.status && (
                    <Badge
                      variant={
                        item.status === "completed"
                          ? "default"
                          : item.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.status.replace("-", " ")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-3">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
