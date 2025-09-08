import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  tags?: string[];
  featured?: boolean;
}

export function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  slug,
  tags = [],
  featured = false,
}: BlogCardProps) {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${
        featured ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="group-hover:text-primary transition-colors mb-2">
              <Link href={`/blog/${slug}`}>{title}</Link>
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground space-x-2">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <Separator orientation="vertical" className="h-4" />
              <span>{readTime}</span>
            </div>
          </div>
          {featured && <Badge>Featured</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 leading-relaxed">
          {excerpt}
        </CardDescription>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
          <Link href={`/blog/${slug}`}>Read More →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
