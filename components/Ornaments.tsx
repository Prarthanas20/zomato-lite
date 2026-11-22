// Small hand-drawn ornaments shared by both screens.

type Tone = "light" | "dark";

export function Seal({ label = "LB", tone = "light" }: { label?: string; tone?: Tone }) {
  return (
    <span
      className={`relative inline-flex h-14 w-14 items-center justify-center rounded-full border ${
        tone === "dark" ? "border-paper/25" : "border-line"
      }`}
      aria-hidden="true"
    >
      <span
        className={`absolute inset-[3px] rounded-full border ${
          tone === "dark" ? "border-ember/40" : "border-accent/25"
        }`}
      />
      <span
        className={`font-serif text-[0.9375rem] tracking-[0.06em] ${
          tone === "dark" ? "text-ember" : "text-accent"
        }`}
      >
        {label}
      </span>
    </span>
  );
}

export function Divider({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className={`h-px flex-1 ${tone === "dark" ? "bg-paper/15" : "bg-line"}`} />
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        className={tone === "dark" ? "text-ember/70" : "text-accent/50"}
      >
        <path d="M3 0l3 3-3 3-3-3z" fill="currentColor" />
      </svg>
      <span className={`h-px flex-1 ${tone === "dark" ? "bg-paper/15" : "bg-line"}`} />
    </div>
  );
}

// Concentric rings, used as a quiet watermark behind the dark panels.
export function Rings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="99" />
      <circle cx="100" cy="100" r="79" />
      <circle cx="100" cy="100" r="59" />
    </svg>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
    </svg>
  );
}
