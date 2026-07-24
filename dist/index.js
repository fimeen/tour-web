// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// server/db.ts
import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// client/src/lib/tourCatalog.ts
var cloudforest = "/manus-storage/cloudforest-passage-v2_05ded329.jpg";
var waterfall = "/manus-storage/cascading-silence-v2_6858beb7.jpg";
var highlands = "/manus-storage/highland-understory-v2_f4c078b3.jpg";
var lakeside = "/manus-storage/cedar-mirror-v2_f920c12f.jpg";
var guide = "/manus-storage/guide-maya-v2_d53f7392.jpg";
var tourCatalog = [
  {
    id: 1,
    slug: "cloudforest-passage",
    title: "Cloudforest Passage",
    subtitle: "Four unhurried days beneath an emerald canopy",
    location: "Monteverde, Costa Rica",
    description: "Enter the cloudforest before the trails wake. Walk suspended bridges, follow hummingbird corridors, and share slow meals at a family-run mountain lodge.",
    price: 1480,
    duration: 4,
    difficulty: "Moderate",
    groupSize: 8,
    cover: cloudforest,
    gallery: [
      { src: cloudforest, alt: "Mossy footbridge winding through a cloudforest" },
      { src: waterfall, alt: "Hidden waterfall descending into a forest pool" },
      { src: lakeside, alt: "Quiet forest lake in the evening mist" }
    ],
    highlights: ["Dawn canopy walk", "Private hummingbird hide", "Night forest listening walk", "Farm-to-table lodge dinners"],
    included: ["Three nights at a forest lodge", "All meals from arrival dinner", "Naturalist guide", "Private trail transfers", "Field journal"],
    excluded: ["International flights", "Travel insurance", "Alcoholic beverages", "Personal equipment"],
    itinerary: [
      { day: 1, title: "Arrive beneath the canopy", description: "Meet in the highland village before a private transfer into the reserve. Settle into the lodge and walk a short fern-lined loop at golden hour.", distance: "2.4 km", meals: ["Dinner"] },
      { day: 2, title: "Where the clouds gather", description: "Enter the upper reserve at first light, cross suspended bridges, and pause for a picnic beside a hidden watershed.", distance: "8 km", elevation: "+420 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "Small wings, old trees", description: "Spend a quiet morning at a private hummingbird hide, then join a local grower for coffee and cacao among the lower forest edges.", distance: "5 km", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "A final listening walk", description: "Walk one last dawn trail before a long table breakfast and onward transfer to San Jos\xE9.", distance: "3 km", meals: ["Breakfast"] }
    ],
    guide: { name: "Maya Calder\xF3n", role: "Cloudforest naturalist \xB7 11 years guiding", bio: "Maya grew up along Costa Rica\u2019s continental divide and reads the forest through birdsong, weather, and the subtle architecture of leaves.", image: guide },
    featured: true
  },
  {
    id: 2,
    slug: "cascading-silence",
    title: "Cascading Silence",
    subtitle: "Waterfall trails and cedar mornings in the northern hills",
    location: "Chiang Mai, Thailand",
    description: "Follow cool river paths through cedar shade, swim beneath remote falls, and share fireside suppers in a small mountain homestay.",
    price: 980,
    duration: 3,
    difficulty: "Easy",
    groupSize: 6,
    cover: waterfall,
    gallery: [
      { src: waterfall, alt: "Waterfall surrounded by deep green forest" },
      { src: cloudforest, alt: "Traveler crossing a rounded timber bridge" },
      { src: highlands, alt: "Forest ridgeline rising above the clouds" }
    ],
    highlights: ["Hidden waterfall swim", "Cedar forest sunrise", "Village cooking session", "Riverside picnic"],
    included: ["Two nights in a mountain homestay", "All meals", "Local guide", "Ground transfers", "Filtered water"],
    excluded: ["Flights to Chiang Mai", "Travel insurance", "Tips", "Personal purchases"],
    itinerary: [
      { day: 1, title: "North into the hills", description: "Leave the city behind for a slow drive to the trailhead, followed by a riverside walk and welcome meal in the village.", distance: "4 km", meals: ["Lunch", "Dinner"] },
      { day: 2, title: "The hidden cascade", description: "Walk under cedar and bamboo to a secluded waterfall, with generous time to swim, sketch, or simply listen.", distance: "7 km", elevation: "+260 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "Smoke, spice, and morning light", description: "Join your hosts in the garden and kitchen before a final forest stroll and return to Chiang Mai.", distance: "2 km", meals: ["Breakfast", "Lunch"] }
    ],
    guide: { name: "Maya Calder\xF3n", role: "Forest field guide \xB7 Slow travel specialist", bio: "Maya brings a gentle, observant pace to every trail and works closely with community hosts to keep each journey rooted in place.", image: guide },
    featured: true
  },
  {
    id: 3,
    slug: "highland-understory",
    title: "Highland Understory",
    subtitle: "Heather, pine, and the hush above the cloudline",
    location: "Cairngorms, Scotland",
    description: "Trace old stalkers\u2019 paths through Caledonian pine, climb into open high country, and sleep in restored stone bothies warmed by wood fire.",
    price: 1860,
    duration: 5,
    difficulty: "Challenging",
    groupSize: 7,
    cover: highlands,
    gallery: [
      { src: highlands, alt: "A highland trail above a sea of cloud" },
      { src: lakeside, alt: "Canoe beside a quiet forest lake" },
      { src: cloudforest, alt: "Misty woodland passage" }
    ],
    highlights: ["Ancient pine reserve", "Remote bothy night", "Sunrise ridge traverse", "Wildlife tracking session"],
    included: ["Four nights lodge and bothy stays", "All trail meals", "Mountain leader", "Luggage transfer", "Safety equipment"],
    excluded: ["Transport to Inverness", "Travel insurance", "Technical clothing", "Single-room upgrade"],
    itinerary: [
      { day: 1, title: "Into the old pinewood", description: "Meet your guide in Aviemore and walk beneath twisted Scots pine to a secluded riverside lodge.", distance: "6 km", meals: ["Dinner"] },
      { day: 2, title: "Tracks in the heather", description: "Learn to read red deer and mountain hare signs before climbing toward the high corries.", distance: "12 km", elevation: "+650 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "A night beyond the road", description: "Cross open moorland to a restored stone bothy and settle in beside the wood stove.", distance: "14 km", elevation: "+520 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "Above the cloudline", description: "Traverse a broad ridge at dawn before descending through a quiet glen.", distance: "13 km", elevation: "+740 m", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 5, title: "River path home", description: "Follow the water through birch and pine, ending with a long table lunch.", distance: "7 km", meals: ["Breakfast", "Lunch"] }
    ],
    guide: { name: "Maya Calder\xF3n", role: "International mountain leader", bio: "Maya has guided high-country journeys across four continents and is known for turning difficult terrain into a calm, shared rhythm.", image: guide },
    featured: true
  },
  {
    id: 4,
    slug: "cedar-mirror",
    title: "Cedar Mirror",
    subtitle: "Paddle quiet water through the temperate rainforest",
    location: "Vancouver Island, Canada",
    description: "Move between cedar forest and still water by canoe, sleep in shoreline cabins, and watch the morning mist lift one layer at a time.",
    price: 1240,
    duration: 4,
    difficulty: "Easy",
    groupSize: 6,
    cover: lakeside,
    gallery: [
      { src: lakeside, alt: "Wooden canoe beside a dark forest lake" },
      { src: cloudforest, alt: "Ancient rainforest trail" },
      { src: waterfall, alt: "Rainforest waterfall" }
    ],
    highlights: ["Dawn canoe paddle", "Old-growth cedar walk", "Shoreline cabin stay", "Forest ecology workshop"],
    included: ["Three cabin nights", "All meals", "Canoe and safety gear", "Naturalist guide", "Harbor transfers"],
    excluded: ["Travel to Vancouver Island", "Travel insurance", "Alcohol", "Personal dry bags"],
    itinerary: [
      { day: 1, title: "Meet the water", description: "Arrive by forest road, learn the quiet rhythm of the canoe, and paddle to your shoreline cabin.", distance: "5 km paddle", meals: ["Dinner"] },
      { day: 2, title: "Cedar cathedral", description: "Cross the lake before breakfast and walk through an old-growth grove with a local ecologist.", distance: "6 km walk", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 3, title: "A day without hurry", description: "Choose a long paddle, a short fern trail, or an afternoon reading beside the wood stove.", distance: "Flexible", meals: ["Breakfast", "Lunch", "Dinner"] },
      { day: 4, title: "Mist lifting", description: "Paddle home at first light and share a final breakfast on the dock.", distance: "5 km paddle", meals: ["Breakfast"] }
    ],
    guide: { name: "Maya Calder\xF3n", role: "Wilderness guide \xB7 Paddle Canada instructor", bio: "Maya\u2019s journeys balance practical confidence with long pauses, leaving space for weather, wildlife, and genuine quiet.", image: guide },
    featured: false
  }
];

// drizzle/schema.ts
import {
  bigint,
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var tours = mysqlTable(
  "tours",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 180 }).notNull(),
    subtitle: varchar("subtitle", { length: 240 }).notNull(),
    location: varchar("location", { length: 180 }).notNull(),
    description: text("description").notNull(),
    price: int("price").notNull(),
    duration: int("duration").notNull(),
    difficulty: mysqlEnum("difficulty", ["Easy", "Moderate", "Challenging"]).notNull().default("Moderate"),
    groupSize: int("groupSize").notNull().default(8),
    images: json("images").$type().notNull(),
    itinerary: json("itinerary").$type().notNull(),
    highlights: json("highlights").$type().notNull(),
    included: json("included").$type().notNull(),
    excluded: json("excluded").$type().notNull(),
    guideName: varchar("guideName", { length: 120 }).notNull(),
    guideRole: varchar("guideRole", { length: 160 }).notNull(),
    guideBio: text("guideBio").notNull(),
    guideImage: text("guideImage").notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
  },
  (table) => [index("tours_slug_idx").on(table.slug), index("tours_featured_idx").on(table.featured)]
);
var bookings = mysqlTable(
  "bookings",
  {
    id: int("id").autoincrement().primaryKey(),
    reference: varchar("reference", { length: 24 }).notNull().unique(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    tourId: int("tourId").notNull().references(() => tours.id, { onDelete: "restrict" }),
    travelDate: bigint("travelDate", { mode: "number" }).notNull(),
    travelers: int("travelers").notNull(),
    firstName: varchar("firstName", { length: 120 }).notNull(),
    lastName: varchar("lastName", { length: 120 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull(),
    notes: text("notes"),
    status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).notNull().default("pending"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
  },
  (table) => [
    index("bookings_user_idx").on(table.userId),
    index("bookings_tour_idx").on(table.tourId),
    index("bookings_status_idx").on(table.status),
    index("bookings_date_idx").on(table.travelDate)
  ]
);
var contactMessages = mysqlTable(
  "contactMessages",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 180 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 220 }).notNull(),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["new", "read", "replied"]).notNull().default("new"),
    createdAt: timestamp("createdAt").defaultNow().notNull()
  },
  (table) => [index("contact_user_idx").on(table.userId), index("contact_status_idx").on(table.status)]
);

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function ensureToursSeeded() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [existing] = await db.select({ value: count() }).from(tours);
  if (Number(existing?.value ?? 0) > 0) return;
  const curatedTours = tourCatalog.map((tour) => ({
    slug: tour.slug,
    title: tour.title,
    subtitle: tour.subtitle,
    location: tour.location,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    difficulty: tour.difficulty,
    groupSize: tour.groupSize,
    images: tour.gallery,
    itinerary: tour.itinerary,
    highlights: tour.highlights,
    included: tour.included,
    excluded: tour.excluded,
    guideName: tour.guide.name,
    guideRole: tour.guide.role,
    guideBio: tour.guide.bio,
    guideImage: tour.guide.image,
    featured: tour.featured
  }));
  try {
    await db.insert(tours).values(curatedTours);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("duplicate")) throw error;
  }
}
async function listTours() {
  await ensureToursSeeded();
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(tours).orderBy(desc(tours.featured), tours.id);
}
async function getTourBySlug(slug) {
  await ensureToursSeeded();
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  return result[0];
}
async function createBooking(booking) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(bookings).values(booking).$returningId();
  const bookingId = inserted[0]?.id;
  if (!bookingId) throw new Error("Booking could not be created");
  const result = await db.select({
    id: bookings.id,
    reference: bookings.reference,
    status: bookings.status,
    travelDate: bookings.travelDate,
    travelers: bookings.travelers,
    tourTitle: tours.title,
    tourSlug: tours.slug
  }).from(bookings).innerJoin(tours, eq(bookings.tourId, tours.id)).where(eq(bookings.id, bookingId)).limit(1);
  return result[0];
}
async function getBookingsForUser(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select({
    id: bookings.id,
    reference: bookings.reference,
    status: bookings.status,
    travelDate: bookings.travelDate,
    travelers: bookings.travelers,
    createdAt: bookings.createdAt,
    tourTitle: tours.title,
    tourSlug: tours.slug,
    tourImage: tours.guideImage
  }).from(bookings).innerJoin(tours, eq(bookings.tourId, tours.id)).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}
