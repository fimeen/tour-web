import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import SiteFooter from "@/components/SiteFooter";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Compass, Loader2, MapPin, Sprout, UsersRound } from "lucide-react";
import { Link } from "wouter";

const statusStyles = {
  pending: "bg-[#d8c09e] text-[#17372a]",
  confirmed: "bg-[#17372a] text-[#f6f2e8]",
  completed: "bg-[#5f765f] text-white",
  cancelled: "bg-[#86584d] text-white",
} as const;

export default function MyBookings() {
  const { user, loading, isAuthenticated } = useAuth();
  const bookings = trpc.bookings.mine.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  if (loading) return <PageLoader />;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <GlobalNav />
        <main id="main-content" className="container flex min-h-screen items-center justify-center py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><Compass className="h-6 w-6" /></span>
            <p className="mt-7 eyebrow justify-center text-[#795337]">Traveler account</p>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.9] sm:text-7xl">Your journeys live <em className="text-primary">here.</em></h1>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">Sign in securely to view reservation status and departure details.</p>
            <button type="button" onClick={() => startLogin()} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground">Sign in to continue <ArrowRight className="h-4 w-4" /></button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content" className="container pb-24 pt-32 sm:pt-40">
        <MotionReveal>
          <p className="eyebrow text-[#795337]">Traveler journal</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.88] tracking-[-0.04em] sm:text-8xl">Your journeys, <em className="text-primary">kept close.</em></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">Follow each reservation from first request to forest path.</p>
        </MotionReveal>

        {bookings.isLoading ? (
          <div className="mt-12 flex min-h-[360px] items-center justify-center rounded-[2.5rem] bg-card"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : bookings.error ? (
          <div className="mt-12 rounded-[2.5rem] bg-[#86584d]/10 p-8 text-center"><p className="font-display text-4xl font-semibold">We couldn’t open your journal.</p><button type="button" onClick={() => bookings.refetch()} className="mt-5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Try again</button></div>
        ) : bookings.data?.length ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {bookings.data.map((booking, index) => (
              <MotionReveal key={booking.id} delay={(index % 2) * 0.07} className="hushwood-card p-3">
                <div className="rounded-[2rem] bg-secondary/55 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{booking.reference}</p><h2 className="mt-3 font-display text-4xl font-semibold leading-none">{booking.tourTitle}</h2></div>
                    <span className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}>{booking.status}</span>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <BookingMeta icon={CalendarDays} label="Departure" value={format(new Date(booking.travelDate), "MMM d, yyyy")} />
                    <BookingMeta icon={UsersRound} label="Travelers" value={String(booking.travelers)} />
                    <BookingMeta icon={MapPin} label="Requested" value={format(new Date(booking.createdAt), "MMM d")} />
                  </div>
                  <Link href={`/tours/${booking.tourSlug}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">View journey <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </MotionReveal>
            ))}
          </div>
        ) : (
          <MotionReveal className="mt-12 flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-primary/18 bg-card p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><Sprout className="h-6 w-6" /></span>
            <h2 className="mt-6 font-display text-5xl font-semibold">No paths held yet.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">When you request a departure, it will appear here with its live status.</p>
            <Link href="/tours" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Find a journey <ArrowRight className="h-4 w-4" /></Link>
          </MotionReveal>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function BookingMeta({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="rounded-[1.5rem] bg-card p-4"><Icon className="h-4 w-4 text-primary" /><p className="mt-4 text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content" className="container pb-24 pt-32 sm:pt-40" aria-busy="true" aria-label="Loading your journeys">
        <div className="animate-pulse">
          <div className="h-3 w-36 rounded-full bg-primary/12" />
          <div className="mt-6 h-16 max-w-2xl rounded-full bg-primary/8 sm:h-24" />
          <div className="mt-5 h-4 w-72 max-w-full rounded-full bg-primary/8" />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {[0, 1].map(item => (
              <div key={item} className="hushwood-card p-3">
                <div className="min-h-[290px] rounded-[2rem] bg-secondary/70 p-6 sm:p-8">
                  <div className="h-3 w-24 rounded-full bg-primary/10" />
                  <div className="mt-5 h-10 w-3/4 rounded-full bg-primary/10" />
                  <div className="mt-10 grid grid-cols-3 gap-3">
                    {[0, 1, 2].map(meta => <div key={meta} className="h-24 rounded-[1.5rem] bg-card" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
