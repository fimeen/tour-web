import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import SiteFooter from "@/components/SiteFooter";
import TourCard from "@/components/TourCard";
import { tourCatalog } from "@/lib/tourCatalog";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, Compass, MapPin, ShieldCheck, Sparkles, TreePine, UsersRound } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "wouter";

const heroImage = "/manus-storage/hushwood-hero_5382765d.jpg";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [, setLocation] = useLocation();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.13]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 88]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content">
        <section ref={heroRef} className="relative min-h-[96svh] overflow-hidden rounded-b-[2.5rem] bg-[#10281f] text-white sm:rounded-b-[3.5rem]">
          <motion.img
            src={heroImage}
            alt="Ancient forest trail disappearing into the morning mist"
            className="absolute inset-0 h-[116%] w-full object-cover"
            style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,25,18,0.84)_0%,rgba(8,25,18,0.38)_48%,rgba(8,25,18,0.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,25,18,0.72)_0%,transparent_45%,rgba(8,25,18,0.18)_100%)]" />

          <div className="container relative z-10 flex min-h-[96svh] items-center pb-44 pt-28 sm:pb-40 sm:pt-36">
            <motion.div style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }} className="max-w-3xl">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
                className="eyebrow text-[#e5c79f]"
              >
                Small-group forest journeys
              </motion.div>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.82, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="mt-7 max-w-[11ch] font-display text-[clamp(4.2rem,9vw,8.6rem)] font-medium leading-[0.78] tracking-[-0.055em]"
              >
                Go where the forest <em className="font-medium text-[#e5c79f]">remembers.</em>
              </motion.h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.42, ease: [0.23, 1, 0.32, 1] }}
                className="mt-8 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8"
              >
                Unhurried routes, intimate groups, and local guides who know when the best part of a journey is simply standing still.
              </motion.p>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.54, ease: [0.23, 1, 0.32, 1] }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-[#f6f2e8] px-6 py-4 text-sm font-semibold text-[#17372a] transition-transform active:scale-[0.97]">
                  Explore journeys <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#philosophy" className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/8 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/14">
                  Our way of travel <ArrowDown className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.74, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-3 bottom-3 z-20 sm:inset-x-5 sm:bottom-5"
          >
            <div className="glass-forest mx-auto grid max-w-[1360px] gap-2 rounded-[2rem] p-2 text-white sm:grid-cols-[1.1fr_1fr_1fr_auto] sm:rounded-full">
              <button type="button" onClick={() => setLocation("/tours")} className="flex items-center gap-3 rounded-full px-4 py-3 text-left transition-colors hover:bg-white/8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><MapPin className="h-4 w-4" /></span>
                <span><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-white/48">Where</span><span className="mt-0.5 block text-sm font-medium">Wild forests, worldwide</span></span>
              </button>
              <button type="button" onClick={() => setLocation("/tours")} className="flex items-center gap-3 rounded-full px-4 py-3 text-left transition-colors hover:bg-white/8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><CalendarDays className="h-4 w-4" /></span>
                <span><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-white/48">When</span><span className="mt-0.5 block text-sm font-medium">Choose your season</span></span>
              </button>
              <button type="button" onClick={() => setLocation("/tours")} className="flex items-center gap-3 rounded-full px-4 py-3 text-left transition-colors hover:bg-white/8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"><UsersRound className="h-4 w-4" /></span>
                <span><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-white/48">Travelers</span><span className="mt-0.5 block text-sm font-medium">Two curious people</span></span>
              </button>
              <button type="button" onClick={() => setLocation("/tours")} className="rounded-full bg-[#d1ae82] px-7 py-4 text-sm font-semibold text-[#17372a] transition-transform active:scale-[0.97]">Find my journey</button>
            </div>
          </motion.div>
        </section>

        <section className="overflow-hidden py-6 sm:py-8" aria-label="Travel principles">
          <div className="flex min-w-max items-center gap-7 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary/62 sm:gap-10">
            {["Small groups", "Local knowledge", "Low-impact stays", "Unhurried routes", "Quiet departures", "Small groups", "Local knowledge", "Low-impact stays", "Unhurried routes"].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-7 sm:gap-10"><TreePine className="h-3.5 w-3.5" />{item}</span>
            ))}
          </div>
        </section>

        <section className="container py-20 sm:py-28">
          <MotionReveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[#795337]">Curated departures</p>
              <h2 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.035em] sm:text-7xl">Journeys with room to <em className="font-medium text-primary">notice.</em></h2>
            </div>
            <Link href="/tours" className="group inline-flex w-fit items-center gap-2 rounded-full border border-primary/18 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              View all journeys <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </MotionReveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tourCatalog.slice(0, 3).map((tour, index) => <TourCard key={tour.slug} tour={tour} index={index} />)}
          </div>
        </section>

        <section id="philosophy" className="px-3 py-8 sm:px-5 sm:py-12">
          <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[2.5rem] bg-[#10281f] text-[#f6f2e8] sm:rounded-[3rem]">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <MotionReveal className="relative min-h-[520px] overflow-hidden p-3 sm:min-h-[650px] sm:p-4" y={36}>
                <img src="/manus-storage/cascading-silence-v2_6858beb7.jpg" alt="Hidden waterfall surrounded by dense forest" className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-[2rem] object-cover sm:inset-4 sm:h-[calc(100%-2rem)] sm:w-[calc(100%-2rem)] sm:rounded-[2.5rem]" />
                <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-[#0a2017]/72 via-transparent to-transparent sm:inset-4 sm:rounded-[2.5rem]" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between sm:bottom-12 sm:left-12 sm:right-12">
                  <p className="max-w-xs font-display text-2xl italic leading-tight text-white/92 sm:text-3xl">“The forest sets the pace. We simply learn to follow.”</p>
                  <span className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md sm:flex"><Compass className="h-5 w-5" /></span>
                </div>
              </MotionReveal>

              <div className="flex flex-col justify-center px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
                <MotionReveal>
                  <p className="eyebrow text-[#d5b489]">The Hushwood way</p>
                  <h2 className="mt-6 max-w-xl font-display text-5xl font-medium leading-[0.93] tracking-[-0.03em] sm:text-7xl">Less itinerary.<br /><em className="text-[#d5b489]">More presence.</em></h2>
                  <p className="mt-8 max-w-xl text-base leading-8 text-[#f6f2e8]/62">We design each departure around natural rhythms rather than checklists. Groups stay small. Guides live close to the places they share. And every day holds enough openness for weather, wildlife, and wonder to change the plan.</p>
                </MotionReveal>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: UsersRound, value: "8 max", label: "Travelers per group" },
                    { icon: ShieldCheck, value: "100%", label: "Local-led departures" },
                    { icon: Sparkles, value: "1:6", label: "Guide-to-guest ratio" },
                  ].map((item, index) => (
                    <MotionReveal key={item.label} delay={index * 0.08} className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
                      <item.icon className="h-5 w-5 text-[#d5b489]" />
                      <p className="mt-7 font-display text-3xl font-semibold">{item.value}</p>
                      <p className="mt-1 text-xs leading-5 text-[#f6f2e8]/48">{item.label}</p>
                    </MotionReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-20 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
            <MotionReveal className="lg:sticky lg:top-32">
              <p className="eyebrow text-[#795337]">What we protect</p>
              <h2 className="mt-5 max-w-lg font-display text-5xl font-semibold leading-[0.94] tracking-[-0.035em] sm:text-7xl">A lighter way through the <em className="font-medium text-primary">wild.</em></h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">Thoughtful travel is not a badge. It is thousands of small choices made before, during, and long after every departure.</p>
            </MotionReveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { n: "01", title: "Stay small", copy: "Groups never exceed eight, keeping trails quiet and encounters human." },
                { n: "02", title: "Buy close", copy: "Lodges, meals, and field teams are selected from the regions we visit." },
                { n: "03", title: "Leave time", copy: "Long pauses and flexible days make room for the place—not the clock—to lead." },
                { n: "04", title: "Return care", copy: "A share of each journey supports habitat and community-led stewardship." },
              ].map((item, index) => (
                <MotionReveal key={item.n} delay={(index % 2) * 0.08} className="hushwood-card flex min-h-[260px] flex-col justify-between p-7 sm:p-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary">{item.n}</span>
                  <div>
                    <h3 className="font-display text-3xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="container pb-16 sm:pb-24">
          <MotionReveal className="relative overflow-hidden rounded-[2.5rem] bg-[#8d633f] px-6 py-14 text-[#fff9ef] sm:px-12 sm:py-18 lg:px-16">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/14" />
            <div className="absolute -bottom-36 right-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow text-[#efe1cc]">Your next quiet place</p>
                <h2 className="mt-5 max-w-3xl font-display text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl">The trail is waiting.<br /><em>Not rushing.</em></h2>
              </div>
              <Link href="/contact" className="inline-flex w-fit items-center gap-3 rounded-full bg-[#f6f2e8] px-6 py-4 text-sm font-semibold text-[#17372a] transition-transform active:scale-[0.97]">
                Plan with a guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </MotionReveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
