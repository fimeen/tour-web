import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNav from "@/components/GlobalNav";
import MotionReveal from "@/components/MotionReveal";
import SiteFooter from "@/components/SiteFooter";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Clock3, Instagram, Loader2, Mail, MapPin, Phone, Send, Sprout } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const subjectOptions = ["Choosing a journey", "Private group departure", "Accessibility and pace", "Existing reservation", "Something else"];

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: subjectOptions[0], message: "" });

  useEffect(() => {
    if (!user) return;
    setForm(current => ({ ...current, name: current.name || user.name || "", email: current.email || user.email || "" }));
  }, [user]);

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setForm(current => ({ ...current, message: "" }));
    },
    onError: error => toast.error(error.message || "Your message could not be sent."),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 12) {
      toast.error("Please complete your name, email, and a little more detail in your message.");
      return;
    }
    sendMessage.mutate(form);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />
      <main id="main-content">
        <section className="px-3 pb-4 pt-24 sm:px-5 sm:pb-5 sm:pt-28">
          <div className="relative mx-auto min-h-[560px] max-w-[1360px] overflow-hidden rounded-[2.5rem] bg-[#10281f] text-[#f6f2e8] sm:rounded-[3rem]">
            <img src="/manus-storage/cloudforest-passage-v2_05ded329.jpg" alt="Soft light moving through a mossy forest" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,30,21,0.94)_0%,rgba(9,30,21,0.72)_48%,rgba(9,30,21,0.24)_100%)]" />
            <div className="relative flex min-h-[560px] flex-col justify-end px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
              <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-[#d5b489]">Start with a conversation</motion.p>
              <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.76, ease: [0.23, 1, 0.32, 1] }} className="mt-6 max-w-[10ch] font-display text-[clamp(4.8rem,9vw,9rem)] font-medium leading-[0.77] tracking-[-0.055em]">We’re here to <em className="text-[#d5b489]">listen.</em></motion.h1>
              <motion.p initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.68 }} className="mt-7 max-w-xl text-base leading-8 text-white/65">Tell us how you want to travel, what pace feels right, or what you need to feel at ease. A real journey guide will write back.</motion.p>
            </div>
          </div>
        </section>

        <section className="container py-16 sm:py-24">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <MotionReveal className="rounded-[2.5rem] bg-[#d8c09e] p-7 text-[#17372a] sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17372a] text-[#f6f2e8]"><MapPin className="h-5 w-5" /></span>
                <p className="mt-8 eyebrow">Journey desk</p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-none">Chiang Mai, Thailand</h2>
                <p className="mt-4 text-sm leading-7 text-[#17372a]/65">In-person planning by appointment. Remote conversations welcome from anywhere.</p>
              </MotionReveal>
              <MotionReveal delay={0.07} className="rounded-[2.5rem] bg-[#10281f] p-7 text-[#f6f2e8] sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-[#d5b489]"><Clock3 className="h-5 w-5" /></span>
                <p className="mt-8 eyebrow text-[#d5b489]">Quiet hours</p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-none">Monday–Friday</h2>
                <p className="mt-4 text-sm leading-7 text-white/58">09:00–17:00 ICT<br />Replies usually arrive within one working day.</p>
              </MotionReveal>
              <MotionReveal delay={0.12} className="rounded-[2.5rem] border border-primary/12 bg-card p-7 sm:p-9">
                <p className="eyebrow text-[#795337]">Stay close</p>
                <div className="mt-6 space-y-3">
                  <a href="mailto:hello@hushwood.travel" className="flex items-center justify-between rounded-full bg-secondary/70 px-5 py-4 text-sm font-semibold hover:bg-secondary"><span className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" />hello@hushwood.travel</span><ArrowRight className="h-4 w-4" /></a>
                  <a href="tel:+6653000000" className="flex items-center justify-between rounded-full bg-secondary/70 px-5 py-4 text-sm font-semibold hover:bg-secondary"><span className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" />+66 53 000 000</span><ArrowRight className="h-4 w-4" /></a>
                  <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-full bg-secondary/70 px-5 py-4 text-sm font-semibold hover:bg-secondary"><span className="flex items-center gap-3"><Instagram className="h-4 w-4 text-primary" />Instagram</span><ArrowRight className="h-4 w-4" /></a>
                </div>
              </MotionReveal>
            </div>

            <MotionReveal className="relative overflow-hidden rounded-[3rem] bg-card p-6 shadow-[0_30px_100px_-48px_rgba(23,55,42,0.35)] sm:p-10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="flex min-h-[650px] flex-col items-center justify-center text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></span>
                    <p className="mt-8 eyebrow text-[#795337]">Message received</p>
                    <h2 className="mt-4 max-w-lg font-display text-6xl font-semibold leading-[0.9]">We’ll meet you in the <em className="text-primary">quiet.</em></h2>
                    <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">A journey guide will read your note and reply personally within one working day.</p>
                    <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full border border-primary/16 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/6">Send another message</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <p className="eyebrow text-[#795337]">Write to Hushwood</p>
                    <h2 className="mt-5 font-display text-5xl font-semibold leading-none sm:text-6xl">What’s on your mind?</h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">No sales script. No rush. Share as much or as little as you need.</p>
                    <div className="mt-9 grid gap-5 sm:grid-cols-2">
                      <ContactField label="Your name" value={form.name} onChange={value => setForm(current => ({ ...current, name: value }))} autoComplete="name" />
                      <ContactField label="Email address" type="email" value={form.email} onChange={value => setForm(current => ({ ...current, email: value }))} autoComplete="email" />
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-xs font-semibold text-foreground/72">What can we help with?</span>
                        <select value={form.subject} onChange={event => setForm(current => ({ ...current, subject: event.target.value }))} className="h-14 w-full appearance-none rounded-full border border-input bg-secondary/45 px-5 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/8">
                          {subjectOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-xs font-semibold text-foreground/72">Your message</span>
                        <textarea value={form.message} onChange={event => setForm(current => ({ ...current, message: event.target.value }))} maxLength={5000} rows={9} placeholder="Tell us about the journey you’re imagining…" className="w-full rounded-[2rem] border border-input bg-secondary/45 px-5 py-4 text-sm leading-7 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/8" />
                      </label>
                    </div>
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"><Sprout className="h-4 w-4 text-primary" />Your note is read by a person, never a bot.</p>
                      <button type="submit" disabled={sendMessage.isPending} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97] disabled:opacity-50">
                        {sendMessage.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending gently</> : <>Send message <Send className="h-4 w-4" /></>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </MotionReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactField({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string }) {
  return <label><span className="mb-2 block text-xs font-semibold text-foreground/72">{label}</span><input type={type} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} className="h-14 w-full rounded-full border border-input bg-secondary/45 px-5 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/8" /></label>;
}
