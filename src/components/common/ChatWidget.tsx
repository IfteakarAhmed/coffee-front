import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";
import { sendChatMessage, type ChatMessage } from "@/services/api";
import { cn } from "@/lib/utils";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm here to help with menu questions, reservations, or anything about The Coffee Bean & Tea Leaf.",
  createdAt: new Date().toISOString(),
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => scrollToBottom("smooth"));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => scrollToBottom("auto"));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setSending(true);

    try {
      const reply = await sendChatMessage(text, history);
      setMessages((m) => [...m, reply]);
      setStreamingId(reply.id);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Something went wrong on our end. Please try again in a moment.",
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, errorMsg]);
      setStreamingId(errorMsg.id);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="group fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full border border-accent/50 bg-cream pl-5 pr-4 py-3 text-espresso shadow-[0_18px_40px_-18px_var(--espresso)] backdrop-blur-md transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-espresso sm:pl-6 sm:pr-5"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.28em] inline">
          {open ? "Close" : "ASK AI"}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-espresso/20 bg-espresso text-accent transition-transform duration-500 group-hover:scale-105">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "chat"}
              initial={{ rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 60, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid place-items-center"
            >
              {open ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-h-[calc(100svh-8rem)] w-auto max-w-md flex-col overflow-hidden rounded-lg border border-accent/40 bg-background shadow-[0_30px_80px_-20px_var(--espresso)] sm:left-6 sm:right-auto sm:mx-0 sm:w-[24rem]"
            style={{ maxHeight: "min(32rem, calc(100svh - 8rem))" }}
          >
            <div className="flex items-center gap-3 border-b border-border/70 bg-espresso px-5 py-4 text-cream">
              <BotAvatar />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base leading-tight text-cream">
                  The Coffee Bean <span className="text-accent">&amp;</span> Tea Leaf
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-accent/90">
                  AI Assistant · Usually replies instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-background px-4 py-5 scrollbar-thin"
            >
              {messages.map((m) => (
                <MessageRow
                  key={m.id}
                  message={m}
                  isStreaming={m.id === streamingId}
                  onStreamDone={() => setStreamingId(null)}
                />
              ))}
              {sending && <TypingRow />}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-border/70 bg-card px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the menu, hours, or booking..."
                maxLength={500}
                className="flex-1 rounded-sm border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-primary text-primary-foreground transition-colors hover:bg-accent hover:text-espresso disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BotAvatar() {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/50 bg-accent/15 text-accent">
      <Bot className="h-5 w-5" />
    </div>
  );
}

function MarkdownLink(props: ComponentPropsWithoutRef<"a">) {
  const href = props.href ?? "#";
  const children = props.children;

  if (href.startsWith("/")) {
    return (
      <Link to={href} className="text-accent underline underline-offset-2 hover:text-foreground">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:text-foreground"
    >
      {children}
    </a>
  );
}

function MarkdownParagraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="mb-2 last:mb-0 leading-relaxed">{props.children}</p>;
}

function MarkdownUl(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className="mb-2 ml-4 list-disc space-y-1.5 last:mb-0 marker:text-accent">
      {props.children}
    </ul>
  );
}

function MarkdownOl(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className="mb-2 ml-4 list-decimal space-y-1.5 last:mb-0 marker:text-accent">
      {props.children}
    </ol>
  );
}

function MarkdownLi(props: ComponentPropsWithoutRef<"li">) {
  return <li className="leading-relaxed pl-1">{props.children}</li>;
}

function MarkdownStrong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong className="font-semibold text-espresso">{props.children}</strong>;
}

function MarkdownHeading(props: ComponentPropsWithoutRef<"h1">) {
  return <p className="mb-1.5 font-display text-base">{props.children}</p>;
}

function MarkdownSubheading(props: ComponentPropsWithoutRef<"h3">) {
  return <p className="mb-1 font-semibold">{props.children}</p>;
}

const MARKDOWN_COMPONENTS = {
  a: MarkdownLink,
  p: MarkdownParagraph,
  ul: MarkdownUl,
  ol: MarkdownOl,
  li: MarkdownLi,
  strong: MarkdownStrong,
  h1: MarkdownHeading,
  h2: MarkdownHeading,
  h3: MarkdownSubheading,
};

function useTypewriter(text: string, active: boolean, onDone: () => void) {
  const [visibleCount, setVisibleCount] = useState(active ? 0 : Infinity);
  const words = text.split(/(\s+)/);

  useEffect(() => {
    if (!active) {
      setVisibleCount(Infinity);
      return;
    }
    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= words.length) {
        clearInterval(interval);
        onDone();
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, active]);

  return words.slice(0, visibleCount).join("");
}

function MessageRow({
  message,
  isStreaming,
  onStreamDone,
}: {
  message: ChatMessage;
  isStreaming: boolean;
  onStreamDone: () => void;
}) {
  const isUser = message.role === "user";
  const displayedContent = useTypewriter(message.content, !isUser && isStreaming, onStreamDone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && <BotAvatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-espresso text-cream"
            : "rounded-bl-sm border border-border/60 bg-card text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>
              {displayedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <BotAvatar />
      <div className="flex items-center gap-1.5 rounded-lg rounded-bl-sm border border-border/60 bg-card px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}