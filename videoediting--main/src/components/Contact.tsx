import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { CONTACT, SITE_INFO, WEB3FORMS_ACCESS_KEY } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { buildWhatsAppUrl } from "../utils/video";
import { MagneticButton } from "./MagneticButton";

interface FormState {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  botcheck: boolean;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "fallback";

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  projectType: CONTACT.projectTypes[0],
  message: "",
  botcheck: false,
};

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { reducedMotion } = useDeviceCapabilities();

  const prefilledWhatsAppUrl = buildWhatsAppUrl({
    name: form.name,
    projectType: form.projectType,
    message: form.message,
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback if clipboard API blocked
      window.location.href = CONTACT.emailUrl;
    }
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    const emailTrimmed = form.email.trim();
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim() || form.message.trim().length < 8) {
      next.message = "Tell me a bit about your video project (at least 8 characters).";
    }
    return next;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "fallback") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Spam honeypot check
    if (form.botcheck) {
      setStatus("success");
      setStatusMessage("Message sent! I'll reply soon.");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const isKeyConfigured =
      WEB3FORMS_ACCESS_KEY.trim().length > 0 &&
      WEB3FORMS_ACCESS_KEY !== "PASTE_YOUR_KEY_HERE";

    if (!isKeyConfigured) {
      setStatus("fallback");
      setStatusMessage(
        "Direct email submission isn't activated yet. Send your filled details straight to my WhatsApp in one tap!"
      );
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New project enquiry from Pankajxvisuals website",
          from_name: "Pankajxvisuals Website",
          botcheck: "",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || "Not provided",
          project_type: form.projectType,
          message: form.message.trim(),
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage("Message sent! I'll reply within a few hours.");
        setForm(INITIAL_FORM);
      } else {
        setStatus("fallback");
        setStatusMessage(
          "Could not send via email right now. Use the WhatsApp button below — your details are already prefilled!"
        );
      }
    } catch {
      setStatus("fallback");
      setStatusMessage(
        "Network hiccup while sending email. You can message me directly on WhatsApp with your details prefilled."
      );
    }
  };

  const directChannels = [
    {
      label: "WhatsApp",
      value: CONTACT.phoneDisplay,
      href: CONTACT.whatsappUrl,
      icon: MessageCircle,
      external: true,
    },
    {
      label: "Call",
      value: CONTACT.phoneDisplay,
      href: CONTACT.callUrl,
      icon: Phone,
      external: false,
    },
    {
      label: "Email",
      value: CONTACT.email,
      href: CONTACT.emailUrl,
      icon: Mail,
      external: false,
    },
    {
      label: "Instagram",
      value: CONTACT.instagramHandle,
      href: CONTACT.instagramUrl,
      icon: Instagram,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[420px] w-[520px] opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 72%)",
        }}
      />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: CTA Copy + Direct Channels */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between lg:col-span-5"
          >
            <div>
              <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
                Contact
              </p>

              <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.92] tracking-[0.02em] text-[var(--text-primary)] uppercase [text-wrap:balance]">
                Let&apos;s make something people{" "}
                <span className="text-amber-gradient">watch</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                Have raw footage sitting on a drive or a channel you want to
                scale? Send your brief below or message me directly on WhatsApp
                for a quick turnaround quote.
              </p>
            </div>

            {/* Direct Contact Channels */}
            <div className="mt-10 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {directChannels.map((channel) => {
                const Icon = channel.icon;
                const isEmail = channel.label === "Email";

                return (
                  <div
                    key={channel.label}
                    className="flex min-h-[60px] items-center justify-between gap-3 py-3.5"
                  >
                    <a
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noopener noreferrer" : undefined}
                      data-cursor="OPEN"
                      className="group flex min-w-0 flex-1 items-center gap-3.5 transition-colors hover:text-[var(--accent-solid)]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--accent-solid)] transition-colors group-hover:border-[var(--accent-solid)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                          {channel.label}
                        </p>
                        <p className="truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-solid)] sm:text-[15px]">
                          {channel.value}
                        </p>
                      </div>
                    </a>

                    {isEmail ? (
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address"
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[var(--text-primary)] uppercase transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)] cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        href={channel.href}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noopener noreferrer" : undefined}
                        aria-label={`Open ${channel.label}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-solid)]"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-[var(--text-muted)] uppercase">
              {SITE_INFO.location} · {SITE_INFO.availability}
            </p>
          </motion.div>

          {/* Right: Web3Forms Contact Form + WhatsApp Instant Option */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: reducedMotion ? 0 : 0.08 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-[var(--accent-solid)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-px -bottom-px h-4 w-4 border-r-2 border-b-2 border-[var(--accent-solid)]"
              />

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Hidden Web3Forms Honeypot */}
                <input
                  type="checkbox"
                  name="botcheck"
                  checked={form.botcheck}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, botcheck: e.target.checked }))
                  }
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block font-mono text-[11px] tracking-[0.18em] text-[var(--text-secondary)] uppercase"
                    >
                      Name <span className="text-[var(--accent-solid)]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name or channel"
                      value={form.name}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.name)}
                      className={`min-h-[48px] w-full rounded-sm border bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/70 transition-colors focus:border-[var(--accent-solid)] focus:outline-none ${
                        errors.name ? "border-red-500/80" : "border-[var(--border-strong)]"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block font-mono text-[11px] tracking-[0.18em] text-[var(--text-secondary)] uppercase"
                    >
                      Email <span className="text-[var(--accent-solid)]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                      className={`min-h-[48px] w-full rounded-sm border bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/70 transition-colors focus:border-[var(--accent-solid)] focus:outline-none ${
                        errors.email ? "border-red-500/80" : "border-[var(--border-strong)]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-2 block font-mono text-[11px] tracking-[0.18em] text-[var(--text-secondary)] uppercase"
                    >
                      Phone / WhatsApp{" "}
                      <span className="text-[var(--text-muted)]">(Optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98XXX XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      className="min-h-[48px] w-full rounded-sm border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/70 transition-colors focus:border-[var(--accent-solid)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-project-type"
                      className="mb-2 block font-mono text-[11px] tracking-[0.18em] text-[var(--text-secondary)] uppercase"
                    >
                      Project Type
                    </label>
                    <select
                      id="contact-project-type"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      className="min-h-[48px] w-full rounded-sm border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] transition-colors focus:border-[var(--accent-solid)] focus:outline-none"
                    >
                      {CONTACT.projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block font-mono text-[11px] tracking-[0.18em] text-[var(--text-secondary)] uppercase"
                  >
                    Project Details <span className="text-[var(--accent-solid)]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Share your video length, frequency, reference style, or target deadline..."
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    className={`w-full resize-y rounded-sm border bg-[var(--bg-primary)] px-4 py-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)]/70 transition-colors focus:border-[var(--accent-solid)] focus:outline-none ${
                      errors.message ? "border-red-500/80" : "border-[var(--border-strong)]"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
                  )}
                </div>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                    className="flex items-start gap-3 rounded-sm border border-emerald-500/40 bg-emerald-500/12 p-4 text-sm text-emerald-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <p>{statusMessage}</p>
                  </motion.div>
                )}

                {status === "fallback" && (
                  <div
                    role="alert"
                    className="space-y-3 rounded-sm border border-[var(--accent-solid)]/45 bg-[var(--accent-start)]/10 p-4 text-sm text-[var(--text-primary)]"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-solid)]" />
                      <p className="leading-relaxed text-[var(--text-secondary)]">
                        {statusMessage}
                      </p>
                    </div>
                    <a
                      href={prefilledWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-amber-gradient px-5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send prefilled details on WhatsApp
                    </a>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    disabled={status === "submitting"}
                    className="w-full px-7 py-3.5 text-sm uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    cursorLabel="SEND"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send enquiry
                      </>
                    )}
                  </MagneticButton>

                  <MagneticButton
                    href={prefilledWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    className="w-full px-6 py-3.5 text-sm sm:w-auto"
                    cursorLabel="CHAT"
                  >
                    <MessageCircle className="h-4 w-4 text-[var(--accent-solid)]" />
                    Message on WhatsApp instead
                  </MagneticButton>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
