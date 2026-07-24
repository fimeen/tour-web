import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  listTours: vi.fn(),
  getTourBySlug: vi.fn(),
  createBooking: vi.fn(),
  getBookingsForUser: vi.fn(),
  createContactMessage: vi.fn(),
  getAllBookings: vi.fn(),
  updateBookingStatus: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import * as db from "./db";
import { appRouter, bookingInputSchema, contactInputSchema } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const baseUser: AuthenticatedUser = {
  id: 7,
  openId: "traveler-open-id",
  email: "traveler@example.com",
  name: "River Hart",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  lastSignedIn: new Date("2026-01-01T00:00:00.000Z"),
};

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function validBookingInput(overrides: Partial<ReturnType<typeof bookingInputSchema.parse>> = {}) {
  const departure = new Date();
  departure.setHours(0, 0, 0, 0);
  departure.setDate(departure.getDate() + 14);

  return {
    tourSlug: "cloudforest-passage",
    travelDate: departure.getTime(),
    travelers: 2,
    firstName: "River",
    lastName: "Hart",
    email: "river@example.com",
    phone: "+66 81 234 5678",
    notes: "Vegetarian meals, please.",
    ...overrides,
  };
}

const tourRecord = {
  id: 11,
  slug: "cloudforest-passage",
  title: "Cloudforest Passage",
  groupSize: 6,
};

describe("Hushwood input contracts", () => {
  it("accepts the exact valid booking shape", () => {
    expect(bookingInputSchema.safeParse(validBookingInput()).success).toBe(true);
  });

  it("rejects invalid traveler counts and contact details", () => {
    expect(bookingInputSchema.safeParse(validBookingInput({ travelers: 0 })).success).toBe(false);
    expect(bookingInputSchema.safeParse(validBookingInput({ email: "not-an-email" })).success).toBe(false);
    expect(contactInputSchema.safeParse({ name: "R", email: "bad", subject: "Hi", message: "Too short" }).success).toBe(false);
  });
});

describe("tours procedures", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns the curated tour collection", async () => {
    vi.mocked(db.listTours).mockResolvedValue([tourRecord] as never);
    const result = await appRouter.createCaller(createContext()).tours.list();
    expect(result).toEqual([tourRecord]);
    expect(db.listTours).toHaveBeenCalledOnce();
  });

  it("surfaces a controlled tour data failure", async () => {
    vi.mocked(db.listTours).mockRejectedValue(new Error("tour database unavailable"));
    await expect(appRouter.createCaller(createContext()).tours.list()).rejects.toThrow("tour database unavailable");
  });
});

