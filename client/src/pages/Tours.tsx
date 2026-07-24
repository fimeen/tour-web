import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import SiteFooter from "@/components/SiteFooter";
import TourCard from "@/components/TourCard";
import { tourCatalog } from "@/lib/tourCatalog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, SlidersHorizontal, Sprout, TreePine, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

type DifficultyFilter = "All" | "Easy" | "Moderate" | "Challenging";
type DurationFilter = "All" | "1–3 days" | "4+ days";

export default function Tours() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [duration, setDuration] = useState<DurationFilter>("All");

  const filteredTours = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tourCatalog.filter(tour => {
      const matchesSearch = !search || [tour.title, tour.subtitle, tour.location].some(value => value.toLowerCase().includes(search));
      const matchesDifficulty = difficulty === "All" || tour.difficulty === difficulty;
      const matchesDuration = duration === "All" || (duration === "1–3 days" ? tour.duration <= 3 : tour.duration >= 4);
      return matchesSearch && matchesDifficulty && matchesDuration;
    });
  }, [difficulty, duration, query]);

  const hasFilters = query.trim().length > 0 || difficulty !== "All" || duration !== "All";
  const clearFilters = () => {
    setQuery("");
    setDifficulty("All");
    setDuration("All");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content">
        <section className="px-3 pb-4 pt-24 sm:px-5 sm:pb-5 sm:pt-28">
          <div className="relative mx-auto min-h-[460px] max-w-[1360px] overflow-hidden rounded-[2.5rem] bg-[#10281f] px-6 py-14 text-[#f6f2e8] sm:px-12 sm:py-20 lg:px-16">
            <div className="absolute -right-16 -top-20 h-[420px] w-[420px] rounded-full border border-white/9" />
            <div className="absolute -right-4 top-8 h-[270px] w-[270px] rounded-full border border-white/9" />
            <div className="absolute bottom-8 right-8 hidden h-32 w-32 items-center justify-center rounded-full bg-[#d0ad81] text-[#17372a] lg:flex">
              <TreePine className="h-10 w-10" strokeWidth={1.3} />
            </div>

            <div className="relative flex min-h-[320px] flex-col justify-between">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                className="eyebrow text-[#d5b489]"
              >
                The journey collection
              </motion.div>
              <div>
                <motion.h1
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.78, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-[10ch] font-display text-[clamp(4.4rem,9vw,8.8rem)] font-medium leading-[0.77] tracking-[-0.055em]"
                >
                  Find your quiet <em className="text-[#d5b489]">place.</em>
                </motion.h1>
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.68, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-7 max-w-lg text-sm leading-7 text-[#f6f2e8]/62 sm:text-base"
                >
                  Forest journeys arranged by pace, not pressure. Every departure stays small enough for silence, conversation, and a change of plan.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 sm:py-24">
          <MotionReveal className="hushwood-card p-3 sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <label className="relative flex min-h-14 flex-1 items-center rounded-full bg-secondary/80 px-5 focus-within:ring-2 focus-within:ring-primary/25">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Search journeys</span>
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search by forest, country, or journey"
                  className="h-14 w-full border-0 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/70"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/8" aria-label="Clear search">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-1 rounded-full bg-secondary/80 p-1" aria-label="Filter by difficulty">
                  {(["All", "Easy", "Moderate", "Challenging"] as DifficultyFilter[]).map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDifficulty(value)}
                      className={`relative rounded-full px-3.5 py-3 text-xs font-medium transition-colors ${difficulty === value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {difficulty === value && <motion.span layoutId="difficulty-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      {value}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-secondary/80 p-1" aria-label="Filter by duration">
                  {(["All", "1–3 days", "4+ days"] as DurationFilter[]).map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDuration(value)}
                      className={`relative rounded-full px-3.5 py-3 text-xs font-medium transition-colors ${duration === value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {duration === value && <motion.span layoutId="duration-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="mt-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-[#795337]">Browse departures</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-5xl">
                {filteredTours.length} {filteredTours.length === 1 ? "journey" : "journeys"} found
              </h2>
            </div>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 rounded-full border border-primary/16 px-4 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Reset filters
              </button>
            )}
          </MotionReveal>

          <AnimatePresence mode="popLayout">
            {filteredTours.length > 0 ? (
              <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredTours.map((tour, index) => <TourCard key={tour.slug} tour={tour} index={index} />)}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-10 flex min-h-[360px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-primary/18 bg-card px-6 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><Sprout className="h-6 w-6" /></span>
                <h3 className="mt-6 font-display text-4xl font-semibold">The trail is quiet here.</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">No journeys match this combination yet. Clear a filter and let another forest find you.</p>
                <button type="button" onClick={clearFilters} className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Show every journey</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="container pb-16 sm:pb-24">
          <MotionReveal className="flex flex-col gap-8 rounded-[2.5rem] bg-[#d8c09e] px-7 py-10 text-[#17372a] sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Not sure where to begin?</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.95] sm:text-5xl">Tell us the feeling you want to return with.</h2>
            </div>
            <Link href="/contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#17372a] px-6 py-4 text-sm font-semibold text-[#f6f2e8] transition-transform active:scale-[0.97]">
              Talk to a guide <ArrowRight className="h-4 w-4" />
            </Link>
          </MotionReveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
