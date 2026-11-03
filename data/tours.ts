/**
 * MVP source of truth for tour packages (per the spec: data-driven config, no CMS yet).
 * NOTE: These are SAMPLE packages with placeholder prices/itineraries.
 * Replace them with Rising Stars Adventure's real trips: just edit this array.
 */

export type Motif = "mountain" | "dunes" | "waves" | "forest" | "snow";
export type Difficulty = "Easy" | "Moderate" | "Challenging";

export interface ItineraryDay {
  day: number;
  title: string;
  details: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  region: string;
  tagline: string;
  days: number;
  nights: number;
  priceInr: number; // per traveller
  difficulty: Difficulty;
  groupSize: string;
  bestSeason: string;
  tags: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  motif: Motif;
  palette: [string, string];
  featured?: boolean;
}

export const TOURS: Tour[] = [
  {
    id: "tour_manali_01",
    slug: "manali-kasol-escape",
    title: "Manali & Kasol Escape",
    destination: "Himachal Pradesh",
    region: "Himalayas",
    tagline: "Riverside camps, pine trails and snow-line views.",
    days: 6,
    nights: 5,
    priceInr: 18500,
    difficulty: "Easy",
    groupSize: "8–16 travellers",
    bestSeason: "Mar – Jun, Sep – Nov",
    tags: ["Mountains", "Camping", "Friends trip"],
    overview:
      "A relaxed Himalayan loop for first-time mountain travellers: Old Manali cafés, Solang Valley, the Parvati river at Kasol and an easy trail to Kheerganga. Small groups, a dedicated trip captain and fixed all-in pricing.",
    highlights: [
      "Riverside camp night at Kasol",
      "Solang Valley adventure activities",
      "Easy trek toward Kheerganga hot springs",
      "Old Manali café and market evenings",
    ],
    inclusions: [
      "5 nights stay (hotel + camp, twin/triple sharing)",
      "Breakfast and dinner daily",
      "AC Tempo Traveller from Chandigarh and back",
      "Trip captain throughout",
      "All permits and entry fees listed in itinerary",
    ],
    exclusions: [
      "Travel to and from Chandigarh",
      "Lunches and personal expenses",
      "Optional activities (paragliding, rafting)",
      "Anything not listed under inclusions",
    ],
    itinerary: [
      { day: 1, title: "Arrive Chandigarh, overnight drive to Manali", details: "Group meets at Chandigarh and begins the scenic overnight drive with a dinner stop." },
      { day: 2, title: "Manali check-in and Old Manali", details: "Freshen up, local sightseeing, Hadimba temple and an evening in Old Manali." },
      { day: 3, title: "Solang Valley day", details: "Full day in Solang with optional adventure activities and snow-line views." },
      { day: 4, title: "Drive to Kasol", details: "Follow the Parvati valley to Kasol. Riverside campsite, bonfire and music night." },
      { day: 5, title: "Kheerganga trail", details: "Easy guided trail toward Kheerganga, return to camp for the final evening." },
      { day: 6, title: "Return to Chandigarh", details: "Morning departure and drop at Chandigarh by evening." },
    ],
    motif: "mountain",
    palette: ["#ff8a1f", "#3a1305"],
    featured: true,
  },
  {
    id: "tour_ladakh_02",
    slug: "ladakh-high-passes",
    title: "Ladakh High Passes",
    destination: "Ladakh",
    region: "Himalayas",
    tagline: "Pangong blues, Nubra dunes and the world's highest roads.",
    days: 8,
    nights: 7,
    priceInr: 34500,
    difficulty: "Challenging",
    groupSize: "6–12 travellers",
    bestSeason: "Jun – Sep",
    tags: ["High altitude", "Road trip", "Photography"],
    overview:
      "Leh, Nubra Valley and Pangong Lake with proper acclimatisation days built in. Expert drivers, oxygen backup and a trip captain who has run these passes many times.",
    highlights: [
      "Khardung La crossing",
      "Camel ride on Hunder sand dunes",
      "Sunrise at Pangong Lake",
      "Leh Palace and monastery visits",
    ],
    inclusions: [
      "7 nights stay with all meals on the road",
      "Inner line permits",
      "Oxygen cylinder and first-aid kit",
      "SUV / Tempo Traveller transfers within Ladakh",
    ],
    exclusions: ["Flights to and from Leh", "Camel ride fee", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Leh", details: "Rest and acclimatise. Short walk to Leh market in the evening." },
      { day: 2, title: "Local Leh sightseeing", details: "Shanti Stupa, Leh Palace, Hall of Fame. Still acclimatising." },
      { day: 3, title: "Leh to Nubra via Khardung La", details: "Cross one of the world's highest motorable passes into Nubra Valley." },
      { day: 4, title: "Nubra: Hunder and Diskit", details: "Diskit monastery, sand dunes and optional camel ride." },
      { day: 5, title: "Nubra to Pangong", details: "Scenic route over Shyok to the Pangong Lake camp." },
      { day: 6, title: "Pangong sunrise, return to Leh", details: "Sunrise by the lake, then drive back via Chang La." },
      { day: 7, title: "Leh buffer and shopping day", details: "Weather buffer day, monasteries and souvenir shopping." },
      { day: 8, title: "Departure", details: "Airport drop." },
    ],
    motif: "snow",
    palette: ["#ffc247", "#1b2a4a"],
    featured: true,
  },
  {
    id: "tour_rajasthan_03",
    slug: "rajasthan-desert-trail",
    title: "Rajasthan Desert Trail",
    destination: "Rajasthan",
    region: "Thar Desert",
    tagline: "Forts, dunes and a night under desert stars.",
    days: 5,
    nights: 4,
    priceInr: 14900,
    difficulty: "Easy",
    groupSize: "8–20 travellers",
    bestSeason: "Oct – Mar",
    tags: ["Culture", "Desert", "Family friendly"],
    overview:
      "Jaisalmer's golden fort, Sam sand dunes with a camp night, Jodhpur's blue lanes and Mehrangarh. A culture-heavy trip with comfortable stays.",
    highlights: [
      "Jaisalmer Fort and havelis",
      "Sam dunes camp with folk performance",
      "Jodhpur blue city walk",
      "Mehrangarh Fort",
    ],
    inclusions: ["4 nights stay", "Breakfast and dinner", "AC vehicle", "Camel safari and camp activities"],
    exclusions: ["Train or flight to Jaisalmer", "Lunches", "Monument camera fees"],
    itinerary: [
      { day: 1, title: "Arrive Jaisalmer", details: "Check-in, Gadisar Lake and sunset at the fort." },
      { day: 2, title: "Fort, havelis and Sam dunes", details: "Morning heritage walk, evening camel safari and desert camp." },
      { day: 3, title: "Desert camp to Jodhpur", details: "Sunrise on the dunes, then drive to Jodhpur." },
      { day: 4, title: "Jodhpur city day", details: "Mehrangarh Fort, Jaswant Thada and blue-city lanes." },
      { day: 5, title: "Departure", details: "Drop at Jodhpur station or airport." },
    ],
    motif: "dunes",
    palette: ["#f5a623", "#4a1d0a"],
  },
  {
    id: "tour_goa_04",
    slug: "goa-sunsets-and-sails",
    title: "Goa Sunsets & Sails",
    destination: "Goa",
    region: "Konkan Coast",
    tagline: "Beach days, water sports and a sunset cruise.",
    days: 4,
    nights: 3,
    priceInr: 11900,
    difficulty: "Easy",
    groupSize: "10–25 travellers",
    bestSeason: "Nov – Feb",
    tags: ["Beach", "Friends trip", "Water sports"],
    overview:
      "North and South Goa in four relaxed days: water sports, Old Goa heritage, a sunset cruise and plenty of free time.",
    highlights: ["Water sports at Baga", "Sunset river cruise", "Old Goa churches", "South Goa beach day"],
    inclusions: ["3 nights stay", "Breakfast daily", "Airport/station transfers", "Sunset cruise"],
    exclusions: ["Travel to Goa", "Lunch and dinner", "Water sports fees"],
    itinerary: [
      { day: 1, title: "Arrive and North Goa beaches", details: "Check-in, Baga and Calangute, evening free." },
      { day: 2, title: "Water sports and sunset cruise", details: "Morning water sports, evening Mandovi river cruise." },
      { day: 3, title: "Old Goa and South Goa", details: "Basilica of Bom Jesus, then Palolem or Colva beach." },
      { day: 4, title: "Departure", details: "Checkout and transfer." },
    ],
    motif: "waves",
    palette: ["#ff6b4a", "#0d2a3a"],
  },
  {
    id: "tour_meghalaya_05",
    slug: "meghalaya-living-roots",
    title: "Meghalaya Living Roots",
    destination: "Meghalaya",
    region: "North-East India",
    tagline: "Root bridges, crystal rivers and cloud-level villages.",
    days: 6,
    nights: 5,
    priceInr: 22500,
    difficulty: "Moderate",
    groupSize: "6–14 travellers",
    bestSeason: "Oct – May",
    tags: ["Nature", "Trekking", "Offbeat"],
    overview:
      "Shillong, Cherrapunji and Dawki: the double-decker living root bridge trek, Mawlynnong village and the clear waters of Umngot river.",
    highlights: ["Double-decker root bridge trek", "Dawki boat ride", "Mawlynnong village", "Nohkalikai Falls"],
    inclusions: ["5 nights stay", "Breakfast and dinner", "Local transport", "Trek guide"],
    exclusions: ["Flights to Guwahati", "Lunches", "Boat ride fees"],
    itinerary: [
      { day: 1, title: "Guwahati to Shillong", details: "Pickup and scenic drive to Shillong." },
      { day: 2, title: "Shillong sightseeing", details: "Elephant Falls, Shillong Peak and Police Bazaar." },
      { day: 3, title: "Cherrapunji", details: "Nohkalikai Falls and Seven Sisters viewpoint." },
      { day: 4, title: "Root bridge trek", details: "Descend to the double-decker living root bridge." },
      { day: 5, title: "Dawki and Mawlynnong", details: "Boat ride on Umngot and a walk through Mawlynnong." },
      { day: 6, title: "Return to Guwahati", details: "Drive back for onward travel." },
    ],
    motif: "forest",
    palette: ["#7bd88f", "#06231a"],
    featured: true,
  },
  {
    id: "tour_tadoba_06",
    slug: "tadoba-wild-weekend",
    title: "Tadoba Wild Weekend",
    destination: "Maharashtra",
    region: "Vidarbha",
    tagline: "Tiger country, just a short drive from Nagpur.",
    days: 3,
    nights: 2,
    priceInr: 9500,
    difficulty: "Easy",
    groupSize: "6–12 travellers",
    bestSeason: "Oct – Jun",
    tags: ["Wildlife", "Weekend", "Near Nagpur"],
    overview:
      "A weekend safari at Tadoba Andhari Tiger Reserve with two safaris, a naturalist and forest-edge stays. Ideal as a quick escape from Nagpur.",
    highlights: ["Two jeep safaris", "Naturalist-led sessions", "Forest-edge resort stay", "Short drive from Nagpur"],
    inclusions: ["2 nights stay", "All meals", "Transport from Nagpur", "Two safaris (permits subject to availability)"],
    exclusions: ["Camera fees", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Nagpur to Tadoba", details: "Morning pickup, check-in and an evening safari." },
      { day: 2, title: "Full safari day", details: "Morning safari, rest, then a second safari." },
      { day: 3, title: "Return to Nagpur", details: "Breakfast and drop in Nagpur by afternoon." },
    ],
    motif: "forest",
    palette: ["#ffb347", "#1c1205"],
  },
];

export function getTour(idOrSlug: string): Tour | undefined {
  return TOURS.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}

export const FEATURED_TOURS = TOURS.filter((t) => t.featured);
