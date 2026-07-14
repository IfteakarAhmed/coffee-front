import { motion } from "motion/react";

// contact.tsx এবং reservation.tsx ফাইলের জন্য buildWhatsAppUrl ফাংশনটি এখানে এক্সপোর্ট করা হলো
export const buildWhatsAppUrl = (message?: string) => {
  const PHONE = "8801818385378";
  const defaultMsg = "Hi, I have a question about The Coffee Bean & Tea Leaf.";
  const finalMsg = message || defaultMsg;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(finalMsg)}`;
};

export function FloatingWhatsApp() {
  const PHONE = "8801818385378";
  const DEFAULT_MSG = "Hi, I have a question about The Coffee Bean & Tea Leaf.";

  // Fast Refresh এরর ফিক্স করার জন্য ফাংশনটি কম্পোনেন্টের ভেতরে নিয়ে আসা হয়েছে
  const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MSG)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      // আপনার আগের অরিজিনাল কফি কালার থিম (bg-espresso এবং shadow) বজায় রাখা হয়েছে
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-accent/50 bg-espresso pl-5 pr-4 py-3 text-cream shadow-[0_18px_40px_-18px_var(--espresso)] backdrop-blur-md transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-espresso sm:pl-6 sm:pr-5"
    >
      <span className="hidden text-[0.65rem] uppercase tracking-[0.28em] sm:inline">
        Chat with us
      </span>
      {/* গোল আইকন হোল্ডারটি আগের মতোই রাখা হয়েছে, শুধু ভেতরে আসল হোয়াটসঅ্যাপ লোগো বসানো হয়েছে */}
      <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/60 bg-accent/10 text-accent transition-colors duration-500 group-hover:border-espresso group-hover:bg-espresso group-hover:text-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-current"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </span>
    </motion.a>
  );
}