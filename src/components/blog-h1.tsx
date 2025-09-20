import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogH1Props {
  title: string;
  index?: number; // set -1 to hide divider
  href?: string; // optional link target
  size?: "sm" | "lg"; // lg for blog page listing
  highlight?: boolean; // optional highlight (e.g., first item)
}

export function BlogH1({
  title,
  index,
  href,
  size = "sm",
  highlight = false,
}: BlogH1Props) {
  const headingClasses = cn(
    "font-medium text-foreground hover:text-primary transition-colors cursor-pointer py-2",
    size === "lg" ? "text-2xl sm:text-3xl" : "text-lg",
    highlight && "text-primary"
  );

  const Heading = <h2 className={headingClasses}>{title}</h2>;

  return (
    <div className="group">
      {href ? <Link href={href}>{Heading}</Link> : Heading}
      {index !== -1 && (
        <div className="w-full h-px bg-border group-hover:bg-primary/30 transition-colors"></div>
      )}
    </div>
  );
}
