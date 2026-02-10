"use client";

import { ExternalLink, Github, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
const projects = [
  {
    title: "Advent of Code 2025",
    description: "My solutions to AOC 2025",
    technologies: ["JavaScript", "C++", "Python"],
    github: "https://github.com/Baguirre03/advent-of-code-2025",
  },
  {
    title: "Google Calendar Events - Raycast Extension",
    description:
      "Raycast extension that creates events using natural language for your Google Calendar in Raycast",
    technologies: ["Google Calendar API", "TypeScript", "React"],
    github:
      "https://github.com/raycast/extensions/tree/6fd6ba36635a74edef87c06c5bd33049e697218e/extensions/google-calendar-quickadd/",
    live: "https://www.raycast.com/ben_aguirre/google-calendar-quickadd",
    showInstalls: true,
  },
  {
    title: "Advent of Code 2024",
    description: "My solutions to Advent of Code 2024",
    technologies: ["JavaScript"],
    github: "https://github.com/Baguirre03/Advent_of_code_2024",
  },
  {
    title: "Old Portfolio",
    description: "My old portfolio!",
    technologies: ["React", "JavaScript", "Tailwind CSS"],
    github: "https://github.com/Baguirre03/portfolio2/tree/main",
    live: "https://benaguirre.netlify.app/",
  },
  {
    title: "Advent of Code 2023",
    description: "My solutions to Advent of Code 2023",
    technologies: ["JavaScript"],
    github: "https://github.com/Baguirre03/advent-of-code",
  },
  {
    title: "Full Stack Blog Project",
    description:
      "A full stack blog project using Next.js, Tailwind CSS, Express, and MongoDB",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Baguirre03/blog",
    live: "https://top-blog-ba.netlify.app/",
  },
];

export default function ProjectsPage() {
  const [raycastInstalls, setRaycastInstalls] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/raycast-installs")
      .then((res) => res.json())
      .then((data) => {
        setRaycastInstalls(data.formatted);
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-5 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-medium text-foreground mb-2">
          Projects
        </h1>{" "}
      </div>

      <div className="space-y-8">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group border-b border-border pb-8 last:border-0 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-xl font-medium text-foreground  transition-colors">
                {project.title}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="View source code"
                >
                  <Github className="h-5 w-5" />
                </Link>
                {project.live && (
                  <Link
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Open live site"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.showInstalls && raycastInstalls && (
                <span
                  onClick={() => window.open(project.live, "_blank")}
                  className="hover:cursor-pointer flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 text-primary font-semibold ring-1 ring-primary/20 hover:ring-primary/30 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  {raycastInstalls} Downloads
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
