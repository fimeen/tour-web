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
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type TourImage = {
  src: string;
  alt: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  distance?: string;
  elevation?: string;
  meals?: string[];
};

export const tours = mysqlTable(
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
    difficulty: mysqlEnum("difficulty", ["Easy", "Moderate", "Challenging"])
      .notNull()
      .default("Moderate"),
    groupSize: int("groupSize").notNull().default(8),
    images: json("images").$type<TourImage[]>().notNull(),
    itinerary: json("itinerary").$type<ItineraryDay[]>().notNull(),
    highlights: json("highlights").$type<string[]>().notNull(),
    included: json("included").$type<string[]>().notNull(),
    excluded: json("excluded").$type<string[]>().notNull(),
    guideName: varchar("guideName", { length: 120 }).notNull(),
    guideRole: varchar("guideRole", { length: 160 }).notNull(),
    guideBio: text("guideBio").notNull(),
    guideImage: text("guideImage").notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("tours_slug_idx").on(table.slug), index("tours_featured_idx").on(table.featured)],
);

export const bookings = mysqlTable(
  "bookings",
  {
    id: int("id").autoincrement().primaryKey(),
    reference: varchar("reference", { length: 24 }).notNull().unique(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tourId: int("tourId")
      .notNull()
      .references(() => tours.id, { onDelete: "restrict" }),
    travelDate: bigint("travelDate", { mode: "number" }).notNull(),
    travelers: int("travelers").notNull(),
    firstName: varchar("firstName", { length: 120 }).notNull(),
    lastName: varchar("lastName", { length: 120 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull(),
    notes: text("notes"),
    status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"])
      .notNull()
      .default("pending"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("bookings_user_idx").on(table.userId),
    index("bookings_tour_idx").on(table.tourId),
    index("bookings_status_idx").on(table.status),
    index("bookings_date_idx").on(table.travelDate),
  ],
);

export const contactMessages = mysqlTable(
  "contactMessages",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 180 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 220 }).notNull(),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["new", "read", "replied"]).notNull().default("new"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("contact_user_idx").on(table.userId), index("contact_status_idx").on(table.status)],
);

export type Tour = typeof tours.$inferSelect;
export type InsertTour = typeof tours.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
