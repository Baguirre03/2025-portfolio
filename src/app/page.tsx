"use client";

import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-10 flex flex-col justify-center overflow-hidden gap-5">
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
            Graduating this semester, with a Bachelor&apos;s degree in marketing
            and a minor in computer science.
          </p>

          <h3 className="text-xl font-medium text-foreground mb-3">
            Outside of pogramming
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Im usually taking photos, reading, playing chess, and exploring new
            places. I am always learning something new and enjoy finding new
            hobbies.
          </p>
          <div className="mt-8">
            <button
              onClick={() => setIsTimelineOpen(!isTimelineOpen)}
              className="flex items-center gap-2 text-xl font-medium text-foreground hover:text-primary transition-colors mb-3 group"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isTimelineOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Experience
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isTimelineOpen
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ol className="relative border-l border-border ml-2 pl-6 space-y-6">
                {/* Experience 1 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      May 2025 - Aug. 2025
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <Image
                        src="/images/pinterest.svg"
                        alt="Pinterest logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded"
                      />
                      <h4 className="text-lg font-semibold text-foreground">
                        Pinterest | Software Engineering Intern
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Data Engineering Organization • Built internal chatbot
                      tool using Langchain, Python, TypeScript, and React.
                    </p>
                  </div>
                </li>
                {/* Experience 2 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      Nov. 2022 - Present
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src="/images/top.png"
                        alt="The Odin Project logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded mix-blend-multiply"
                      />
                      <h4 className="text-lg font-semibold text-foreground">
                        The Odin Project | Open Source Contributor
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      University Marketing Dept. • Managed digital campaigns,
                      analyzed engagement data, and supported event planning.
                    </p>
                  </div>
                </li>
                {/* Experience 3 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      Oct. 2024 - Nov. 2024
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src="/images/bloomberg.png"
                        alt="Bloomberg logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded"
                      />
                      <h4 className="text-lg font-semibold text-foreground">
                        ColorStack X Bloomberg | Open Source Contributor
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Bloomberg X ColorStack mentorship program • Collaborated
                      with a Bloomberg Engineer on an open-source development
                      feature for ColorStack&apos;s Oyster project.
                    </p>
                  </div>
                </li>
                {/* Experience 4 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      May 2024 - Aug. 2024
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src="/images/atlassian.svg"
                        alt="Atlassian logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded"
                      />
                      <h4 className="text-lg font-semibold text-foreground">
                        Atlassian | Brand Marketing Intern
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Wrote docs for the &quot;Impossible Alone&quot; campaign,
                      created inclusive language guidance, and improved brand
                      visibility through optimized search titles.
                    </p>
                  </div>
                </li>
                {/* Experience 5 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      May 2023 - Aug. 2023
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src="/images/skillsoft.jpeg"
                        alt="Skillsoft logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded"
                      />
                      <h4 className="text-lg font-semibold text-foreground">
                        Skillsoft | Digital Marketing Intern
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Conducted in-depth SEO research to improve keyword
                      rankings for new and existing content. Led the launch of a
                      new sustainability product.
                    </p>
                  </div>
                </li>
                {/* Experience 6 */}
                <li className="ml-2 group">
                  <div className="pb-2">
                    <span className="text-sm font-medium text-primary">
                      Aug. 2022 - Jan. 2023
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-accent-foreground text-xs font-bold">
                        N
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        NockNock | Growth and Operations Intern
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Produced 11 Instagram reels (205k+ views), grew Instagram
                      to 5,800 followers, and built relationships with 80+
                      potential clients through social media engagement.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-medium tracking-tight text-foreground mb-4">
          Recent Blog Posts
        </h2>
        <div className="space-y-3">
          <div className="group">
            <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors cursor-pointer py-2">
              Building Better React Components with TypeScript
            </h3>
            <div className="w-full h-px bg-border group-hover:bg-primary/30 transition-colors"></div>
          </div>
          <div className="group">
            <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors cursor-pointer py-2">
              My Journey into Photography and Code
            </h3>
            <div className="w-full h-px bg-border group-hover:bg-primary/30 transition-colors"></div>
          </div>
          <div className="group">
            <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors cursor-pointer py-2">
              Why I Choose Simplicity in Design
            </h3>
            <div className="w-full h-px bg-border group-hover:bg-primary/30 transition-colors"></div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-medium tracking-tight text-foreground mb-4">
          Photos
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
