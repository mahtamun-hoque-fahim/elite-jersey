import { useId } from "react";
import type { Jersey } from "@/data/jerseys";

type Props = Pick<Jersey, "colors" | "pattern"> & { className?: string; title?: string };

const BODY =
  "M70 22 L50 30 L54 70 L54 178 Q54 184 60 184 L140 184 Q146 184 146 178 L146 70 L150 30 L130 22 Q100 42 70 22 Z";
const LEFT = "M50 30 L18 56 L36 84 L54 70 Z";
const RIGHT = "M150 30 L182 56 L164 84 L146 70 Z";

export function JerseyArt({ colors, pattern, className, title }: Props) {
  const id = useId().replace(/:/g, "");
  const { body, sleeve, trim } = colors;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title ?? "Jersey"}
    >
      <defs>
        <clipPath id={`c${id}`}>
          <path d={BODY} />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="192" rx="52" ry="4" fill="#000" opacity="0.08" />
      <path d={LEFT} fill={sleeve} />
      <path d={RIGHT} fill={sleeve} />
      <path d={LEFT} fill="none" stroke={trim} strokeWidth="3" strokeLinejoin="round" opacity="0.9" />
      <path d={RIGHT} fill="none" stroke={trim} strokeWidth="3" strokeLinejoin="round" opacity="0.9" />
      <g clipPath={`url(#c${id})`}>
        <rect x="40" y="10" width="120" height="190" fill={body} />
        {pattern === "stripes" &&
          Array.from({ length: 7 }).map((_, i) =>
            i % 2 === 1 ? <rect key={i} x={54 + i * 13.2} y="10" width="13.2" height="190" fill={sleeve} /> : null,
          )}
        {pattern === "hoops" &&
          Array.from({ length: 8 }).map((_, i) =>
            i % 2 === 1 ? <rect key={i} x="40" y={30 + i * 20} width="120" height="20" fill={sleeve} /> : null,
          )}
        <rect x="54" y="170" width="92" height="14" fill={trim} opacity="0.18" />
      </g>
      <path d="M70 22 Q100 42 130 22" fill="none" stroke={trim} strokeWidth="4" strokeLinecap="round" />
      <circle cx="118" cy="62" r="6" fill={trim} />
      <path
        d={BODY}
        fill="none"
        stroke="#000"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
