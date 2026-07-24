import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, TreePine, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Journeys", href: "/tours" },
  { label: "Contact", href: "/contact" },
];

export default function GlobalNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHeroPage = location === "/";
  const solid = isScrolled || !isHeroPage || menuOpen;
  const navItems = [
    ...baseNavItems,
    ...(user?.role === "admin" ? [{ label: "Journey desk", href: "/admin/bookings" }] : []),
  ];
  const mobileNavItems = [
    ...baseNavItems,
    ...(user ? [{ label: "My journeys", href: "/account/bookings" }] : []),
    ...(user?.role === "admin" ? [{ label: "Journey desk", href: "/admin/bookings" }] : []),
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[70] -translate-y-24 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition-transform focus:translate-y-0">Skip to content</a>
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
      >
        <div
          className={`mx-auto flex max-w-[1360px] items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-4 ${
            solid
              ? "border border-[#d9d2c3]/70 bg-[#f7f3e9]/90 text-[#18372a] shadow-[0_18px_60px_-30px_rgba(15,39,29,0.42)] backdrop-blur-xl"
              : "border border-white/15 bg-[#10281f]/18 text-white backdrop-blur-sm"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 rounded-full pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-current">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${solid ? "bg-[#17372a] text-[#f6f2e8]" : "bg-white/14 text-white"}`}>
              <TreePine className="h-4 w-4" strokeWidth={1.7} />
            </span>
            <span className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Hushwood</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full lg:flex" aria-label="Primary navigation">
            {navItems.map(item => {
              const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                    active ? (solid ? "text-[#f7f3e9]" : "text-[#17372a]") : solid ? "text-[#385345] hover:text-[#17372a]" : "text-white/78 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className={`absolute inset-0 -z-10 rounded-full ${solid ? "bg-[#17372a]" : "bg-[#f7f3e9]"}`}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={user ? "/account/bookings" : "/login"}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current ${solid ? "hover:bg-[#17372a]/7" : "hover:bg-white/10"}`}
            >
              {user ? "My journeys" : "Log in"}
            </Link>
            <Link
              href="/tours"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                solid ? "bg-[#17372a] text-[#f7f3e9]" : "bg-[#f7f3e9] text-[#17372a]"
              }`}
            >
              Find a journey <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(value => !value)}
            className={`flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${solid ? "bg-[#17372a] text-[#f7f3e9]" : "bg-white/14 text-white"}`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0b1f17]/48 px-3 pt-[76px] backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-[2rem] border border-[#ded6c6] bg-[#f7f3e9] p-3 text-[#17372a] shadow-2xl"
              aria-label="Mobile navigation"
              onClick={event => event.stopPropagation()}
            >
              {mobileNavItems.map(item => {
                const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex items-center justify-between rounded-full px-5 py-4 font-medium ${active ? "bg-[#17372a] text-[#f7f3e9]" : "hover:bg-[#ebe5d8]"}`}>
                    {item.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href={user ? "/account/bookings" : "/login"} className="rounded-full border border-[#17372a]/15 px-4 py-3 text-center text-sm font-semibold">{user ? "My journeys" : "Log in"}</Link>
                <Link href="/tours" className="rounded-full bg-[#8d633f] px-4 py-3 text-center text-sm font-semibold text-white">Book now</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
import { useAuth } from "@/_core/hooks/useAuth";
