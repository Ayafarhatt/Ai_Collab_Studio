/** Small coloured initial badge standing in for a tool logo. */
export function ToolBadge({ name, accent, size = 20 }: { name: string; accent: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-md text-[11px] font-semibold"
      style={{ width: size, height: size, color: accent, backgroundColor: `${accent}26` }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
