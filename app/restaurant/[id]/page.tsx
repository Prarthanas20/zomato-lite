"use client";

// Screen 2 — the restaurant page.
//
// This file asks GET /api/restaurants/[id] for everything and then draws it.
// It does not add, divide, sort or average anything. If you want to check that
// claim, look at the line marked "the average, printed as handed over".

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Divider, Seal } from "@/components/Ornaments";
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
      <main className="mx-auto w-full max-w-[560px] px-6 py-24 text-center">
        <Seal />
        <p className="mt-6 text-sm text-muted">{error}</p>
        <Link
          href="/restaurant/1"
          className="mt-8 inline-block text-[0.6875rem] uppercase tracking-[0.2em] text-accent"
        >
          Back to the restaurant
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6 py-24 text-center">
        <Seal />
        <p className="mt-6 text-[0.625rem] uppercase tracking-[0.26em] text-muted">
          Loading
        </p>
      </main>
    );
  }

  const hasReviews = data.totalReviews > 0;

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pb-16 pt-14 sm:pt-20">
      {/* 1. Who and where */}
      <header className="text-center">
        <Seal />
        <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.03] tracking-[-0.015em] sm:text-[3.25rem]">
          {data.name}
        </h1>
        <p className="mt-4 text-[0.6875rem] font-medium uppercase tracking-[0.26em] text-muted">
          {data.cuisine} <span className="text-accent/50">·</span> {data.area}
        </p>
      </header>

      <Divider className="mt-10" />

      {/* 2. The average, printed as handed over by the API */}
      <section className="py-10 text-center">
        {hasReviews ? (
          <>
            <div className="font-serif text-[5.5rem] leading-none tracking-[-0.035em] sm:text-[6.5rem]">
              {/* the average, printed as handed over — no arithmetic here */}
              {data.averageRating!.toFixed(1)}
            </div>
            <p className="mt-4 text-[0.625rem] font-medium uppercase tracking-[0.26em] text-muted">
              Average of {data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </>
        ) : (
          <>
            <div className="font-serif text-[5.5rem] leading-none text-line">—</div>
            <p className="mt-4 text-[0.625rem] font-medium uppercase tracking-[0.26em] text-muted">
              No ratings yet
            </p>
          </>
        )}
      </section>

      <Divider />

      {/* 3. The latest review, set apart */}
      {data.latestReview && (
        <article className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-accent-soft/70 px-6 py-7 sm:px-8 sm:py-8">
          <p className="relative text-[0.625rem] font-medium uppercase tracking-[0.26em] text-accent">
            Latest review
          </p>

          <div className="relative mt-4 flex items-center gap-3 text-accent">
            <Stars value={data.latestReview.rating} size={15} />
            <span className="text-[0.625rem] uppercase tracking-[0.18em] text-muted">
              {data.latestReview.rating} / 5
            </span>
          </div>

          <p className="relative mt-4 font-serif text-[1.375rem] leading-[1.5]">
            {data.latestReview.comment}
          </p>

          <time
            dateTime={data.latestReview.createdAt}
            className="relative mt-5 block text-[0.625rem] uppercase tracking-[0.18em] text-muted"
          >
            {formatDate(data.latestReview.createdAt)}
          </time>
        </article>
      )}

      {/* 6. Nothing yet? Invite the first review. */}
      {!hasReviews && (
        <section className="mt-10 rounded-2xl border border-dashed border-line px-8 py-12 text-center">
          <p className="font-serif text-[1.625rem]">No reviews yet.</p>
          <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-relaxed text-muted">
            Be the first to say something about the burritos.
          </p>
        </section>
      )}

      {/* 4. Everything older, already newest-first from the API */}
      {data.reviews.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center gap-4">
            <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.26em] text-muted">
              Older reviews
            </h2>
            <span className="h-px flex-1 bg-line" />
          </div>

          <ul>
            {data.reviews.map((review) => (
              <li key={review.id} className="border-b border-line py-7 last:border-b-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-accent">
                    <Stars value={review.rating} size={13} />
                  </span>
                  <time
                    dateTime={review.createdAt}
                    className="text-[0.625rem] uppercase tracking-[0.16em] text-muted"
                  >
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-[1.0625rem] leading-relaxed">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. The way in */}
      <div className="mt-12 flex justify-center">
        <Link
          href={`/review/${id}`}
          className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-[0.8125rem] font-medium tracking-[0.02em] text-paper transition-colors hover:bg-[#8a4320]"
        >
          Write a review
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-center">
        <p className="text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
          Zomato Lite
        </p>
      </footer>
    </main>
  );
}
