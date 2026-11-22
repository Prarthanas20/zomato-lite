"use client";

// Screen 1 — write a review.
//
// The form holds two pieces of state the user types (rating, comment) and
// hands them to POST /api/reviews. If the backend says no, we show the
// backend's own words — we do not invent a friendlier message.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Rings, Seal } from "@/components/Ornaments";

type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
};

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();
  const restaurantId = params.restaurantId;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // We only need the name for the heading.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`);
        const body = await response.json();
        if (response.ok && !cancelled) setRestaurant(body);
      } catch {
        // The form still works; the heading just stays a placeholder.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: Number(restaurantId),
          rating,
          comment,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        // Display exactly what the backend said.
        setError(body.error ?? "The server rejected this review.");
        setSubmitting(false);
        return;
      }

      router.push(`/restaurant/${restaurantId}`);
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[560px] px-4 pb-14 pt-4 sm:px-6 sm:pt-8">
      <header className="relative overflow-hidden rounded-t-[2rem] bg-ink px-6 pb-16 pt-9 text-center text-paper">
        <Rings className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 text-paper/[0.06]" />
        <Rings className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 text-paper/[0.04]" />

        <Link
          href={`/restaurant/${restaurantId}`}
          className="absolute left-5 top-5 z-10 text-[0.625rem] uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-paper"
        >
          ← Back
        </Link>

        <div className="relative mt-9">
          <Seal tone="dark" />

          <h1 className="mt-5 flex min-h-[2.5rem] items-center justify-center font-serif text-[2.125rem] leading-[1.05] tracking-[-0.01em]">
            {restaurant ? (
              restaurant.name
            ) : (
              <span className="h-7 w-44 rounded bg-paper/15" aria-hidden="true" />
            )}
          </h1>

          {restaurant && (
            <p className="mt-3 text-[0.625rem] font-medium uppercase tracking-[0.26em] text-paper/55">
              {restaurant.cuisine} <span className="text-ember/80">·</span>{" "}
              {restaurant.area}
            </p>
          )}
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 -mt-8 rounded-2xl border border-line bg-card px-6 py-8 sm:px-8"
      >
        <fieldset className="text-center">
          <legend className="text-[0.625rem] font-medium uppercase tracking-[0.26em] text-muted">
            How was it?
          </legend>

          <div
            className="mt-4 flex items-center justify-center gap-1"
            role="radiogroup"
            aria-label="Rating from 1 to 5"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() => setRating(n)}
                className={`rounded-full p-1.5 transition-colors ${
                  n <= rating ? "text-accent" : "text-line hover:text-muted"
                }`}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill={n <= rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.1}
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2.9l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.46l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z" />
                </svg>
              </button>
            ))}
          </div>

          <p className="mt-2 text-[0.625rem] uppercase tracking-[0.2em] text-muted">
            {rating === 0 ? "Tap a star" : `${rating} of 5`}
          </p>
        </fieldset>

        <div className="mt-8">
          <label
            htmlFor="comment"
            className="block text-[0.625rem] font-medium uppercase tracking-[0.26em] text-muted"
          >
            Your review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={5}
            placeholder="What was it like?"
            className="mt-3 w-full resize-none rounded-xl border border-line bg-paper px-4 py-3.5 text-[0.9375rem] leading-relaxed placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-accent/25 bg-accent-soft px-4 py-3 text-center text-sm text-accent"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-[0.8125rem] font-medium tracking-[0.02em] text-paper transition-colors hover:bg-[#8a4320] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? "Sending…" : "Submit review"}
          {!submitting && <ArrowRight />}
        </button>
      </form>

      <footer className="mt-12 border-t border-line pt-6 text-center">
        <p className="text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
          Zomato Lite
        </p>
      </footer>
    </main>
  );
}
