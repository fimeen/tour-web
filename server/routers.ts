import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const bookingInputSchema = z.object({
  tourSlug: z.string().trim().min(2).max(120),
  travelDate: z.number().int().positive(),
  travelers: z.number().int().min(1).max(8),
  firstName: z.string().trim().min(2).max(120),
  lastName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(64),
  notes: z.string().trim().max(1200).optional(),
});

export const contactInputSchema = z.object({
  name: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(3).max(220),
  message: z.string().trim().min(12).max(5000),
});

const bookingStatusSchema = z.enum(["pending", "confirmed", "completed", "cancelled"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tours: router({
    list: publicProcedure.query(() => db.listTours()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string().trim().min(2).max(120) }))
      .query(({ input }) => db.getTourBySlug(input.slug)),
  }),
  bookings: router({
    create: protectedProcedure.input(bookingInputSchema).mutation(async ({ ctx, input }) => {
      const tour = await db.getTourBySlug(input.tourSlug);
      if (!tour) throw new TRPCError({ code: "NOT_FOUND", message: "Journey not found" });
      if (input.travelers > tour.groupSize) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `This journey is limited to ${tour.groupSize} travelers` });
      }

      const earliestDeparture = new Date();
      earliestDeparture.setHours(0, 0, 0, 0);
      earliestDeparture.setDate(earliestDeparture.getDate() + 1);
      if (input.travelDate < earliestDeparture.getTime()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Choose a future departure date" });
      }

      const reference = `HW-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
      return db.createBooking({
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
        status: "pending",
      });
    }),
    mine: protectedProcedure.query(({ ctx }) => db.getBookingsForUser(ctx.user.id)),
  }),
  contact: router({
    send: publicProcedure.input(contactInputSchema).mutation(({ ctx, input }) =>
      db.createContactMessage({
        userId: ctx.user?.id ?? null,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: "new",
      }),
    ),
  }),
  admin: router({
    bookings: adminProcedure.query(() => db.getAllBookings()),
    updateBookingStatus: adminProcedure
      .input(z.object({ bookingId: z.number().int().positive(), status: bookingStatusSchema }))
      .mutation(async ({ input }) => {
        const updated = await db.updateBookingStatus(input.bookingId, input.status);
        if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Reservation not found" });
        return updated;
      }),
  }),
});

export type AppRouter = typeof appRouter;
