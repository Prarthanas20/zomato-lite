// POST /api/reviews
//
// The frontend sends { restaurantId, rating, comment }.
// We check all three here — even though the star picker already limits the
// rating — because anybody can call this endpoint without using our UI.

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  // --- read the body -------------------------------------------------------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { restaurantId, rating, comment } = (body ?? {}) as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  // --- check 1: rating is a whole number from 1 to 5 -----------------------
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  // --- check 2: comment is a non-empty string ------------------------------
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 }
    );
  }

  // --- check 3: the restaurant actually exists -----------------------------
  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId) ||
    restaurantId < 1
  ) {
    return NextResponse.json(
      { error: "Restaurant id must be a whole number." },
      { status: 400 }
    );
  }

  const restaurant = await sql`
    SELECT id FROM restaurants WHERE id = ${restaurantId}
  `;

  if (restaurant.length === 0) {
    return NextResponse.json(
      { error: `Restaurant ${restaurantId} does not exist.` },
      { status: 400 }
    );
  }

  // --- all checks passed: write exactly one row ----------------------------
  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id
  `;

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}
