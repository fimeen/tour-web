export type TourPreview = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  price: number;
  duration: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  groupSize: number;
  cover: string;
  gallery: { src: string; alt: string }[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    distance?: string;
    elevation?: string;
    meals?: string[];
  }[];
  guide: {
    name: string;
    role: string;
    bio: string;
    image: string;
  };
  featured: boolean;
};

const cloudforest = "/manus-storage/cloudforest-passage-v2_05ded329.jpg";
const waterfall = "/manus-storage/cascading-silence-v2_6858beb7.jpg";
const highlands = "/manus-storage/highland-understory-v2_f4c078b3.jpg";
const lakeside = "/manus-storage/cedar-mirror-v2_f920c12f.jpg";
const guide = "/manus-storage/guide-maya-v2_d53f7392.jpg";

export const tourCatalog: TourPreview[] = [
  {
    id: 1,
    slug: "cloudforest-passage",
    title: "Cloudforest Passage",
    subtitle: "Four unhurried days beneath an emerald canopy",
    location: "Monteverde, Costa Rica",
    description:
      "Enter the cloudforest before the trails wake. Walk suspended bridges, follow hummingbird corridors, and share slow meals at a family-run mountain lodge.",
    price: 1480,
    duration: 4,
    difficulty: "Moderate",
    groupSize: 8,
    cover: cloudforest,
    gallery: [
      { src: cloudforest, alt: "Mossy footbridge winding through a cloudforest" },
      { src: waterfall, alt: "Hidden waterfall descending into a forest pool" },
      { src: lakeside, alt: "Quiet forest lake in the evening mist" },
    ],
    highlights: ["Dawn canopy walk", "Private hummingbird hide", "Night forest listening walk", "Farm-to-table lodge dinners"],
    included: ["Three nights at a forest lodge", "All meals from arrival dinner", "Naturalist guide", "Private trail transfers", "Field journal"],
    excluded: ["International flights", "Travel insurance", "Alcoholic beverages", "Personal equipment"],
    itinerary: [
      { day: 1, title: "Arrive beneath the canopy", description: "Meet in the highland village before a private transfer into the reserve. Settle into the lodge and walk a short fern-lined loop at golden hour.", distance: "2.4 km", meals: ["Dinner"] },
      { day: 2, title: "Where the clouds gather", description: "Enter the upper reserve at first light, cross suspended bridges, and pause for a picnic beside a hidden watershed.", distance: "8 km", elevation: "+420 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "Small wings, old trees", description: "Spend a quiet morning at a private hummingbird hide, then join a local grower for coffee and cacao among the lower forest edges.", distance: "5 km", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "A final listening walk", description: "Walk one last dawn trail before a long table breakfast and onward transfer to San José.", distance: "3 km", meals: ["Breakfast"] },
    ],
    guide: { name: "Maya Calderón", role: "Cloudforest naturalist · 11 years guiding", bio: "Maya grew up along Costa Rica’s continental divide and reads the forest through birdsong, weather, and the subtle architecture of leaves.", image: guide },
    featured: true,
  },
  {
    id: 2,
    slug: "cascading-silence",
    title: "Cascading Silence",
    subtitle: "Waterfall trails and cedar mornings in the northern hills",
    location: "Chiang Mai, Thailand",
    description:
      "Follow cool river paths through cedar shade, swim beneath remote falls, and share fireside suppers in a small mountain homestay.",
    price: 980,
    duration: 3,
    difficulty: "Easy",
    groupSize: 6,
    cover: waterfall,
    gallery: [
      { src: waterfall, alt: "Waterfall surrounded by deep green forest" },
      { src: cloudforest, alt: "Traveler crossing a rounded timber bridge" },
      { src: highlands, alt: "Forest ridgeline rising above the clouds" },
    ],
    highlights: ["Hidden waterfall swim", "Cedar forest sunrise", "Village cooking session", "Riverside picnic"],
    included: ["Two nights in a mountain homestay", "All meals", "Local guide", "Ground transfers", "Filtered water"],
    excluded: ["Flights to Chiang Mai", "Travel insurance", "Tips", "Personal purchases"],
    itinerary: [
      { day: 1, title: "North into the hills", description: "Leave the city behind for a slow drive to the trailhead, followed by a riverside walk and welcome meal in the village.", distance: "4 km", meals: ["Lunch", "Dinner"] },
      { day: 2, title: "The hidden cascade", description: "Walk under cedar and bamboo to a secluded waterfall, with generous time to swim, sketch, or simply listen.", distance: "7 km", elevation: "+260 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "Smoke, spice, and morning light", description: "Join your hosts in the garden and kitchen before a final forest stroll and return to Chiang Mai.", distance: "2 km", meals: ["Breakfast", "Lunch"] },
    ],
    guide: { name: "Maya Calderón", role: "Forest field guide · Slow travel specialist", bio: "Maya brings a gentle, observant pace to every trail and works closely with community hosts to keep each journey rooted in place.", image: guide },
    featured: true,
  },
  {
    id: 3,
    slug: "highland-understory",
    title: "Highland Understory",
    subtitle: "Heather, pine, and the hush above the cloudline",
    location: "Cairngorms, Scotland",
    description:
      "Trace old stalkers’ paths through Caledonian pine, climb into open high country, and sleep in restored stone bothies warmed by wood fire.",
    price: 1860,
    duration: 5,
    difficulty: "Challenging",
    groupSize: 7,
    cover: highlands,
    gallery: [
      { src: highlands, alt: "A highland trail above a sea of cloud" },
      { src: lakeside, alt: "Canoe beside a quiet forest lake" },
      { src: cloudforest, alt: "Misty woodland passage" },
    ],
    highlights: ["Ancient pine reserve", "Remote bothy night", "Sunrise ridge traverse", "Wildlife tracking session"],
    included: ["Four nights lodge and bothy stays", "All trail meals", "Mountain leader", "Luggage transfer", "Safety equipment"],
    excluded: ["Transport to Inverness", "Travel insurance", "Technical clothing", "Single-room upgrade"],
    itinerary: [
      { day: 1, title: "Into the old pinewood", description: "Meet your guide in Aviemore and walk beneath twisted Scots pine to a secluded riverside lodge.", distance: "6 km", meals: ["Dinner"] },
      { day: 2, title: "Tracks in the heather", description: "Learn to read red deer and mountain hare signs before climbing toward the high corries.", distance: "12 km", elevation: "+650 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "A night beyond the road", description: "Cross open moorland to a restored stone bothy and settle in beside the wood stove.", distance: "14 km", elevation: "+520 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "Above the cloudline", description: "Traverse a broad ridge at dawn before descending through a quiet glen.", distance: "13 km", elevation: "+740 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 5, title: "River path home", description: "Follow the water through birch and pine, ending with a long table lunch.", distance: "7 km", meals: ["Breakfast", "Lunch"] },
    ],
    guide: { name: "Maya Calderón", role: "International mountain leader", bio: "Maya has guided high-country journeys across four continents and is known for turning difficult terrain into a calm, shared rhythm.", image: guide },
    featured: true,
  },
  {
    id: 4,
    slug: "cedar-mirror",
    title: "Cedar Mirror",
    subtitle: "Paddle quiet water through the temperate rainforest",
    location: "Vancouver Island, Canada",
    description:
      "Move between cedar forest and still water by canoe, sleep in shoreline cabins, and watch the morning mist lift one layer at a time.",
    price: 1240,
    duration: 4,
    difficulty: "Easy",
    groupSize: 6,
    cover: lakeside,
    gallery: [
      { src: lakeside, alt: "Wooden canoe beside a dark forest lake" },
      { src: cloudforest, alt: "Ancient rainforest trail" },
      { src: waterfall, alt: "Rainforest waterfall" },
    ],
    highlights: ["Dawn canoe paddle", "Old-growth cedar walk", "Shoreline cabin stay", "Forest ecology workshop"],
    included: ["Three cabin nights", "All meals", "Canoe and safety gear", "Naturalist guide", "Harbor transfers"],
    excluded: ["Travel to Vancouver Island", "Travel insurance", "Alcohol", "Personal dry bags"],
    itinerary: [
      { day: 1, title: "Meet the water", description: "Arrive by forest road, learn the quiet rhythm of the canoe, and paddle to your shoreline cabin.", distance: "5 km paddle", meals: ["Dinner"] },
      { day: 2, title: "Cedar cathedral", description: "Cross the lake before breakfast and walk through an old-growth grove with a local ecologist.", distance: "6 km walk", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "A day without hurry", description: "Choose a long paddle, a short fern trail, or an afternoon reading beside the wood stove.", distance: "Flexible", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "Mist lifting", description: "Paddle home at first light and share a final breakfast on the dock.", distance: "5 km paddle", meals: ["Breakfast"] },
    ],
    guide: { name: "Maya Calderón", role: "Wilderness guide · Paddle Canada instructor", bio: "Maya’s journeys balance practical confidence with long pauses, leaving space for weather, wildlife, and genuine quiet.", image: guide },
    featured: false,
  },
];

export const getTourBySlug = (slug: string) => tourCatalog.find(tour => tour.slug === slug);
