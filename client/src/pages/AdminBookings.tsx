import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarDays, CheckCircle2, ChevronDown, CircleEllipsis, Clock3, Loader2, Mail, MapPin, Phone, Search, Sprout, UserRound, UsersRound, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-[#d8c09e] text-[#17372a]",
  confirmed: "bg-[#17372a] text-[#f6f2e8]",
  completed: "bg-[#5f765f] text-white",
  cancelled: "bg-[#86584d] text-white",
};

export default function AdminBookings() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const utils = trpc.useUtils();
  const bookings = trpc.admin.bookings.useQuery(undefined, { enabled: isAdmin, retry: false });
  const updateStatus = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: updated => {
      toast.success(`${updated.reference} is now ${updated.status}.`);
      utils.admin.bookings.invalidate();
      utils.bookings.mine.invalidate();
    },
    onError: error => toast.error(error.message || "Reservation status could not be updated."),
  });

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (bookings.data ?? []).filter(booking => {
      const statusMatch = statusFilter === "all" || booking.status === statusFilter;
      const searchMatch = !search || [booking.reference, booking.tourTitle, booking.firstName, booking.lastName, booking.email].some(value => value.toLowerCase().includes(search));
      return statusMatch && searchMatch;
    });
  }, [bookings.data, query, statusFilter]);

  const counts = useMemo(() => {
    const all = bookings.data ?? [];
    return { total: all.length, pending: all.filter(item => item.status === "pending").length, confirmed: all.filter(item => item.status === "confirmed").length, completed: all.filter(item => item.status === "completed").length };
  }, [bookings.data]);

  return (
    <DashboardLayout>
      {loading || !isAdmin ? null : (
        <div className="mx-auto max-w-[1500px]">
          <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[3rem] bg-[#10281f] p-7 text-[#f6f2e8] sm:p-10 xl:p-12">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div><p className="eyebrow text-[#d5b489]">Hushwood journey desk</p><h1 className="mt-5 font-display text-6xl font-semibold leading-[0.86] sm:text-7xl">Reservations, <em className="text-[#d5b489]">at a glance.</em></h1><p className="mt-5 max-w-xl text-sm leading-7 text-white/56">Confirm departures, follow progress, and keep every traveler’s details together.</p></div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[560px]">
                <Metric label="All" value={counts.total} icon={CircleEllipsis} />
                <Metric label="Pending" value={counts.pending} icon={Clock3} />
                <Metric label="Confirmed" value={counts.confirmed} icon={CheckCircle2} />
                <Metric label="Complete" value={counts.completed} icon={Sprout} />
              </div>
            </div>
          </motion.header>

          <section className="mt-5 rounded-[2.5rem] bg-card p-3 shadow-[0_24px_80px_-45px_rgba(23,55,42,0.3)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex h-14 min-w-0 flex-1 items-center rounded-full bg-secondary/70 px-5 lg:max-w-lg"><Search className="h-4 w-4 text-muted-foreground" /><span className="sr-only">Search reservations</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reference, journey, or traveler" className="w-full bg-transparent px-3 text-sm outline-none" /></label>
              <div className="flex gap-1 overflow-x-auto rounded-full bg-secondary/70 p-1.5" aria-label="Filter reservations by status">
                {(["all", ...statuses] as const).map(value => <button key={value} type="button" onClick={() => setStatusFilter(value)} className={`relative rounded-full px-4 py-3 text-xs font-semibold capitalize ${statusFilter === value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{statusFilter === value && <motion.span layoutId="admin-filter" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}{value}</button>)}
              </div>
            </div>
          </section>

          {bookings.isLoading ? (
            <div className="mt-5 flex min-h-[420px] items-center justify-center rounded-[2.5rem] bg-card"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : bookings.error ? (
            <div className="mt-5 rounded-[2.5rem] bg-[#86584d]/10 p-10 text-center"><XCircle className="mx-auto h-7 w-7 text-[#86584d]" /><h2 className="mt-5 font-display text-4xl font-semibold">Reservations could not be opened.</h2><button type="button" onClick={() => bookings.refetch()} className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Try again</button></div>
          ) : filtered.length ? (
            <div className="mt-5 space-y-4">
              {filtered.map((booking, index) => (
                <motion.article key={booking.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.24) }} className="rounded-[2.5rem] bg-card p-3 shadow-[0_18px_70px_-46px_rgba(23,55,42,0.28)]">
                  <div className="grid gap-6 rounded-[2rem] bg-secondary/42 p-5 sm:p-7 xl:grid-cols-[1.2fr_0.9fr_0.8fr_auto] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold capitalize ${statusStyles[booking.status]}`}>{booking.status}</span><span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{booking.reference}</span></div>
                      <h2 className="mt-4 font-display text-4xl font-semibold leading-none">{booking.tourTitle}</h2>
                      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{booking.tourLocation}</p>
                    </div>
                    <div className="space-y-3 text-sm"><p className="flex items-center gap-3"><UserRound className="h-4 w-4 text-primary" /><span className="font-semibold">{booking.firstName} {booking.lastName}</span></p><a href={`mailto:${booking.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" />{booking.email}</a><a href={`tel:${booking.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" />{booking.phone}</a></div>
                    <div className="grid grid-cols-2 gap-2 xl:grid-cols-1"><AdminMeta icon={CalendarDays} label="Departure" value={format(new Date(booking.travelDate), "MMM d, yyyy")} /><AdminMeta icon={UsersRound} label="Travelers" value={String(booking.travelers)} /></div>
                    <label className="relative min-w-[170px]"><span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Update status</span><select value={booking.status} onChange={event => updateStatus.mutate({ bookingId: booking.id, status: event.target.value as BookingStatus })} disabled={updateStatus.isPending} className="h-12 w-full appearance-none rounded-full border border-primary/14 bg-card px-4 pr-10 text-sm font-semibold capitalize outline-none focus:ring-4 focus:ring-primary/8">{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 text-muted-foreground" /></label>
                  </div>
                  {booking.notes && <div className="px-5 pb-3 pt-4 text-xs leading-6 text-muted-foreground sm:px-7"><span className="font-semibold text-foreground">Traveler note · </span>{booking.notes}</div>}
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-[420px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-primary/18 bg-card p-8 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><Sprout className="h-6 w-6" /></span><h2 className="mt-6 font-display text-5xl font-semibold">The desk is quiet.</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{bookings.data?.length ? "No reservations match these filters." : "New journey requests will appear here as soon as travelers confirm them."}</p></div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Clock3 }) {
  return <div className="rounded-[1.5rem] bg-white/7 p-4"><Icon className="h-4 w-4 text-[#d5b489]" /><p className="mt-5 font-display text-3xl font-semibold leading-none">{value}</p><p className="mt-1 text-[0.65rem] uppercase tracking-[0.11em] text-white/42">{label}</p></div>;
}

function AdminMeta({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="rounded-[1.25rem] bg-card p-3"><Icon className="h-3.5 w-3.5 text-primary" /><p className="mt-3 text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}
