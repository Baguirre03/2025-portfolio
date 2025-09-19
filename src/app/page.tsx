import Image from "next/image";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden gap-5">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl mb-8">
          I like building tools that make people&apos;s lives easier
        </h1>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-medium tracking-tight text-foreground mb-4">
            About Me
          </h2>
          <h3 className="text-xl font-medium text-foreground mb-3">
            What I do
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            I'm a software engineer who enjoys creating web applications and
            solving interesting problems with code. Currently working with
            React, TypeScript, and Node.js.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3">
            Outside of code
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            When I'm not coding, you'll find me taking photos, reading, or
            exploring new places. These experiences continuously inform and
            inspire my work.
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-medium tracking-tight text-foreground mb-4">
          Recent Blog Posts
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer">
              Building Better React Components with TypeScript
            </h3>
            <div className="w-full h-px bg-muted mt-2"></div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer">
              My Journey into Photography and Code
            </h3>
            <div className="w-full h-px bg-muted mt-2"></div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer">
              Why I Choose Simplicity in Design
            </h3>
            <div className="w-full h-px bg-muted mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
