import Link from "next/link";

const SIZES = {
  sm: { box: "h-8 w-8 rounded-lg", icon: "h-4 w-4", text: "text-base" },
  md: { box: "h-9 w-9 rounded-xl", icon: "h-5 w-5", text: "text-lg" },
  lg: { box: "h-11 w-11 rounded-xl", icon: "h-6 w-6", text: "text-2xl" },
};

export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center justify-center bg-brand-gradient shadow-glow ${SIZES[size].box} ${className}`}
    >
      <svg
        className={`${SIZES[size].icon} text-white`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    </span>
  );
}

export default function Logo({
  size = "md",
  href = "/",
  withText = true,
  subtitle,
  tone = "dark",
  className = "",
}: {
  size?: keyof typeof SIZES;
  href?: string | null;
  withText?: boolean;
  subtitle?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const content = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={size} />
      {withText && (
        <span className="leading-tight">
          <span
            className={`block font-bold tracking-tight ${SIZES[size].text} ${
              tone === "light" ? "text-white" : "text-slate-900"
            }`}
          >
            warap
          </span>
          {subtitle && (
            <span
              className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${
                tone === "light" ? "text-white/60" : "text-slate-400"
              }`}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="group inline-flex items-center">
      {content}
    </Link>
  );
}
