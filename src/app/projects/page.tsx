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

const featuredProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
    image: "/modern-ecommerce-dashboard.png",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com/username/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
    category: "Full Stack",
  },
  {
    id: 2,
    title: "Task Management API",
    description:
      "RESTful API built with Express.js and MongoDB. Includes JWT authentication, real-time updates with WebSockets, and comprehensive testing.",
    image: "/api-documentation-interface-dark-theme.jpg",
    technologies: ["Express.js", "MongoDB", "Socket.io", "Jest"],
    github: "https://github.com/username/task-api",
    demo: "https://api-docs.example.com",
    category: "Backend",
  },
  {
    id: 3,
    title: "React Component Library",
    description:
      "Reusable UI component library built with TypeScript and Storybook. Published to npm with comprehensive documentation and testing.",
    image: "/component-library-storybook-interface.jpg",
    technologies: ["React", "TypeScript", "Storybook", "Rollup"],
    github: "https://github.com/username/ui-library",
    demo: "https://storybook.example.com",
    category: "Frontend",
  },
];

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
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          A showcase of applications, tools, and systems I've built using modern
          technologies
        </p>
      </div>

      {/* Featured Projects */}
      <section className="mt-16">
        <h2 className="text-2xl font-light tracking-tight text-foreground mb-8">
          Featured Work
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border-border transition-all hover:shadow-lg"
            >
              <div className="aspect-[5/3] overflow-hidden bg-muted">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent">
                    {project.category}
                  </span>
                  <div className="flex gap-2">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View live demo</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {project.title}
                </h3>
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

      {/* Other Projects */}
      <section className="mt-24">
        <h2 className="text-2xl font-light tracking-tight text-foreground mb-8">
          Other Projects
        </h2>
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
