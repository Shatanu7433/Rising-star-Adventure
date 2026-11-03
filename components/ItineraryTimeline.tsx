"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/data/tours";

export default function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(days[0]?.day ?? null);

  return (
    <ol className="relative space-y-3 border-l border-ember/30 pl-5 sm:pl-7">
      {days.map((d) => {
        const isOpen = open === d.day;
        return (
          <li key={d.day} className="relative">
            <span className="absolute -left-[1.85rem] top-4 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] font-black text-black sm:-left-[2.45rem] sm:h-6 sm:w-6 sm:text-xs">
              {d.day}
            </span>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`day-${d.day}`}
              onClick={() => setOpen(isOpen ? null : d.day)}
              className="flex min-h-[52px] w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-panel px-4 py-3 text-left transition hover:border-ember/50"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest text-ember">Day {d.day}</span>
                <span className="block font-bold">{d.title}</span>
              </span>
              <span className={`text-xl text-ember transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {isOpen && (
              <p id={`day-${d.day}`} className="px-4 pb-1 pt-3 text-sm leading-relaxed text-white/70">
                {d.details}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
