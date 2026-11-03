import type { Motif } from "@/data/tours";

/** Illustrated placeholder art per tour (swap for real photos later by editing TourCard). */
export default function TourArt({
  motif,
  palette,
  id,
  className = "",
}: {
  motif: Motif;
  palette: [string, string];
  id: string;
  className?: string;
}) {
  const [c1, c2] = palette;
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${motif} illustration`}
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky-${id})`} />
      <circle cx="285" cy="95" r="34" fill="#fff3c4" opacity="0.9" />
      {motif === "mountain" && (
        <>
          <path d="M0 200 L90 100 L150 170 L230 70 L320 175 L400 120 V260 H0Z" fill="#000" opacity="0.35" />
          <path d="M0 230 L110 150 L200 215 L300 140 L400 210 V260 H0Z" fill="#000" opacity="0.65" />
        </>
      )}
      {motif === "snow" && (
        <>
          <path d="M0 210 L80 90 L140 170 L220 50 L310 170 L400 100 V260 H0Z" fill="#0b1220" opacity="0.7" />
          <path d="M220 50 L195 95 L215 85 L225 100 L240 80 L260 100Z" fill="#fff" opacity="0.9" />
          <path d="M80 90 L62 125 L78 117 L90 128 L104 112Z" fill="#fff" opacity="0.85" />
          <path d="M0 235 L120 170 L220 225 L320 165 L400 220 V260 H0Z" fill="#000" opacity="0.6" />
        </>
      )}
      {motif === "dunes" && (
        <>
          <path d="M0 190 Q100 130 200 185 T400 160 V260 H0Z" fill="#000" opacity="0.3" />
          <path d="M0 225 Q120 170 230 220 T400 200 V260 H0Z" fill="#000" opacity="0.6" />
          <path d="M70 150 h26 v-12 h8 v12 h26 v30 h-60z" fill="#000" opacity="0.4" />
        </>
      )}
      {motif === "waves" && (
        <>
          <path d="M0 170 Q50 150 100 170 T200 170 T300 170 T400 170 V260 H0Z" fill="#000" opacity="0.3" />
          <path d="M0 200 Q50 180 100 200 T200 200 T300 200 T400 200 V260 H0Z" fill="#000" opacity="0.5" />
          <path d="M0 230 Q50 212 100 230 T200 230 T300 230 T400 230 V260 H0Z" fill="#000" opacity="0.7" />
        </>
      )}
      {motif === "forest" && (
        <>
          <path d="M0 210 Q100 160 200 200 T400 180 V260 H0Z" fill="#000" opacity="0.3" />
          {[30, 80, 140, 210, 270, 330, 375].map((x, i) => (
            <path key={x} d={`M${x} ${215 - (i % 3) * 12} l-22 52 h44z M${x} ${185 - (i % 3) * 12} l-17 42 h34z`} fill="#000" opacity="0.7" />
          ))}
        </>
      )}
    </svg>
  );
}