describe("bookings procedures", () => {
  beforeEach(() => vi.resetAllMocks());

  it("protects the personal journey journal", async () => {
    await expect(appRouter.createCaller(createContext()).bookings.mine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("calls bookings.mine for the authenticated traveler and returns an empty state", async () => {
    vi.mocked(db.getBookingsForUser).mockResolvedValue([]);
    const result = await appRouter.createCaller(createContext(baseUser)).bookings.mine();
    expect(result).toEqual([]);
    expect(db.getBookingsForUser).toHaveBeenCalledWith(baseUser.id);
  });

  it("surfaces a repeatable bookings.mine error for the UI retry state", async () => {
    vi.mocked(db.getBookingsForUser).mockRejectedValue(new Error("journey journal unavailable"));
    await expect(appRouter.createCaller(createContext(baseUser)).bookings.mine()).rejects.toThrow("journey journal unavailable");
  });

  it("rejects unknown tours, oversized groups, and past departures", async () => {
    vi.mocked(db.getTourBySlug).mockResolvedValueOnce(undefined);
    await expect(appRouter.createCaller(createContext(baseUser)).bookings.create(validBookingInput())).rejects.toMatchObject({ code: "NOT_FOUND" });

    vi.mocked(db.getTourBySlug).mockResolvedValueOnce({ ...tourRecord, groupSize: 1 } as never);
    await expect(appRouter.createCaller(createContext(baseUser)).bookings.create(validBookingInput({ travelers: 2 }))).rejects.toMatchObject({ code: "BAD_REQUEST" });

    vi.mocked(db.getTourBySlug).mockResolvedValueOnce(tourRecord as never);
    await expect(appRouter.createCaller(createContext(baseUser)).bookings.create(validBookingInput({ travelDate: Date.now() - 86_400_000 }))).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("creates a pending reservation with the authenticated user id", async () => {
    const created = { id: 91, reference: "HW-FOREST", status: "pending" };
    vi.mocked(db.getTourBySlug).mockResolvedValue(tourRecord as never);
    vi.mocked(db.createBooking).mockResolvedValue(created as never);

    const result = await appRouter.createCaller(createContext(baseUser)).bookings.create(validBookingInput());

    expect(result).toEqual(created);
    expect(db.createBooking).toHaveBeenCalledWith(expect.objectContaining({
      userId: baseUser.id,
      tourId: tourRecord.id,
      travelers: 2,
      status: "pending",
    }));
  });

  it("surfaces a controlled booking write failure", async () => {
    vi.mocked(db.getTourBySlug).mockResolvedValue(tourRecord as never);
    vi.mocked(db.createBooking).mockRejectedValue(new Error("reservation write failed"));
    await expect(appRouter.createCaller(createContext(baseUser)).bookings.create(validBookingInput())).rejects.toThrow("reservation write failed");
  });
});

describe("contact and admin procedures", () => {
  beforeEach(() => vi.resetAllMocks());

  const contactInput = {
    name: "River Hart",
    email: "river@example.com",
    subject: "Cloudforest question",
    message: "Could you share more detail about the daily walking pace?",
  };

  it("stores an anonymous contact message and surfaces a controlled failure", async () => {
    vi.mocked(db.createContactMessage).mockResolvedValueOnce({ id: 8 } as never);
    await appRouter.createCaller(createContext()).contact.send(contactInput);
    expect(db.createContactMessage).toHaveBeenCalledWith(expect.objectContaining({ userId: null, status: "new" }));

    vi.mocked(db.createContactMessage).mockRejectedValueOnce(new Error("contact inbox unavailable"));
    await expect(appRouter.createCaller(createContext()).contact.send(contactInput)).rejects.toThrow("contact inbox unavailable");
  });

  it("blocks non-admin users from reservation management", async () => {
    await expect(appRouter.createCaller(createContext(baseUser)).admin.bookings()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(db.getAllBookings).not.toHaveBeenCalled();
  });

  it("returns reservations for admins and surfaces a list failure", async () => {
    const admin = { ...baseUser, id: 1, role: "admin" as const };
    vi.mocked(db.getAllBookings).mockResolvedValueOnce([]);
    expect(await appRouter.createCaller(createContext(admin)).admin.bookings()).toEqual([]);

    vi.mocked(db.getAllBookings).mockRejectedValueOnce(new Error("admin reservations unavailable"));
    await expect(appRouter.createCaller(createContext(admin)).admin.bookings()).rejects.toThrow("admin reservations unavailable");
  });

  it("updates one reservation status and rejects missing reservations", async () => {
    const admin = { ...baseUser, id: 1, role: "admin" as const };
    const updated = { id: 91, reference: "HW-FOREST", status: "confirmed" };
    vi.mocked(db.updateBookingStatus).mockResolvedValueOnce(updated as never);

    expect(await appRouter.createCaller(createContext(admin)).admin.updateBookingStatus({ bookingId: 91, status: "confirmed" })).toEqual(updated);
    expect(db.updateBookingStatus).toHaveBeenCalledWith(91, "confirmed");

    vi.mocked(db.updateBookingStatus).mockResolvedValueOnce(undefined);
    await expect(appRouter.createCaller(createContext(admin)).admin.updateBookingStatus({ bookingId: 404, status: "cancelled" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
