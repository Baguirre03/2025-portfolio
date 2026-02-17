"use client";

import Image from "next/image";
import { HeicImage } from "@/components/heic-image";
import React, { ReactNode, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Info,
  Lightbulb,
  TriangleAlert,
  CircleAlert,
  AlertOctagon,
  Code2,
  Quote,
} from "lucide-react";
import { Carousel } from "@/components/carousel";

const CALLOUT_MATCH =
  /^\[!(Note|Tip|Warning|Important|Caution|Example|Quote)\]\s*(.*)$/i;

type CalloutType =
  | "note"
  | "tip"
  | "warning"
  | "important"
  | "caution"
  | "example"
  | "quote";

const CALLOUT_CONFIG: Record<
  CalloutType,
  { label: string; Icon: typeof Info; className: string }
> = {
  note: {
    label: "Note",
    Icon: Info,
    className:
      "border-l-4 border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200",
  },
  tip: {
    label: "Tip",
    Icon: Lightbulb,
    className:
      "border-l-4 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200",
  },
  warning: {
    label: "Warning",
    Icon: TriangleAlert,
    className:
      "border-l-4 border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200",
  },
  important: {
    label: "Important",
    Icon: CircleAlert,
    className:
      "border-l-4 border-red-500 bg-red-500/10 dark:bg-red-500/20 text-red-800 dark:text-red-200",
  },
  caution: {
    label: "Caution",
    Icon: AlertOctagon,
    className:
      "border-l-4 border-orange-500 bg-orange-500/10 dark:bg-orange-500/20 text-orange-800 dark:text-orange-200",
  },
  example: {
    label: "Example",
    Icon: Code2,
    className:
      "border-l-4 border-violet-500 bg-violet-500/10 dark:bg-violet-500/20 text-violet-800 dark:text-violet-200",
  },
  quote: {
    label: "Quote",
    Icon: Quote,
    className:
      "border-l-4 border-gray-500 bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300",
  },
};

function getFirstChildText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return node.trim();
  if (Array.isArray(node)) return getFirstChildText(node[0]);
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children != null) return getFirstChildText(props.children);
  }
  return "";
}

function normalizeBlogImageSrc(src: string | undefined): string {
  if (!src) return "";
  const trimmed = src.trim();
  if (trimmed.startsWith("./images/"))
    return "/blog/images/" + trimmed.slice("./images/".length);
  if (trimmed.startsWith("images/"))
    return "/blog/images/" + trimmed.slice("images/".length);
  if (trimmed.startsWith("/blog/images/")) return trimmed;
  return src;
}

/** Replace arrow-like text with Unicode arrows, but not inside fenced code blocks. */
function replaceArrows(content: string): string {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .replace(/<==>/g, "⇔")
        .replace(/-->/g, "→")
        .replace(/->/g, "→")
        .replace(/<--/g, "←")
        .replace(/<-/g, "←")
        .replace(/=>/g, "⇒")
        .replace(/<=/g, "⇐")
        .replace(/<->/g, "↔");
    })
    .join("");
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => {
            const resolved = normalizeBlogImageSrc(
              typeof src === "string" ? src : undefined,
            );
            if (!resolved) return null;
            const altText = typeof alt === "string" ? alt : "";
            const isHeic = resolved.toLowerCase().endsWith(".heic");
            return (
              <span className="block my-6">
                {isHeic ? (
                  <HeicImage
                    src={resolved}
                    alt={altText}
                    className="rounded-lg w-full h-auto object-contain"
                  />
                ) : (
                  <Image
                    src={resolved}
                    alt={altText}
                    width={800}
                    height={500}
                    className="rounded-lg w-full h-auto object-contain"
                  />
                )}
              </span>
            );
          },
          h1: () => null,
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isCodeBlock = String(children).includes("\n") || className;

            if (language === "carousel") {
              const lines = String(children)
                .trim()
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const slides = lines
                .map((line) => {
                  const [path, caption] = line.split("|").map((s) => s.trim());
                  const src = normalizeBlogImageSrc(path);
                  return { src, caption: caption || undefined };
                })
                .filter((s) => s.src);
              return <Carousel slides={slides} />;
            }

            // If it's a code block with a language, use syntax highlighter
            if (language) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            // If it's a code block without a language, render as plain block
            if (isCodeBlock) {
              return (
                <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto whitespace-pre font-mono text-sm">
                  {children}
                </code>
              );
            }

            // Otherwise, it's inline code
            return (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <div className="mb-4">{children}</div>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => {
            const arr = React.Children.toArray(children);
            const firstText = getFirstChildText(arr[0]);
            const match = firstText.match(CALLOUT_MATCH);
            if (match) {
              const type = match[1].toLowerCase() as CalloutType;
              const config = CALLOUT_CONFIG[type];
              const inlineContent = match[2]?.trim() ?? "";
              if (config) {
                const { label, Icon, className } = config;
                const bodyChildren = arr.slice(1);
                const bodyMarkdown =
                  bodyChildren.length === 0 && firstText
                    ? firstText
                        .replace(
                          /^\[!(?:Note|Tip|Warning|Important|Caution|Example|Quote)\]\s*/i,
                          "",
                        )
                        .trim()
                    : "";
                return (
                  <div
                    className={`rounded-r-lg pl-4 pr-4 py-3 mb-4 not-italic ${className}`}
                    role="note"
                  >
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline">
                      {bodyMarkdown ? (
                        <div className="prose prose-lg max-w-none *:mb-2 [&>*:last-child]:mb-0">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                  target={
                                    href?.startsWith("http")
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    href?.startsWith("http")
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {replaceArrows(bodyMarkdown)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <>
                          {inlineContent ? (
                            <p className="mb-2 last:mb-0">{inlineContent}</p>
                          ) : null}
                          {bodyChildren}
                        </>
                      )}
                    </div>
                  </div>
                );
              }
            }
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4 text-muted-foreground">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {replaceArrows(content)}
      </ReactMarkdown>
    </div>
  );
}
