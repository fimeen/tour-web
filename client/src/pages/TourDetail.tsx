import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import SiteFooter from "@/components/SiteFooter";
import { getTourBySlug } from "@/lib/tourCatalog";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, CircleDollarSign, Gauge, MapPin, Quote, Sparkles, Timer, UsersRound, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useParams } from "wouter";

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const tour = getTourBySlug(slug);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeDay, setActiveDay] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  if (!tour) {
    return (
      <div className="min-h-screen bg-background pt-32 text-foreground">
        <GlobalNav />
        <main id="main-content" className="container flex min-h-[70vh] items-center justify-center py-20 text-center">
          <div>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><MapPin className="h-6 w-6" /></span>
            <h1 className="mt-6 font-display text-6xl font-semibold">This trail wandered off.</h1>
            <p className="mt-4 text-muted-foreground">The journey you’re looking for is no longer on this path.</p>
            <Link href="/tours" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Return to journeys</Link>
          </div>
        </main>
      </div>
    );
  }

  const activeItinerary = tour.itinerary.find(day => day.day === activeDay) ?? tour.itinerary[0];
  const galleryImage = galleryIndex === null ? null : tour.gallery[galleryIndex];
  const changeGallery = (direction: number) => {
    if (galleryIndex === null) return;
    setGalleryIndex((galleryIndex + direction + tour.gallery.length) % tour.gallery.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content">
        <section ref={heroRef} className="relative min-h-[78svh] overflow-hidden rounded-b-[2.5rem] bg-[#10281f] text-white sm:rounded-b-[3.5rem]">
          <motion.img src={tour.cover} alt={tour.title} className="absolute inset-0 h-[114%] w-full object-cover" style={reduceMotion ? undefined : { y: heroY }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,25,18,0.86)_0%,rgba(8,25,18,0.47)_52%,rgba(8,25,18,0.18)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2118]/78 via-transparent to-[#0a2118]/16" />

          <div className="container relative z-10 flex min-h-[78svh] flex-col justify-end pb-10 pt-36 sm:pb-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-4xl"
            >
              <Link href="/tours" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-2 text-xs font-semibold backdrop-blur-md hover:bg-white/14"><ArrowLeft className="h-3.5 w-3.5" /> All journeys</Link>
              <p className="eyebrow text-[#e5c79f]">{tour.location}</p>
              <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(4.8rem,9vw,8.7rem)] font-medium leading-[0.78] tracking-[-0.055em]">{tour.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{tour.subtitle}</p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="mt-9 flex flex-wrap gap-2"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#10281f]/55 px-4 py-3 text-sm backdrop-blur-md"><Timer className="h-4 w-4 text-[#e5c79f]" /> {tour.duration} days</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#10281f]/55 px-4 py-3 text-sm backdrop-blur-md"><Gauge className="h-4 w-4 text-[#e5c79f]" /> {tour.difficulty}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#10281f]/55 px-4 py-3 text-sm backdrop-blur-md"><UsersRound className="h-4 w-4 text-[#e5c79f]" /> Max {tour.groupSize}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#10281f]/55 px-4 py-3 text-sm backdrop-blur-md"><CircleDollarSign className="h-4 w-4 text-[#e5c79f]" /> From ${tour.price.toLocaleString()}</span>
            </motion.div>
          </div>
        </section>

        <section className="container py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-16">
            <div className="min-w-0">
              <MotionReveal>
                <p className="eyebrow text-[#795337]">The feeling of this place</p>
                <h2 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.035em] sm:text-7xl">Walk slowly enough to <em className="font-medium text-primary">hear it.</em></h2>
                <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">{tour.description}</p>
              </MotionReveal>

              <MotionReveal className="mt-14 grid min-h-[520px] grid-cols-2 gap-3 sm:min-h-[640px] sm:gap-4" y={36}>
                <button type="button" onClick={() => setGalleryIndex(0)} className="group relative row-span-2 overflow-hidden rounded-[2rem] bg-primary/10 text-left sm:rounded-[2.5rem]">
                  <img src={tour.gallery[0].src} alt={tour.gallery[0].alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-[#f6f2e8]/92 px-4 py-2 text-xs font-semibold text-[#17372a] backdrop-blur-md">Open gallery</span>
                </button>
                {tour.gallery.slice(1, 3).map((image, index) => (
                  <button key={image.src} type="button" onClick={() => setGalleryIndex(index + 1)} className="group relative overflow-hidden rounded-[2rem] bg-primary/10 sm:rounded-[2.5rem]">
                    <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </button>
                ))}
              </MotionReveal>

              <section className="mt-20 sm:mt-28" aria-labelledby="itinerary-heading">
                <MotionReveal>
                  <p className="eyebrow text-[#795337]">Day by quiet day</p>
                  <h2 id="itinerary-heading" className="mt-5 font-display text-5xl font-semibold leading-none sm:text-7xl">The itinerary</h2>
                </MotionReveal>

                <MotionReveal className="mt-9">
                  <div className="flex gap-2 overflow-x-auto rounded-full bg-secondary/80 p-1.5" role="tablist" aria-label="Tour itinerary days">
                    {tour.itinerary.map(day => (
                      <button
                        key={day.day}
                        type="button"
                        role="tab"
                        aria-selected={activeDay === day.day}
                        onClick={() => setActiveDay(day.day)}
                        className={`relative min-w-fit rounded-full px-5 py-3 text-sm font-semibold transition-colors ${activeDay === day.day ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {activeDay === day.day && <motion.span layoutId="itinerary-tab" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                        Day {day.day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[2.5rem] bg-card p-7 shadow-[0_24px_80px_-42px_rgba(23,55,42,0.32)] sm:p-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeItinerary.day}
                        initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                        role="tabpanel"
                      >
                        <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr]">
                          <div>
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">0{activeItinerary.day}</span>
                            <h3 className="mt-8 font-display text-4xl font-semibold leading-[0.95] sm:text-5xl">{activeItinerary.title}</h3>
                          </div>
                          <div className="flex flex-col justify-between">
                            <p className="text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">{activeItinerary.description}</p>
                            <div className="mt-10 flex flex-wrap gap-2">
                              {activeItinerary.distance && <span className="rounded-full bg-primary/8 px-4 py-2 text-xs font-semibold text-primary">{activeItinerary.distance}</span>}
                              {activeItinerary.elevation && <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground">{activeItinerary.elevation}</span>}
                              {activeItinerary.meals?.map(meal => <span key={meal} className="rounded-full bg-[#6f4d35]/10 px-4 py-2 text-xs font-semibold text-[#6f4d35]">{meal}</span>)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </MotionReveal>
              </section>

              <section className="mt-20 sm:mt-28" aria-labelledby="highlights-heading">
                <MotionReveal>
                  <p className="eyebrow text-[#795337]">Moments worth keeping</p>
                  <h2 id="highlights-heading" className="mt-5 font-display text-5xl font-semibold leading-none sm:text-7xl">Journey highlights</h2>
                </MotionReveal>
                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {tour.highlights.map((highlight, index) => (
                    <MotionReveal key={highlight} delay={(index % 2) * 0.07} className="hushwood-card flex min-h-44 flex-col justify-between p-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8c09e] text-[#17372a]"><Sparkles className="h-4 w-4" /></span>
                      <div className="flex items-end justify-between gap-5">
                        <h3 className="font-display text-3xl font-semibold leading-none">{highlight}</h3>
                        <span className="text-xs font-semibold text-primary/45">0{index + 1}</span>
                      </div>
                    </MotionReveal>
                  ))}
                </div>
              </section>

              <section className="mt-20 grid gap-4 sm:mt-28 lg:grid-cols-2">
                <MotionReveal className="rounded-[2.5rem] bg-[#10281f] p-7 text-[#f6f2e8] sm:p-9">
                  <h2 className="font-display text-4xl font-semibold">What’s included</h2>
                  <div className="mt-7 space-y-4">
                    {tour.included.map(item => <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#f6f2e8]/72"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d5b489] text-[#17372a]"><Check className="h-3 w-3" /></span>{item}</div>)}
                  </div>
                </MotionReveal>
                <MotionReveal delay={0.08} className="rounded-[2.5rem] bg-[#d8c09e] p-7 text-[#17372a] sm:p-9">
                  <h2 className="font-display text-4xl font-semibold">Not included</h2>
                  <div className="mt-7 space-y-4">
                    {tour.excluded.map(item => <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#17372a]/68"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#17372a]/24"><X className="h-3 w-3" /></span>{item}</div>)}
                  </div>
                </MotionReveal>
              </section>

              <MotionReveal className="mt-20 overflow-hidden rounded-[2.5rem] bg-[#6f4d35] p-7 text-[#fff8ee] sm:mt-28 sm:p-10">
                <div className="grid gap-8 sm:grid-cols-[180px_1fr] sm:items-center">
                  <img src={tour.guide.image} alt={tour.guide.name} className="aspect-square w-40 rounded-full object-cover ring-8 ring-white/8 sm:w-full" />
                  <div>
                    <Quote className="h-7 w-7 text-[#e8d2b4]" />
                    <p className="mt-5 font-display text-3xl italic leading-[1.1] sm:text-4xl">“A guide’s work is not to fill every silence. It is to help you hear what is already there.”</p>
                    <div className="mt-7">
                      <h2 className="font-display text-3xl font-semibold">{tour.guide.name}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#e8d2b4]">{tour.guide.role}</p>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">{tour.guide.bio}</p>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>

            <motion.aside
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="self-start lg:sticky lg:top-28"
            >
              <div className="rounded-[2.5rem] bg-[#10281f] p-3 text-[#f6f2e8] shadow-[0_28px_90px_-34px_rgba(9,32,23,0.48)]">
                <div className="rounded-[2rem] border border-white/10 p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">From</p>
                  <div className="mt-2 flex items-end gap-2"><span className="font-display text-5xl font-semibold">${tour.price.toLocaleString()}</span><span className="mb-2 text-xs text-white/45">per traveler</span></div>
                  <div className="my-6 h-px bg-white/10" />
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-white/55"><CalendarDays className="h-4 w-4" /> Duration</span><span className="font-medium">{tour.duration} days</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-white/55"><UsersRound className="h-4 w-4" /> Group</span><span className="font-medium">2–{tour.groupSize} travelers</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-white/55"><Gauge className="h-4 w-4" /> Pace</span><span className="font-medium">{tour.difficulty}</span></div>
                  </div>
                  <Link href={`/book/${tour.slug}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#d5b489] px-5 py-4 text-sm font-semibold text-[#17372a] transition-transform active:scale-[0.97]">Begin booking <ArrowRight className="h-4 w-4" /></Link>
                  <p className="mt-4 text-center text-xs leading-5 text-white/42">No payment today. Your place is held after our journey desk confirms availability.</p>
                </div>
              </div>
              <div className="mt-3 rounded-[2rem] border border-primary/12 bg-card p-5">
                <p className="text-sm font-semibold">Prefer to talk it through?</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">A Hushwood guide can help with pace, dates, and what to pack.</p>
                <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">Ask a guide <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            </motion.aside>
          </div>
        </section>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {galleryImage && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#081812]/92 p-3 backdrop-blur-xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Journey image gallery"
            onClick={() => setGalleryIndex(null)}
          >
            <button type="button" onClick={() => setGalleryIndex(null)} className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18" aria-label="Close gallery"><X className="h-4 w-4" /></button>
            <button type="button" onClick={event => { event.stopPropagation(); changeGallery(-1); }} className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18 sm:left-8" aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button>
            <motion.img
              key={galleryImage.src}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              src={galleryImage.src}
              alt={galleryImage.alt}
              className="max-h-[88vh] max-w-[92vw] rounded-[2rem] object-contain"
              onClick={event => event.stopPropagation()}
            />
            <button type="button" onClick={event => { event.stopPropagation(); changeGallery(1); }} className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18 sm:right-8" aria-label="Next image"><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">{(galleryIndex ?? 0) + 1} / {tour.gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
