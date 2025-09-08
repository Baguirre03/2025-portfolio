import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
  buttonText?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  badge,
  buttonText = "Learn More",
}: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="flex items-center justify-center gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {badge && <Badge variant="outline">{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="mb-6 leading-relaxed">
          {description}
        </CardDescription>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>{buttonText} →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