async function createContactMessage(message) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(contactMessages).values(message).$returningId();
  return { id: inserted[0]?.id, success: true };
}
async function getAllBookings() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select({
    id: bookings.id,
    reference: bookings.reference,
    status: bookings.status,
    travelDate: bookings.travelDate,
    travelers: bookings.travelers,
    firstName: bookings.firstName,
    lastName: bookings.lastName,
    email: bookings.email,
    phone: bookings.phone,
    notes: bookings.notes,
    createdAt: bookings.createdAt,
    updatedAt: bookings.updatedAt,
    tourTitle: tours.title,
    tourSlug: tours.slug,
    tourLocation: tours.location,
    userName: users.name,
    userEmail: users.email
  }).from(bookings).innerJoin(tours, eq(bookings.tourId, tours.id)).innerJoin(users, eq(bookings.userId, users.id)).orderBy(desc(bookings.createdAt));
}
async function updateBookingStatus(bookingId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
  const result = await db.select({ id: bookings.id, reference: bookings.reference, status: bookings.status }).from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  return result[0];
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
var bookingInputSchema = z2.object({
  tourSlug: z2.string().trim().min(2).max(120),
  travelDate: z2.number().int().positive(),
  travelers: z2.number().int().min(1).max(8),
  firstName: z2.string().trim().min(2).max(120),
  lastName: z2.string().trim().min(2).max(120),
  email: z2.string().trim().email().max(320),
  phone: z2.string().trim().min(7).max(64),
  notes: z2.string().trim().max(1200).optional()
});
var contactInputSchema = z2.object({
  name: z2.string().trim().min(2).max(180),
  email: z2.string().trim().email().max(320),
  subject: z2.string().trim().min(3).max(220),
  message: z2.string().trim().min(12).max(5e3)
});
var bookingStatusSchema = z2.enum(["pending", "confirmed", "completed", "cancelled"]);
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  tours: router({
    list: publicProcedure.query(() => listTours()),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string().trim().min(2).max(120) })).query(({ input }) => getTourBySlug(input.slug))
  }),
  bookings: router({
    create: protectedProcedure.input(bookingInputSchema).mutation(async ({ ctx, input }) => {
      const tour = await getTourBySlug(input.tourSlug);
      if (!tour) throw new TRPCError3({ code: "NOT_FOUND", message: "Journey not found" });
      if (input.travelers > tour.groupSize) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: `This journey is limited to ${tour.groupSize} travelers` });
      }
      const earliestDeparture = /* @__PURE__ */ new Date();
      earliestDeparture.setHours(0, 0, 0, 0);
      earliestDeparture.setDate(earliestDeparture.getDate() + 1);
      if (input.travelDate < earliestDeparture.getTime()) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Choose a future departure date" });
      }
      const reference = `HW-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
      return createBooking({
        reference,
        userId: ctx.user.id,
        tourId: tour.id,
        travelDate: input.travelDate,
        travelers: input.travelers,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        notes: input.notes || null,
        status: "pending"
      });
    }),
    mine: protectedProcedure.query(({ ctx }) => getBookingsForUser(ctx.user.id))
  }),
  contact: router({
    send: publicProcedure.input(contactInputSchema).mutation(
      ({ ctx, input }) => createContactMessage({
        userId: ctx.user?.id ?? null,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: "new"
      })
    )
  }),
  admin: router({
    bookings: adminProcedure.query(() => getAllBookings()),
    updateBookingStatus: adminProcedure.input(z2.object({ bookingId: z2.number().int().positive(), status: bookingStatusSchema })).mutation(async ({ input }) => {
      const updated = await updateBookingStatus(input.bookingId, input.status);
      if (!updated) throw new TRPCError3({ code: "NOT_FOUND", message: "Reservation not found" });
      return updated;
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
