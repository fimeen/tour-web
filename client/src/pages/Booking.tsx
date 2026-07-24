import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import { Calendar } from "@/components/ui/calendar";
import { startLogin } from "@/const";
import { getTourBySlug } from "@/lib/tourCatalog";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, CircleUserRound, Compass, Loader2, Minus, Plus, ShieldCheck, Sprout, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";

const steps = [
  { label: "Date", icon: CalendarDays },
  { label: "Travelers", icon: UsersRound },
  { label: "Your details", icon: CircleUserRound },
  { label: "Review", icon: CheckCircle2 },
] as const;

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

type BookingResult = {
  id: number;
  reference: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  travelDate: number;
  travelers: number;
  tourTitle: string;
  tourSlug: string;
};

export default function Booking() {
  const { slug } = useParams<{ slug: string }>();
  const tour = getTourBySlug(slug);
  const reduceMotion = useReducedMotion();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [date, setDate] = useState<Date>();
  const [travelers, setTravelers] = useState(2);
  const [personal, setPersonal] = useState<PersonalInfo>({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const [result, setResult] = useState<BookingResult | null>(null);
  const minDate = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    value.setDate(value.getDate() + 1);
    return value;
  }, []);

  useEffect(() => {
    if (!user) return;
    const nameParts = user.name?.trim().split(/\s+/) ?? [];
    setPersonal(current => ({
      ...current,
      firstName: current.firstName || nameParts[0] || "",
      lastName: current.lastName || nameParts.slice(1).join(" "),
      email: current.email || user.email || "",
    }));
  }, [user]);

  const bookingMutation = trpc.bookings.create.useMutation({
    onSuccess: booking => {
      if (booking) setResult(booking);
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    },
    onError: error => toast.error(error.message || "We could not hold this departure. Please try again."),
  });

  if (!tour) {
    return (
      <div className="min-h-screen bg-background pt-32 text-foreground">
        <GlobalNav />
        <main id="main-content" className="container flex min-h-[70vh] items-center justify-center text-center">
          <div>
            <Compass className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-6 font-display text-6xl font-semibold">This journey moved on.</h1>
            <Link href="/tours" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Browse journeys</Link>
          </div>
        </main>
      </div>
    );
  }

  const total = tour.price * travelers;
  const personalValid = personal.firstName.trim().length >= 2 && personal.lastName.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(personal.email) && personal.phone.trim().length >= 7;
  const canContinue = step === 0 ? Boolean(date) : step === 1 ? travelers >= 1 : step === 2 ? personalValid : true;

  const goToStep = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const next = () => {
    if (!canContinue) {
      toast.error(step === 0 ? "Choose a departure date to continue." : "Complete the required details to continue.");
      return;
    }
    goToStep(Math.min(step + 1, 3));
  };

  const confirmBooking = () => {
    if (!isAuthenticated) {
      toast.message("Sign in to hold your place. Your journey details will stay here while you continue.");
      startLogin();
      return;
    }
    if (!date || !personalValid) return;
    const travelDate = new Date(date);
    travelDate.setHours(0, 0, 0, 0);
    bookingMutation.mutate({
      tourSlug: tour.slug,
      travelDate: travelDate.getTime(),
      travelers,
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: personal.email,
      phone: personal.phone,
      notes: personal.notes || undefined,
    });
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <GlobalNav />
        <main id="main-content" className="container flex min-h-screen items-center justify-center py-32">
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-3xl overflow-hidden rounded-[3rem] bg-[#10281f] p-4 text-[#f6f2e8] shadow-[0_32px_100px_-40px_rgba(9,32,23,0.58)]"
          >
            <div className="rounded-[2.5rem] border border-white/10 px-6 py-12 text-center sm:px-12 sm:py-16">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d5b489] text-[#17372a]"><Check className="h-8 w-8" /></span>
              <p className="mt-8 eyebrow justify-center text-[#d5b489]">Journey request received</p>
              <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.9] sm:text-7xl">Your place is <em className="text-[#d5b489]">being held.</em></h1>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/62">Our journey desk will review availability and email you within one working day. No payment has been taken.</p>
              <div className="mx-auto mt-8 grid max-w-xl gap-3 rounded-[2rem] bg-white/7 p-4 text-left sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white/6 p-4"><span className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">Reference</span><p className="mt-1 text-sm font-semibold">{result.reference}</p></div>
                <div className="rounded-[1.5rem] bg-white/6 p-4"><span className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">Departure</span><p className="mt-1 text-sm font-semibold">{format(new Date(result.travelDate), "MMM d, yyyy")}</p></div>
                <div className="rounded-[1.5rem] bg-white/6 p-4"><span className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">Travelers</span><p className="mt-1 text-sm font-semibold">{result.travelers}</p></div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/tours" className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold hover:bg-white/8">Explore more journeys</Link>
                <Link href={`/tours/${tour.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#d5b489] px-5 py-3 text-sm font-semibold text-[#17372a]">Return to journey <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content" className="container pb-24 pt-28 sm:pt-36">
        <MotionReveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={`/tours/${tour.slug}`} className="inline-flex items-center gap-2 rounded-full text-xs font-semibold text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Back to journey</Link>
            <p className="mt-8 eyebrow text-[#795337]">Reserve your departure</p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.86] tracking-[-0.04em] sm:text-8xl">A few details before the <em className="font-medium text-primary">forest.</em></h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">No payment is taken today. We confirm availability personally before sending your secure deposit link.</p>
        </MotionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-14">
          <div>
            <MotionReveal className="overflow-hidden rounded-[2rem] bg-secondary/75 p-2">
              <div className="grid grid-cols-4 gap-1" aria-label={`Booking step ${step + 1} of 4`}>
                {steps.map((item, index) => {
                  const active = index === step;
                  const complete = index < step;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => complete && goToStep(index)}
                      disabled={!complete && !active}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-[1.5rem] px-2 py-3 text-center transition-colors sm:flex-row sm:py-4 ${active ? "text-primary-foreground" : complete ? "text-primary" : "text-muted-foreground/55"}`}
                    >
                      {active && <motion.span layoutId="booking-progress" className="absolute inset-0 -z-10 rounded-[1.5rem] bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-white/14" : complete ? "bg-primary/10" : "bg-black/4"}`}>
                        {complete ? <Check className="h-3.5 w-3.5" /> : <item.icon className="h-3.5 w-3.5" />}
                      </span>
                      <span className="hidden text-xs font-semibold sm:block">{item.label}</span>
                      <span className="text-[0.65rem] font-semibold sm:hidden">{index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </MotionReveal>

            <div className="mt-4 min-h-[560px] overflow-hidden rounded-[2.5rem] bg-card shadow-[0_26px_90px_-46px_rgba(23,55,42,0.35)]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.section
                  key={step}
                  custom={direction}
                  initial={reduceMotion ? false : { opacity: 0, x: direction * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
                  className="p-6 sm:p-10"
                >
                  {step === 0 && (
                    <div>
                      <p className="eyebrow text-[#795337]">Step one</p>
                      <h2 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">Choose a departure date</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Pick the day you would like the journey to begin. We’ll confirm lodge and guide availability before any payment.</p>
                      <div className="mt-8 flex justify-center rounded-[2rem] bg-secondary/58 p-2 sm:p-5">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: minDate }} defaultMonth={date ?? minDate} className="w-full rounded-[1.75rem] bg-card p-3 sm:max-w-xl sm:p-5" />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <p className="eyebrow text-[#795337]">Step two</p>
                      <h2 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">Who is walking with you?</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Groups stay intentionally small. This departure welcomes up to {tour.groupSize} travelers in one booking.</p>
                      <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] bg-[#10281f] p-8 text-[#f6f2e8]">
                        <UsersRound className="h-8 w-8 text-[#d5b489]" />
                        <div className="mt-8 flex items-center gap-7 sm:gap-12">
                          <button type="button" onClick={() => setTravelers(value => Math.max(1, value - 1))} disabled={travelers <= 1} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-white/6 transition-transform active:scale-[0.96] disabled:opacity-35" aria-label="Remove traveler"><Minus className="h-5 w-5" /></button>
                          <div className="text-center"><motion.p key={travelers} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-8xl font-semibold leading-none">{travelers}</motion.p><p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/48">{travelers === 1 ? "traveler" : "travelers"}</p></div>
                          <button type="button" onClick={() => setTravelers(value => Math.min(tour.groupSize, value + 1))} disabled={travelers >= tour.groupSize} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d5b489] text-[#17372a] transition-transform active:scale-[0.96] disabled:opacity-35" aria-label="Add traveler"><Plus className="h-5 w-5" /></button>
                        </div>
                        <p className="mt-9 rounded-full bg-white/7 px-4 py-2 text-xs text-white/52">Maximum group size · {tour.groupSize}</p>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p className="eyebrow text-[#795337]">Step three</p>
                      <h2 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">How can we reach you?</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">We use these details only to coordinate your journey and answer any practical questions.</p>
                      <div className="mt-9 grid gap-5 sm:grid-cols-2">
                        <Field label="First name" value={personal.firstName} onChange={value => setPersonal(current => ({ ...current, firstName: value }))} autoComplete="given-name" required />
                        <Field label="Last name" value={personal.lastName} onChange={value => setPersonal(current => ({ ...current, lastName: value }))} autoComplete="family-name" required />
                        <Field label="Email address" type="email" value={personal.email} onChange={value => setPersonal(current => ({ ...current, email: value }))} autoComplete="email" required />
                        <Field label="Phone number" type="tel" value={personal.phone} onChange={value => setPersonal(current => ({ ...current, phone: value }))} autoComplete="tel" required />
                        <label className="sm:col-span-2">
                          <span className="mb-2 block text-xs font-semibold text-foreground/72">Anything we should know? <span className="text-muted-foreground">Optional</span></span>
                          <textarea value={personal.notes} onChange={event => setPersonal(current => ({ ...current, notes: event.target.value }))} rows={5} maxLength={1200} placeholder="Dietary needs, preferred pace, or questions for your guide…" className="w-full rounded-[1.5rem] border border-input bg-secondary/45 px-5 py-4 text-sm leading-7 outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/8" />
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <p className="eyebrow text-[#795337]">Step four</p>
                      <h2 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">Review your journey</h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Nothing is charged today. Confirm these details and our team will personally check your departure.</p>
                      <div className="mt-9 grid gap-4 sm:grid-cols-2">
                        <ReviewCard icon={CalendarDays} label="Departure date" value={date ? format(date, "EEEE, MMMM d, yyyy") : "Not selected"} onEdit={() => goToStep(0)} />
                        <ReviewCard icon={UsersRound} label="Travelers" value={`${travelers} ${travelers === 1 ? "traveler" : "travelers"}`} onEdit={() => goToStep(1)} />
                        <ReviewCard icon={CircleUserRound} label="Lead traveler" value={`${personal.firstName} ${personal.lastName}`} onEdit={() => goToStep(2)} />
                        <ReviewCard icon={ShieldCheck} label="Contact" value={`${personal.email} · ${personal.phone}`} onEdit={() => goToStep(2)} />
                      </div>
                      {personal.notes && <div className="mt-4 rounded-[2rem] bg-secondary/60 p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Note for your guide</p><p className="mt-3 text-sm leading-7">{personal.notes}</p></div>}
                      {!isAuthenticated && !authLoading && (
                        <div className="mt-5 flex items-start gap-3 rounded-[2rem] bg-[#d8c09e] p-5 text-[#17372a]"><Sprout className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-semibold">One gentle final step</p><p className="mt-1 text-xs leading-5 text-[#17372a]/68">Sign in securely to send this request and see its status later.</p></div></div>
                      )}
                    </div>
                  )}
                </motion.section>
              </AnimatePresence>

              <div className="flex flex-col-reverse gap-3 border-t border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                {step > 0 ? <button type="button" onClick={() => goToStep(step - 1)} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/16 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5"><ArrowLeft className="h-4 w-4" /> Back</button> : <div />}
                {step < 3 ? (
                  <button type="button" onClick={next} disabled={!canContinue} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97] disabled:opacity-40">Continue <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button type="button" onClick={confirmBooking} disabled={bookingMutation.isPending || authLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97] disabled:opacity-50">
                    {bookingMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Holding your place</> : isAuthenticated ? <>Confirm journey request <ArrowRight className="h-4 w-4" /></> : <>Sign in to confirm <ArrowRight className="h-4 w-4" /></>}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="self-start lg:sticky lg:top-28">
            <MotionReveal className="overflow-hidden rounded-[2.5rem] bg-[#10281f] p-3 text-[#f6f2e8]">
              <img src={tour.cover} alt={tour.title} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
              <div className="p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-[#d5b489]">Your journey</p>
                <h2 className="mt-3 font-display text-4xl font-semibold leading-none">{tour.title}</h2>
                <p className="mt-2 text-xs leading-5 text-white/48">{tour.location} · {tour.duration} days</p>
                <div className="my-6 h-px bg-white/10" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/50">Departure</span><span className="font-medium">{date ? format(date, "MMM d, yyyy") : "Choose a date"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/50">Travelers</span><span className="font-medium">{travelers}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/50">Journey total</span><span className="font-display text-2xl font-semibold">${total.toLocaleString()}</span></div>
                </div>
                <div className="mt-6 flex items-start gap-2 rounded-[1.5rem] bg-white/6 p-4 text-xs leading-5 text-white/48"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d5b489]" />No payment today. Availability is confirmed by a real person.</div>
              </div>
            </MotionReveal>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete, required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; required?: boolean }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold text-foreground/72">{label}{required && <span className="text-[#8d633f]"> *</span>}</span>
      <input type={type} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} required={required} className="h-14 w-full rounded-full border border-input bg-secondary/45 px-5 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/8" />
    </label>
  );
}

function ReviewCard({ icon: Icon, label, value, onEdit }: { icon: typeof CalendarDays; label: string; value: string; onEdit: () => void }) {
  return (
    <div className="rounded-[2rem] bg-secondary/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary"><Icon className="h-4 w-4" /></span>
        <button type="button" onClick={onEdit} className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/8">Edit</button>
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.11em] text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}
