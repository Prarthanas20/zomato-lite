// Draws five stars. Purely presentational: it shows the number it was given.
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[4px]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.1}
          strokeLinejoin="round"
        >
          <path d="M12 2.9l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.46l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z" />
        </svg>
      ))}
    </span>
  );
}
