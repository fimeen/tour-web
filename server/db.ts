import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { tourCatalog } from "../client/src/lib/tourCatalog";
import {
  bookings,
  contactMessages,
  InsertBooking,
  InsertContactMessage,
  InsertUser,
  tours,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

async function ensureToursSeeded() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [existing] = await db.select({ value: count() }).from(tours);
  if (Number(existing?.value ?? 0) > 0) return;

  const curatedTours = tourCatalog.map(tour => ({
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
    featured: tour.featured,
  }));

  try {
    await db.insert(tours).values(curatedTours);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("duplicate")) throw error;
  }
}

export async function listTours() {
  await ensureToursSeeded();
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(tours).orderBy(desc(tours.featured), tours.id);
}

export async function getTourBySlug(slug: string) {
  await ensureToursSeeded();
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.select().from(tours).where(eq(tours.slug, slug)).limit(1);
  return result[0];
}

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(bookings).values(booking).$returningId();
  const bookingId = inserted[0]?.id;
  if (!bookingId) throw new Error("Booking could not be created");

  const result = await db
    .select({
      id: bookings.id,
      reference: bookings.reference,
      status: bookings.status,
      travelDate: bookings.travelDate,
      travelers: bookings.travelers,
      tourTitle: tours.title,
      tourSlug: tours.slug,
    })
    .from(bookings)
    .innerJoin(tours, eq(bookings.tourId, tours.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  return result[0];
}

export async function getBookingsForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db
    .select({
      id: bookings.id,
      reference: bookings.reference,
      status: bookings.status,
      travelDate: bookings.travelDate,
      travelers: bookings.travelers,
      createdAt: bookings.createdAt,
      tourTitle: tours.title,
      tourSlug: tours.slug,
      tourImage: tours.guideImage,
    })
    .from(bookings)
    .innerJoin(tours, eq(bookings.tourId, tours.id))
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt));
}

export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const inserted = await db.insert(contactMessages).values(message).$returningId();
  return { id: inserted[0]?.id, success: true as const };
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db
    .select({
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
      userEmail: users.email,
    })
    .from(bookings)
    .innerJoin(tours, eq(bookings.tourId, tours.id))
    .innerJoin(users, eq(bookings.userId, users.id))
    .orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(
  bookingId: number,
  status: "pending" | "confirmed" | "completed" | "cancelled",
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
  const result = await db
    .select({ id: bookings.id, reference: bookings.reference, status: bookings.status })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  return result[0];
}
