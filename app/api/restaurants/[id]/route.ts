// GET /api/restaurants/[id]
//
// Everything the restaurant page needs, in the exact shape the page draws it:
// name, cuisine, area, average rating, review count, the latest review,
// and the older reviews.
//
// The three computed values — average, count, latest — are calculated here,
// fresh, on every request. They are never stored in a column.

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

function toReview(row: ReviewRow) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 }
    );
  }

  const restaurants = await sql`
    SELECT id, name, cuisine, area
    FROM restaurants
    WHERE id = ${restaurantId}
  `;

  if (restaurants.length === 0) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 }
    );
  }

  const restaurant = restaurants[0];

  // The three answers. Note that they are SELECTed, never stored.
  const stats = await sql`
    SELECT
      ROUND(AVG(rating)::numeric, 1)::float8 AS average_rating,
      COUNT(*)::int                          AS total_reviews
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  const rows = (await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
  `) as ReviewRow[];

  const [latest, ...older] = rows;

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    // No reviews yet? Then there is no average. Null means "nothing to average".
    averageRating: stats[0].total_reviews === 0 ? null : stats[0].average_rating,
    totalReviews: stats[0].total_reviews,
    latestReview: latest ? toReview(latest) : null,
    reviews: older.map(toReview),
  });
}
