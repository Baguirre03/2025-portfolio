import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  Code2,
  Database,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const otherProjects = [
  {
    title: "Weather Dashboard",
    description:
      "Real-time weather application with location-based forecasts and interactive maps.",
    technologies: ["Vue.js", "OpenWeather API", "Mapbox"],
    github: "https://github.com/username/weather-app",
    icon: Globe,
  },
  {
    title: "Mobile Expense Tracker",
    description:
      "React Native app for tracking expenses with offline support and data visualization.",
    technologies: ["React Native", "SQLite", "Chart.js"],
    github: "https://github.com/username/expense-tracker",
    icon: Smartphone,
  },
  {
    title: "Database Migration Tool",
    description:
      "CLI tool for managing database schema migrations across different environments.",
    technologies: ["Python", "SQLAlchemy", "Click"],
    github: "https://github.com/username/migration-tool",
    icon: Database,
  },
  {
    title: "Code Review Bot",
    description:
      "GitHub bot that automatically reviews pull requests and suggests improvements.",
    technologies: ["Node.js", "GitHub API", "OpenAI"],
    github: "https://github.com/username/review-bot",
    icon: Code2,
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          Projects
        </h1>
      </div>

      {/* Other Projects */}
      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <Card
              key={index}
              className="group border-border transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <project.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">
                      {project.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">View source code</span>
                    </Link>
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
