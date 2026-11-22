"use client";

// Screen 1 — write a review.
//
// The form holds two pieces of state the user types (rating, comment) and
// hands them to POST /api/reviews. If the backend says no, we show the
// backend's own words — we do not invent a friendlier message.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        // The form still works; the heading just stays generic.
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
    <main className="mx-auto w-full max-w-[560px] px-6 py-14 sm:py-20">
      <Link
        href={`/restaurant/${restaurantId}`}
        className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        ← Back
      </Link>

      <header className="mt-8">
        <h1 className="font-serif text-[2.5rem] leading-[1.1] tracking-[-0.01em]">
          {restaurant ? restaurant.name : "Write a review"}
        </h1>
        {restaurant && (
          <p className="mt-3 text-[0.9375rem] text-muted">
            {restaurant.cuisine} · {restaurant.area}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="mt-10">
        <fieldset>
          <legend className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
            Your rating
          </legend>

          <div
            className="mt-4 flex items-center gap-1"
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
                className={`rounded-md p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  n <= rating ? "text-accent" : "text-line hover:text-muted"
                }`}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill={n <= rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3.6l2.6 5.2 5.8.9-4.2 4.1 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.2-4.1 5.8-.9z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">
            {rating === 0 ? "Pick 1 to 5" : `${rating} of 5`}
          </p>
        </fieldset>

        <div className="mt-9">
          <label
            htmlFor="comment"
            className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted"
          >
            Your review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={5}
            placeholder="What was it like?"
            className="mt-3 w-full resize-none rounded-lg border border-line bg-white/60 px-4 py-3 text-[0.9375rem] leading-relaxed placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
        >
          {submitting ? "Sending…" : "Submit review"}
        </button>
      </form>
    </main>
  );
}
