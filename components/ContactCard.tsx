import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { SITE, whatsappLink } from "@/lib/site";

export default function ContactCard() {
  return (
    <div className="card w-full max-w-2xl p-6 sm:p-10">
      <h2 className="text-3xl font-black sm:text-4xl">Contact Us</h2>

      <dl className="mt-8 space-y-6">
        <div className="flex gap-4">
          <span className="text-2xl" aria-hidden="true">📞</span>
          <div>
            <dt className="text-sm text-white/60">Call / WhatsApp</dt>
            <dd className="text-xl font-bold sm:text-2xl">
              <a href={`tel:${SITE.phoneTel}`} className="hover:text-ember">{SITE.phoneDisplay}</a>
            </dd>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-2xl" aria-hidden="true">📧</span>
          <div className="min-w-0">
            <dt className="text-sm text-white/60">Email</dt>
            <dd className="text-lg font-bold sm:text-2xl">
              <a href={`mailto:${SITE.email}`} className="hover:text-ember">
                {SITE.email.split("@")[0]}
                <wbr />@{SITE.email.split("@")[1]}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-2xl" aria-hidden="true">📍</span>
          <div>
            <dt className="text-sm text-white/60">Base City</dt>
            <dd className="text-xl font-bold sm:text-2xl">{SITE.baseCity}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        {SITE.instagram && (
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-5 font-bold transition hover:border-white/40"
          >
            <InstagramIcon /> Instagram
          </a>
        )}
        {SITE.whatsappGroup && (
          <a
            href={SITE.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-wa/70 bg-wa/10 px-5 font-bold text-wa transition hover:bg-wa/20"
          >
            <WhatsAppIcon /> Join Group
          </a>
        )}
        <a
          href={whatsappLink("Hi Rising Stars Adventure! I'd like to know more about your trips.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-wa/70 bg-wa/10 px-5 font-bold text-wa transition hover:bg-wa/20"
        >
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>
    </div>
  );
}
