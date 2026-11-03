import { WhatsAppIcon } from "@/components/Icons";
import { whatsappLink } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi Rising Stars Adventure! I'd like to know more about your trips.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-black shadow-[0_10px_30px_-6px_rgba(37,211,102,0.7)] transition hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
