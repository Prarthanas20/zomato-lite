# Zomato Lite

One restaurant, two screens, two APIs, two tables.

- `/restaurant/1` — the restaurant page: name, average rating, latest review, older reviews.
- `/review/1` — write a review: stars, a comment, submit.

## The idea

Store facts, compute answers. The database holds `restaurants` and `reviews`.
There is no `average_rating` column and no `latest_review` column. The API
computes the average with `AVG(rating)`, the count with `COUNT(*)`, and the
latest review with `ORDER BY created_at DESC LIMIT 1`, fresh on every request.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/reviews` | Validate and insert one review. |
| `GET` | `/api/restaurants/[id]` | Restaurant, average, count, latest review, older reviews. |

## Running it locally

```bash
npm install
# put DATABASE_URL=... in .env.local
npm run db:setup   # creates the tables and seeds the data
npm run dev        # http://localhost:3000
```

`db/schema.sql` and `db/seed.sql` are plain SQL. No ORM.
