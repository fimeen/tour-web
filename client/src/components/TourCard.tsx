import type { TourPreview } from "@/lib/tourCatalog";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CircleDollarSign, Gauge, MapPin, Timer } from "lucide-react";
import { Link } from "wouter";

export default function TourCard({ tour, index = 0 }: { tour: TourPreview; index?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.68, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      className="group hushwood-card overflow-hidden p-2"
    >
      <Link href={`/tours/${tour.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[1.75rem]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-primary/10">
          <motion.img
            src={tour.cover}
            alt={tour.title}
            className="h-full w-full object-cover"
            whileHover={reduceMotion ? undefined : { scale: 1.045 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2119]/80 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#f6f2e8]/92 px-3 py-2 text-xs font-medium text-[#17372a] backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" />
            {tour.location}
          </div>
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f2e8] text-[#17372a] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-5 px-4 pb-5 pt-5">
          <div>
            <h3 className="font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-foreground">{tour.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{tour.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Tour details">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-2 text-xs font-medium text-primary">
              <Timer className="h-3.5 w-3.5" /> {tour.duration} days
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground">
              <Gauge className="h-3.5 w-3.5" /> {tour.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6f4d35]/10 px-3 py-2 text-xs font-medium text-[#6f4d35]">
              <CircleDollarSign className="h-3.5 w-3.5" /> ${tour.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
