// Small hand-drawn ornaments shared by both screens.

export function Seal({ label = "LB" }: { label?: string }) {
  return (
    <span
      className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-line"
      aria-hidden="true"
    >
      <span className="absolute inset-[3px] rounded-full border border-accent/25" />
      <span className="font-serif text-[0.9375rem] tracking-[0.06em] text-accent">
        {label}
      </span>
    </span>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <svg width="6" height="6" viewBox="0 0 6 6" className="text-accent/50">
        <path d="M3 0l3 3-3 3-3-3z" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
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
