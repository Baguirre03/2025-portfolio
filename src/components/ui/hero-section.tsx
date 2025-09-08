import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface HeroSectionProps {
  name: string;
  description: string;
  skills?: string[];
}

export function HeroSection({
  name,
  description,
  skills = [],
}: HeroSectionProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted">
      <CardContent className="p-12 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Hello, I'm {name}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="shadow-lg">
            <Link href="/about">Learn More About Me</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">Read My Blog</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
