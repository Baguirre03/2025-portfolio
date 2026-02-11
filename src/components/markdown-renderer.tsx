"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
            return (
              <span className="block my-6">
                <Image
                  src={resolved}
                  alt={altText}
                  width={800}
                  height={500}
                  className="rounded-lg w-full h-auto object-contain"
                />
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
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
