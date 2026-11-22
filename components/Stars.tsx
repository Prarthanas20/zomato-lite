// Draws five stars. Purely presentational: it shows the number it was given.
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinejoin="round"
        >
          <path d="M12 3.6l2.6 5.2 5.8.9-4.2 4.1 1 5.7-5.2-2.7-5.2 2.7 1-5.7-4.2-4.1 5.8-.9z" />
        </svg>
      ))}
    </span>
  );
}
