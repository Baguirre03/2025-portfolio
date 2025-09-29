import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, Code2, Globe } from "lucide-react";
import Link from "next/link";

const otherProjects = [
  {
    title: "Google Calendar Events",
    description:
      "Raycast extension that creates events using natural language for your Google Calendar in Raycast",
    technologies: ["Google Calendar API, Typescript, React"],
    github:
      "https://github.com/raycast/extensions/tree/6fd6ba36635a74edef87c06c5bd33049e697218e/extensions/google-calendar-quickadd/",
    live: "https://www.raycast.com/ben_aguirre/google-calendar-quickadd",
    icon: Globe,
  },
  {
    title: "Advent of Code 2024",
    description: "My solutions to Advent of Code 2024 using JavaScript  ",
    technologies: ["JavaScript"],
    github: "https://github.com/Baguirre03/Advent_of_code_2024",
    icon: Code2,
  },
  {
    title: "Old Portfolio",
    description: "My old portfolio!",
    technologies: ["React, JavaScript, Tailwind CSS"],
    github: "https://github.com/Baguirre03/portfolio2/tree/main",
    live: "https://benaguirre.netlify.app/",
    icon: Code2,
  },
  {
    title: "Full Stack Blog Project",
    description:
      "A full stack blog project using Next.js, Tailwind CSS, Express, and MongoDB",
    technologies: ["React, Node.js, Express, MongoDB"],
    github: "https://github.com/Baguirre03/blog",
    live: "https://top-blog-ba.netlify.app/",
    icon: Code2,
  },
  {
    title: "Members Only",
    description:
      "A members only club using Node.js, MongoDB, Express.js, and Passport.js which shows messages in real time and focuses on authentication and authorization",
    technologies: ["Node.js, MongoDB, Express.js, Passport.js"],
    github: "https://github.com/Baguirre03/members-only?tab=readme-ov-file",
    live: "https://members-only-top.fly.dev/",
    icon: Code2,
  },
  {
    title: "Advent of Code 2023",
    description: "My solutions to Advent of Code 2023 using JavaScript",
    technologies: ["JavaScript"],
    github: "https://github.com/Baguirre03/advent-of-code",
    icon: Code2,
  },
  {
    title: "TDD Shopping Cart",
    description:
      "A shopping cart using TDD with Jest and React Testing Library",
    technologies: ["React, Jest, React Testing Library"],
    github: "https://github.com/Baguirre03/shopping-cart",
    live: "https://the-super-cool-shop.netlify.app/",
    icon: Code2,
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-5 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          Projects
        </h1>
      </div>

      {/* Other Projects */}
      <section className="mt-10">
        <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <Card
              key={index}
              className="group h-full border-border transition-all hover:shadow-md"
            >
              <CardContent className="flex h-full flex-col p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                      <project.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <h3 className="text-base font-medium text-foreground">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 px-2"
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
                    {project.live && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open live site</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex-1" />
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-muted py-0.5 text-xs font-medium text-foreground"
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
