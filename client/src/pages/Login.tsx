import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNav from "@/components/GlobalNav";
import { startLogin } from "@/const";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Compass, Leaf, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const reduceMotion = useReducedMotion();
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#10281f] text-[#f6f2e8]">
      <GlobalNav />
      <main id="main-content" className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-screen overflow-hidden rounded-r-[4rem] lg:block">
          <img src="/manus-storage/hushwood-hero_5382765d.jpg" alt="A traveler walking into a misty cedar forest" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081b13]/90 via-[#081b13]/25 to-[#081b13]/25" />
          <div className="relative flex min-h-screen flex-col justify-end p-14 xl:p-20">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f6f2e8]/12 backdrop-blur-md"><Leaf className="h-5 w-5" /></span>
              <p className="mt-8 eyebrow text-[#d5b489]">Your journeys, kept close</p>
              <h1 className="mt-5 max-w-[9ch] font-display text-[clamp(5rem,7vw,8.5rem)] font-medium leading-[0.78] tracking-[-0.055em]">Return to the <em className="text-[#d5b489]">path.</em></h1>
              <p className="mt-7 max-w-lg text-base leading-8 text-white/64">Save your details, follow each reservation, and keep the practical pieces together without losing the feeling of the journey.</p>
            </motion.div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 pb-12 pt-28 sm:px-10 lg:pt-20">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="w-full max-w-lg">
            {user ? (
              <div className="rounded-[3rem] border border-white/10 bg-white/6 p-7 text-center backdrop-blur-xl sm:p-10">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d5b489] text-[#17372a]"><Check className="h-6 w-6" /></span>
                <p className="mt-7 eyebrow justify-center text-[#d5b489]">Welcome back</p>
                <h2 className="mt-4 font-display text-5xl font-semibold leading-none">You’re already on the path.</h2>
                <p className="mt-5 text-sm leading-7 text-white/58">Signed in as {user.name || user.email || "a Hushwood traveler"}.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link href="/account/bookings" className="rounded-full bg-[#d5b489] px-5 py-4 text-sm font-semibold text-[#17372a]">My journeys</Link>
                  <Link href="/tours" className="rounded-full border border-white/14 px-5 py-4 text-sm font-semibold">Explore more</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-white/7 p-1.5" role="tablist" aria-label="Account mode">
                  {(["login", "signup"] as const).map(value => (
                    <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={`relative rounded-full px-5 py-3 text-sm font-semibold ${mode === value ? "text-[#17372a]" : "text-white/52 hover:text-white"}`}>
                      {mode === value && <motion.span layoutId="auth-mode" className="absolute inset-0 -z-10 rounded-full bg-[#f6f2e8]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      {value === "login" ? "Log in" : "Create account"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={mode} initial={reduceMotion ? false : { opacity: 0, x: mode === "signup" ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === "signup" ? -14 : 14 }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
                    <p className="mt-9 eyebrow text-[#d5b489]">{mode === "login" ? "Traveler sign in" : "Join Hushwood"}</p>
                    <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.88] sm:text-7xl">{mode === "login" ? <>Welcome back to the <em className="text-[#d5b489]">quiet.</em></> : <>Keep every journey <em className="text-[#d5b489]">close.</em></>}</h2>
                    <p className="mt-6 max-w-md text-sm leading-7 text-white/56">{mode === "login" ? "Continue securely to see your reservations and journey details." : "Create your traveler account securely, then return to your booking without losing your place."}</p>
                    <button type="button" onClick={() => startLogin()} disabled={loading} className="mt-8 flex w-full items-center justify-between rounded-full bg-[#f6f2e8] px-6 py-4 text-sm font-semibold text-[#17372a] transition-transform active:scale-[0.97] disabled:opacity-50">
                      <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17372a] text-[#f6f2e8]"><Compass className="h-4 w-4" /></span>{mode === "login" ? "Continue securely" : "Create secure account"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <Benefit icon={LockKeyhole} text="Secure OAuth" />
                  <Benefit icon={ShieldCheck} text="No passwords stored" />
                  <Benefit icon={Sparkles} text="One quiet account" />
                </div>
                <p className="mt-7 text-center text-[0.7rem] leading-5 text-white/36">By continuing, you agree to use Hushwood respectfully and receive essential messages about your journeys.</p>
              </>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function Benefit({ icon: Icon, text }: { icon: typeof LockKeyhole; text: string }) {
  return <div className="flex items-center gap-2 rounded-full border border-white/9 bg-white/5 px-3 py-3 text-[0.7rem] font-medium text-white/48"><Icon className="h-3.5 w-3.5 text-[#d5b489]" />{text}</div>;
}
