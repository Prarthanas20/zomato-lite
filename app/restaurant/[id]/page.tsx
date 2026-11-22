"use client";

// Screen 2 — the restaurant page.
//
// This file asks GET /api/restaurants/[id] for everything and then draws it.
// It does not add, divide, sort or average anything. If you want to check that
// claim, look at the line marked "the average, printed as handed over".

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Stars } from "@/components/Stars";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/restaurants/${id}`);
        const body = await response.json();

        if (!response.ok) {
          if (!cancelled) setError(body.error ?? "Could not load this restaurant.");
          return;
        }

        if (!cancelled) setData(body);
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <p className="text-muted">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <p className="text-muted">Loading…</p>
      </main>
    );
  }

  const hasReviews = data.totalReviews > 0;

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-14 sm:py-20">
      {/* 1. Who and where */}
      <header>
        <h1 className="font-serif text-[2.5rem] leading-[1.1] tracking-[-0.01em]">
          {data.name}
        </h1>
        <p className="mt-3 text-[0.9375rem] text-muted">
          {data.cuisine} · {data.area}
        </p>
      </header>

      {/* 2. The average, printed as handed over by the API */}
      <section className="mt-10 border-y border-line py-9">
        {hasReviews ? (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-serif text-[4.75rem] leading-none tracking-[-0.02em]">
              {/* the average, printed as handed over — no arithmetic here */}
              {data.averageRating!.toFixed(1)}
            </span>
            <p className="pb-2 text-sm text-muted">
              out of 5 · {data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        ) : (
          <p className="text-muted">No ratings yet.</p>
        )}
      </section>

      {/* 6. Nothing yet? Invite the first review. */}
      {!hasReviews && (
        <section className="mt-9 rounded-xl border border-line p-6">
          <p className="font-serif text-xl">No reviews yet.</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
            This table is empty. You could be the first person to say something
            about the burritos.
          </p>
        </section>
      )}

      {/* 3. The latest review, set apart */}
      {data.latestReview && (
        <article className="mt-9 rounded-xl bg-accent-soft p-6">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-accent">
            Latest review
          </p>
          <div className="mt-3 flex items-center gap-2 text-accent">
            <Stars value={data.latestReview.rating} />
            <span className="text-sm text-muted">
              {data.latestReview.rating} / 5
            </span>
          </div>
          <p className="mt-4 text-[1.0625rem] leading-relaxed">
            {data.latestReview.comment}
          </p>
          <time
            dateTime={data.latestReview.createdAt}
            className="mt-4 block text-xs text-muted"
          >
            {formatDate(data.latestReview.createdAt)}
          </time>
        </article>
      )}

      {/* 4. Everything older, already newest-first from the API */}
      {data.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
            Older reviews
          </h2>
          <ul className="mt-5 divide-y divide-line border-t border-line">
            {data.reviews.map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex items-center gap-2 text-accent">
                  <Stars value={review.rating} />
                  <span className="text-sm text-muted">{review.rating} / 5</span>
                </div>
                <p className="mt-3 leading-relaxed">{review.comment}</p>
                <time
                  dateTime={review.createdAt}
                  className="mt-2 block text-xs text-muted"
                >
                  {formatDate(review.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. The way in */}
      <div className="mt-12">
        <Link
          href={`/review/${id}`}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
