export const SITE = {
  name: "Rising Stars Adventure",
  tagline: "Small-group adventures, honest pricing, zero hidden surcharges.",
  phoneDisplay: "+91 98225 62704",
  phoneTel: "+919822562704",
  whatsappNumber: "919822562704",
  email: "therisingstarsadventure@gmail.com",
  baseCity: "Nagpur, Maharashtra",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  whatsappGroup: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
