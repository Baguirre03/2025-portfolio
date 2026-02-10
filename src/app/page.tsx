"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Code,
  FileText,
  Terminal,
  Globe,
  Linkedin,
  Github,
  Mail,
  BookOpen,
  Film,
} from "lucide-react";
import { BlogH1 } from "@/components/blog-h1";

type RecentPost = { slug: string; title: string };
type Book = {
  title: string;
  author: string;
  link: string;
  imageUrl?: string;
  readAt?: string;
};
type Movie = {
  title: string;
  year?: string;
  link: string;
  watchedDate?: string;
  rating?: string;
  imageUrl?: string;
};

export default function HomePage() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [isBlogOpen, setIsBlogOpen] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [isMediaOpen, setIsMediaOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"reading" | "movies">("reading");
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [headerState, setHeaderState] = useState(0);

  // const headers = [""];

  useEffect(() => {
    fetch("/api/recent-posts?limit=2")
      .then((r) => r.json())
      .then(setRecentPosts)
      .catch(() => setRecentPosts([]));
  }, []);

  useEffect(() => {
    fetch("/api/goodreads")
      .then((r) => r.json())
      .then((data) => setBooks(data.books || []))
      .catch(() => setBooks([]));
  }, []);

  useEffect(() => {
    fetch("/api/letterboxd")
      .then((r) => r.json())
      .then((data) => setMovies(data.movies || []))
      .catch(() => setMovies([]));
  }, []);

  // const triggerConfetti = useCallback(() => {
  //   const count = 200;
  //   const defaults = {
  //     origin: { y: 0.7 },
  //     zIndex: 9999,
  //   };

  //   function fire(particleRatio: number, opts: object) {
  //     const confettiModule = (
  //       window as unknown as { confetti?: (config: unknown) => void }
  //     ).confetti;
  //     if (confettiModule) {
  //       confettiModule({
  //         ...defaults,
  //         ...opts,
  //         particleCount: Math.floor(count * particleRatio),
  //       });
  //     }
  //   }

  //   fire(0.25, {
  //     spread: 26,
  //     startVelocity: 55,
  //   });
  //   fire(0.2, {
  //     spread: 60,
  //   });
  //   fire(0.35, {
  //     spread: 100,
  //     decay: 0.91,
  //     scalar: 0.8,
  //   });
  //   fire(0.1, {
  //     spread: 120,
  //     startVelocity: 25,
  //     decay: 0.92,
  //     scalar: 1.2,
  //   });
  //   fire(0.1, {
  //     spread: 120,
  //     startVelocity: 45,
  //   });
  // }, []);

  // const handleHeaderClick = useCallback(() => {
  //   const nextState = (headerState + 1) % headers.length;
  //   setHeaderState(nextState);

  //   // Trigger confetti when cycling back to the first header
  //   if (nextState === 0) {
  //     triggerConfetti();
  //   }
  // }, [headerState, headers.length, triggerConfetti]);

  return (
    <>
      <div className="mx-auto max-w-2xl px-6 pt-5 pb-16 flex flex-col justify-center overflow-hidden gap-5">
        <div>
          {/* <h1
            onClick={handleHeaderClick}
            className="text-4xl font-light tracking-tight text-foreground sm:text-5xl mb-8 cursor-pointer select-none"
          >
            {headers[headerState]}
          </h1> */}

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-medium tracking-tight text-foreground mb-4">
              Ben A
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Building, learning, and living!
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="flex items-center gap-2 text-3xl font-medium tracking-tight text-foreground hover:text-primary transition-colors mb-4 group cursor-pointer"
              >
                Experience
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isTimelineOpen ? "rotate-180" : ""
                  }`}
                />
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
                        Feb. 2025 - Present
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Image
                          src="/images/pinterest.svg"
                          alt="Pinterest logo"
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded"
                        />
                        <h4 className="text-lg font-semibold text-foreground">
                          Pinterest | Software Engineer
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        Full-time SWE - Continious Integration Team
                      </p>
                    </div>
                  </li>
                  {/* Experience 2 */}
                  <li className="ml-2 group">
                    <div className="pb-2">
                      <span className="text-sm font-medium text-primary">
                        May 2025 - Aug. 2025
                      </span>
                      <div className="flex items-center gap-2 mt-1">
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
                        tool using Langchain, Python, TypeScript, and React
                      </p>
                    </div>
                  </li>
                  {/* Experience 3 */}
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
                          className="w-6 h-6 rounded"
                        />
                        <h4 className="text-lg font-semibold text-foreground">
                          The Odin Project | Open Source Contributor
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        Contributed to The Odin Project&apos;s curriculum by
                        implementing lesson updates, improving docs, and
                        reviewing PRs to support 150,000+ learners
                      </p>
                    </div>
                  </li>
                  {/* Experience 4 */}
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
                        feature for ColorStack&apos;s Oyster project
                      </p>
                    </div>
                  </li>
                  {/* Experience 5 */}
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
                        Wrote docs for the &quot;Impossible Alone&quot;
                        campaign, created inclusive language guidance, and
                        improved brand visibility through optimized search
                        titles
                      </p>
                    </div>
                  </li>
                  {/* Experience 6 */}
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
                        rankings for new and existing content. Led the launch of
                        a new sustainability product
                      </p>
                    </div>
                  </li>
                  {/* Experience 7 */}
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
                        Produced 11 Instagram reels (205k+ views), grew
                        Instagram to 5,800 followers, and built relationships
                        with 80+ potential clients through social media
                        engagement
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsBlogOpen(!isBlogOpen)}
            className="flex items-center gap-2 text-3xl font-medium tracking-tight text-foreground hover:text-primary transition-colors mb-4 group cursor-pointer"
          >
            Recent Blog Posts
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isBlogOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isBlogOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-3 ml-2 pb-3">
              {recentPosts.map((post, index) => (
                <BlogH1
                  key={post.slug}
                  title={post.title}
                  href={`/blog/${post.slug}`}
                  index={index == recentPosts.length - 1 ? -1 : index}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsMediaOpen(!isMediaOpen)}
            className="flex items-center gap-2 text-3xl font-medium tracking-tight text-foreground hover:text-primary transition-colors mb-4 group cursor-pointer"
          >
            Recent Media
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isMediaOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMediaOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-2 pb-3">
              <div className="flex gap-4 mb-4 border-b border-border">
                <button
                  onClick={() => setActiveTab("reading")}
                  className={`pb-2 px-1 text-base font-medium transition-colors ${
                    activeTab === "reading"
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Recent Books
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("movies")}
                  className={`pb-2 px-1 text-base font-medium transition-colors ${
                    activeTab === "movies"
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Recent Movies
                  </div>
                </button>
              </div>

              {/* Account links */}
              <div className="mb-4 text-sm text-muted-foreground">
                {activeTab === "reading" && (
                  <p>
                    from{" "}
                    <Link
                      href="https://www.goodreads.com/user/show/189030126-benjamin-aguirre"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Goodreads
                    </Link>
                  </p>
                )}
                {activeTab === "movies" && (
                  <p>
                    from{" "}
                    <Link
                      href="https://letterboxd.com/baguirre3/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Letterboxd
                    </Link>
                  </p>
                )}
              </div>

              {/* Tab content */}
              {activeTab === "reading" && (
                <div className="space-y-3">
                  {books.length > 0 ? (
                    books.map((book, index) => (
                      <div
                        key={index}
                        className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3"
                      >
                        <Link
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="flex items-start gap-3">
                            {book.imageUrl && (
                              <Image
                                src={book.imageUrl}
                                alt={book.title}
                                width={48}
                                height={72}
                                className="rounded shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mt-1">
                                by {book.author}
                              </p>
                              {book.readAt && (
                                <p className="text-muted-foreground text-sm mt-1">
                                  Finished{" "}
                                  {new Date(book.readAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No recent books found.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "movies" && (
                <div className="space-y-3">
                  {movies.length > 0 ? (
                    movies.map((movie, index) => (
                      <div
                        key={index}
                        className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3"
                      >
                        <Link
                          href={movie.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="flex items-start gap-3">
                            {movie.imageUrl && (
                              <Image
                                src={movie.imageUrl}
                                alt={movie.title}
                                width={48}
                                height={72}
                                className="rounded shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                  {movie.title}
                                </h3>
                                {movie.year && (
                                  <span className="text-muted-foreground text-sm">
                                    ({movie.year})
                                  </span>
                                )}
                                {movie.rating && (
                                  <span className="text-primary text-sm">
                                    {movie.rating}
                                  </span>
                                )}
                              </div>
                              {movie.watchedDate && (
                                <p className="text-muted-foreground text-sm mt-1">
                                  Watched {movie.watchedDate}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No recent movies found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="flex items-center gap-2 text-3xl font-medium tracking-tight text-foreground hover:text-primary transition-colors mb-4 group cursor-pointer"
          >
            Some Tools I&apos;ve Been Enjoying Recently
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isToolsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isToolsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-3 ml-2">
              <div className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2">
                    IDE: Cursor
                  </h3>
                </div>
              </div>
              <div className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2">
                    Note taking: Obsidian
                  </h3>
                </div>
              </div>
              <div className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2">
                    Terminal: Ghostty
                  </h3>
                </div>
              </div>
              <div className="group border-b border-border group-hover:border-primary/30 transition-colors pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2">
                    Browser: Chrome
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 hidden flex-col gap-3 md:flex">
        <Link
          href="mailto:baguirre@luc.edu"
          className="rounded-full bg-background/80 p-3 text-muted-foreground shadow-sm ring-1 ring-border transition-all hover:text-foreground hover:shadow-md"
        >
          <Mail className="h-4 w-4 transition-transform hover:scale-110" />
          <span className="sr-only">Email Ben Aguirre</span>
        </Link>
        <Link
          href="https://www.linkedin.com/in/ben-aguirre"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-background/80 p-3 text-muted-foreground shadow-sm ring-1 ring-border transition-all hover:text-foreground hover:shadow-md"
        >
          <Linkedin className="h-4 w-4 transition-transform hover:scale-110" />
          <span className="sr-only">LinkedIn</span>
        </Link>
        <Link
          href="https://github.com/Baguirre03"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-background/80 p-3 text-muted-foreground shadow-sm ring-1 ring-border transition-all hover:text-foreground hover:shadow-md"
        >
          <Github className="h-4 w-4 transition-transform hover:scale-110" />
          <span className="sr-only">GitHub</span>
        </Link>
      </div>
    </>
  );
}
