import { ArrowUpRight, Instagram, Leaf, Mail, TreePine } from "lucide-react";
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="bg-background px-3 pb-3 pt-16 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[2.5rem] bg-[#10281f] px-6 py-10 text-[#f6f2e8] sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"><TreePine className="h-4 w-4" /></span>
              <span className="font-display text-3xl font-semibold">Hushwood</span>
            </div>
            <h2 className="mt-8 font-display text-4xl font-medium leading-[1.02] sm:text-5xl">Travel softly.<br /><em className="text-[#d5b489]">Return changed.</em></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#f6f2e8]/62">Small-group journeys for people who want to notice more, hurry less, and leave wild places quieter than they found them.</p>
          </div>

          <div>
            <p className="eyebrow text-[#d5b489]">Explore</p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-[#f6f2e8]/72">
              <Link href="/tours" className="w-fit rounded-full py-1 hover:text-white">All journeys</Link>
              <Link href="/contact" className="w-fit rounded-full py-1 hover:text-white">Talk to a guide</Link>
              <Link href="/login" className="w-fit rounded-full py-1 hover:text-white">Guest login</Link>
              <Link href="/admin/bookings" className="w-fit rounded-full py-1 hover:text-white">Journey desk</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-[#d5b489]">Stay close</p>
            <div className="mt-6 space-y-3">
              <a href="mailto:hello@hushwood.travel" className="flex items-center gap-3 rounded-full bg-white/7 px-4 py-3 text-sm transition-colors hover:bg-white/12">
                <Mail className="h-4 w-4" /> hello@hushwood.travel
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-full bg-white/7 px-4 py-3 text-sm transition-colors hover:bg-white/12">
                <span className="flex items-center gap-3"><Instagram className="h-4 w-4" /> Instagram</span><ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#f6f2e8]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hushwood Journeys. Tread lightly.</p>
          <p className="flex items-center gap-2"><Leaf className="h-3.5 w-3.5" /> Designed around quiet, not crowds.</p>
        </div>
      </div>
    </footer>
  );
}
