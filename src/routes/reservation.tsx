import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/layout/Reveal";
import { createReservation } from "@/services/api";
import { buildWhatsAppUrl } from "@/components/common/FloatingWhatsApp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Reservation — The Coffee Bean & Tea Leaf" },
      {
        name: "description",
        content:
          "Reserve a quiet table at The Coffee Bean & Tea Leaf in Dhaka. Book online or via WhatsApp.",
      },
    ],
  }),
  component: ReservationPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) are allowed"),
  date: z.string().min(1, "Please choose a date"),
  time: z.string().min(1, "Please choose a time"),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(30, "Please call for parties over 30"),
  notes: z.string().max(500, "Keep it under 500 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full rounded-sm border border-border/70 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const labelCls =
  "block text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground";

function ReservationPage() {
  const [confirmed, setConfirmed] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2 },
  });

  const values = watch();

  const buildWhatsAppMessage = () => {
    const parts: string[] = ["Hi, I'd like to reserve a table at The Coffee Bean & Tea Leaf"];
    if (values.date) parts.push(`for ${values.date}`);
    if (values.time) parts.push(`at ${values.time}`);
    if (values.guests) parts.push(`for ${values.guests} people`);
    let msg = parts.join(" ") + ".";
    if (values.name) msg += ` My name is ${values.name}.`;
    if (values.notes) msg += ` Note: ${values.notes}`;
    return msg;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createReservation({
        name: data.name,
        email: "",
        phone: data.phone,
        partySize: data.guests,
        date: data.date,
        time: data.time,
        notes: data.notes,
      });
      setConfirmed(data);
      toast.success("Reservation received", {
        description: "We'll confirm your table shortly.",
      });
      reset({ guests: 2 });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again or reserve via WhatsApp.",
      });
    }
  };

  return (
    <>
      <PageHero
        title="Reserve"
        chapter="02 — Reservation"
        image="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=2400&q=80"
        video="https://cdn.coverr.co/videos/coverr-a-table-in-a-restaurant-7266/1080p.mp4"
        captionLeft="Reserve Your"
        captionRight="Table Today"
      />

      <section className="relative bg-background pb-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-5 md:gap-14 lg:px-10">
          {/* Form */}
          <Reveal className="md:col-span-3">
            <div className="rounded-sm border border-border/70 bg-card p-6 sm:p-10">
              <span className="chapter-label">The Form</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-foreground md:text-4xl">
                Book your table
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
                <div>
                  <label htmlFor="name" className={labelCls}>Name</label>
                  <input
                    id="name"
                    autoComplete="name"
                    placeholder="Full name"
                    className={cn(inputCls, "mt-2")}
                    {...register("name")}
                  />
                  {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className={labelCls}>Phone</label>
                  <input
                    id="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+880 …"
                    className={cn(inputCls, "mt-2")}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="mt-2 text-xs text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="date" className={labelCls}>Date</label>
                    <input
                      id="date"
                      type="date"
                      className={cn(inputCls, "mt-2")}
                      {...register("date")}
                    />
                    {errors.date && <p className="mt-2 text-xs text-destructive">{errors.date.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="time" className={labelCls}>Time</label>
                    <input
                      id="time"
                      type="time"
                      className={cn(inputCls, "mt-2")}
                      {...register("time")}
                    />
                    {errors.time && <p className="mt-2 text-xs text-destructive">{errors.time.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="guests" className={labelCls}>Guests</label>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      max={30}
                      className={cn(inputCls, "mt-2")}
                      {...register("guests")}
                    />
                    {errors.guests && <p className="mt-2 text-xs text-destructive">{errors.guests.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className={labelCls}>Special Request</label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Window seat, birthday setup, allergies…"
                    className={cn(inputCls, "mt-2 resize-none")}
                    {...register("notes")}
                  />
                  {errors.notes && <p className="mt-2 text-xs text-destructive">{errors.notes.message}</p>}
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:bg-accent hover:text-espresso disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending…" : "Reserve Table"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>

                  <a
                    href={buildWhatsAppUrl(buildWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 rounded-sm border border-accent px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-accent transition-all duration-500 hover:bg-accent hover:text-espresso"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Reserve via WhatsApp
                  </a>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Side info */}
          <Reveal delay={0.15} className="md:col-span-2">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-sm border border-border/70 bg-card p-8">
                <span className="chapter-label">A Note</span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  We seat parties from 8am to 10pm daily. Larger groups (10+)
                  are best arranged with a quick WhatsApp — we'll set the room
                  aside for you.
                </p>
              </div>
              <div className="rounded-sm border border-border/70 bg-espresso p-8 text-cream">
                <span className="chapter-label">Prefer to call?</span>
                <a
                  href="tel:+8801818385378"
                  className="mt-4 block font-display text-3xl text-cream hover:text-accent"
                >
                  +880 1818-385378
                </a>
                <p className="mt-3 text-xs text-cream/70">
                  House No 11, A Rd 117, Dhaka 1212
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/70 backdrop-blur-sm px-4"
            onClick={() => setConfirmed(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-sm border border-accent/50 bg-background p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent bg-accent/15 text-accent"
              >
                <Check className="h-6 w-6" />
              </motion.div>
              <span className="mt-6 block chapter-label">Reservation Received</span>
              <h3 className="mt-4 font-display text-3xl text-foreground">
                Thank you, {confirmed.name.split(" ")[0]}.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Your table for {confirmed.guests} on {confirmed.date} at{" "}
                {confirmed.time} is pending. We'll confirm shortly on{" "}
                {confirmed.phone}.
              </p>
              <button
                onClick={() => setConfirmed(null)}
                className="mt-8 inline-flex items-center gap-3 border-b border-accent pb-1 text-[0.7rem] uppercase tracking-[0.28em] text-foreground hover:text-accent"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
