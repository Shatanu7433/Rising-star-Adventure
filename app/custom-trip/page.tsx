import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Plan a Custom Trip",
  description: "Tell Rising Stars Adventure where you want to go and we'll design a custom itinerary and quote for your group.",
};

export default function CustomTripPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Tailor-made</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
        Plan your <span className="text-gradient">custom trip</span>
      </h1>
      <p className="mt-4 text-white/65">
        Share a few details and we&apos;ll come back with a personalised itinerary and a clear, all-in quote.
      </p>
      <div className="mt-10">
        <InquiryForm />
      </div>
    </div>
  );
}
