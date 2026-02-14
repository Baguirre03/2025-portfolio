"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Film, Tv, ExternalLink } from "lucide-react";

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

type SerializdProfile = {
  profileUrl: string;
  watchedUrl: string;
  reviewsUrl: string;
  username: string;
  showWatchedCount: number | null;
  reviewCount: number | null;
} | null;

const GOODREADS_PROFILE =
  "https://www.goodreads.com/user/show/189030126-benjamin-aguirre";
const LETTERBOXD_PROFILE = "https://letterboxd.com/baguirre3/";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<"books" | "movies" | "shows">(
    "books",
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [serializd, setSerializd] = useState<SerializdProfile>(null);
  const [booksLoading, setBooksLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [serializdLoading, setSerializdLoading] = useState(true);

  const fetchBooks = useCallback(() => {
    setBooksLoading(true);
    fetch("/api/goodreads")
      .then((r) => r.json())
      .then((data) => setBooks(data.books ?? []))
      .catch(() => setBooks([]))
      .finally(() => setBooksLoading(false));
  }, []);

  const fetchMovies = useCallback(() => {
    setMoviesLoading(true);
    fetch("/api/letterboxd")
      .then((r) => r.json())
      .then((data) => setMovies(data.movies ?? []))
      .catch(() => setMovies([]))
      .finally(() => setMoviesLoading(false));
  }, []);

  const fetchSerializd = useCallback(() => {
    setSerializdLoading(true);
    fetch("/api/serializd")
      .then((r) => r.json())
      .then((data) => {
        if (data.profileUrl) setSerializd(data);
        else setSerializd(null);
      })
      .catch(() => setSerializd(null))
      .finally(() => setSerializdLoading(false));
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchMovies();
    fetchSerializd();
  }, [fetchBooks, fetchMovies, fetchSerializd]);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-5 pb-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-1">
        Media
      </h1>
      <p className="text-muted-foreground text-base mb-8">
        Books I&apos;ve read, movies and shows I&apos;ve watched.
      </p>

      <div className="flex gap-4 border-b border-border mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("books")}
          className={`pb-2 px-1 text-base font-medium transition-colors flex items-center gap-2 ${
            activeTab === "books"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Books
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("movies")}
          className={`pb-2 px-1 text-base font-medium transition-colors flex items-center gap-2 ${
            activeTab === "movies"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Film className="w-4 h-4" />
          Movies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("shows")}
          className={`pb-2 px-1 text-base font-medium transition-colors flex items-center gap-2 ${
            activeTab === "shows"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tv className="w-4 h-4" />
          Shows
        </button>
      </div>

      {activeTab === "books" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            from{" "}
            <Link
              href={GOODREADS_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Goodreads <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
          {booksLoading ? (
            <p className="text-muted-foreground">Loading books…</p>
          ) : books.length > 0 ? (
            <ul className="space-y-3">
              {books.map((book, index) => (
                <li
                  key={`${book.link}-${index}`}
                  className="group border-b border-border pb-3"
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
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          by {book.author}
                        </p>
                        {book.readAt && (
                          <p className="text-muted-foreground text-sm mt-1">
                            Finished{" "}
                            {new Date(book.readAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No books found.</p>
          )}
        </div>
      )}

      {activeTab === "movies" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            from{" "}
            <Link
              href={LETTERBOXD_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Letterboxd <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
          {moviesLoading ? (
            <p className="text-muted-foreground">Loading movies…</p>
          ) : movies.length > 0 ? (
            <ul className="space-y-3">
              {movies.map((movie, index) => (
                <li
                  key={`${movie.link}-${index}`}
                  className="group border-b border-border pb-3"
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No movies found.</p>
          )}
        </div>
      )}

      {activeTab === "shows" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            from{" "}
            <Link
              href={
                serializd?.reviewsUrl ??
                "https://www.serializd.com/user/baguirre/reviews"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Serializd <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
          {serializdLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : serializd ? (
            <div className="rounded-lg border border-border p-6 bg-muted/30">
              {(serializd.showWatchedCount != null ||
                serializd.reviewCount != null) && (
                <p className="text-muted-foreground mb-4">
                  {serializd.showWatchedCount != null &&
                    `${serializd.showWatchedCount} show${serializd.showWatchedCount === 1 ? "" : "s"} watched`}
                  {serializd.showWatchedCount != null &&
                    serializd.reviewCount != null &&
                    " · "}
                  {serializd.reviewCount != null &&
                    `${serializd.reviewCount} review${serializd.reviewCount === 1 ? "" : "s"}`}
                </p>
              )}
              <p className="text-muted-foreground mb-4">
                View all shows and reviews on Serializd.
              </p>
              <Link
                href={serializd.watchedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Watched shows <ExternalLink className="w-4 h-4" />
              </Link>
              <span className="mx-2 text-muted-foreground">·</span>
              <Link
                href={serializd.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Reviews <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground">
              <Link
                href="https://www.serializd.com/user/baguirre/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View my Serializd profile
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
