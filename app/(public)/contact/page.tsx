"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { submitContactInquiry } from "./actions/submit-contact";
import { useCustomer } from "@/components/providers/customer-context";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Call Us",
    lines: [
      { text: "+91 98771 55088", href: "tel:+919877155088" },
      { text: "Mon - Sat | 10:00 AM - 7:00 PM", href: null },
    ],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [
      { text: "propertyfifth@dsssolutions.in", href: "mailto:propertyfifth@dsssolutions.in" },
      { text: "We'll reply as soon as possible.", href: null },
    ],
  },
  {
    icon: MapPin,
    title: "Our Office",
    lines: [
      {
        text: "#27, Level - II, Corporate Complex, CITY COURT, Near Kalka Highway, Panchkula (Chandigarh)",
        href: "https://www.google.com/maps/search/?api=1&query=30.6613276,76.8350666",
      },
    ],
  },
  {
    icon: Calendar,
    title: "Book a Consultation",
    lines: [
      { text: "Schedule a one-on-one consultation with our property experts.", href: null },
    ],
    link: "/consultation",
  },
];

export default function ContactPage() {
  const { customer } = useCustomer();
  const [state, formAction, isPending] = useActionState(submitContactInquiry, {
    success: false,
    error: null,
    fieldErrors: {},
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden mt-16 lg:mt-18">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[480px]">
          {/* Left Content */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-center">
            <div className="container-site py-12 lg:py-20">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-inverse leading-tight mb-6">
                Contact <span className="text-accent">Us</span>
              </h1>
              <div className="w-16 h-[3px] bg-accent mb-8" />
              <p className="text-inverse-muted text-base leading-relaxed max-w-md">
                Facing issues with the website or need technical support? We are here to help. Reach out and our team will assist you.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-4/5 min-h-[300px] lg:min-h-auto">
            <Image
              src="/images/hero/contact-us.png"
              alt="Property Fifth Premium Lounge"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/1 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary lg:hidden" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-py bg-card">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left: Get In Touch */}
            <div className="w-full lg:w-[380px] shrink-0">
              <h2 className="heading-lg mb-2">Get In Touch</h2>
              <div className="w-12 h-0.5 bg-accent mb-8" />
              <div className="space-y-4">
                {CONTACT_INFO.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground mb-1">
                        {item.title}
                      </h3>
                      {item.lines.map((line, i) =>
                        line.href ? (
                          <a
                            key={i}
                            href={line.href}
                            target={line.href.startsWith("http") ? "_blank" : undefined}
                            rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block text-xs text-muted-foreground hover:text-accent transition-colors leading-relaxed"
                          >
                            {line.text}
                          </a>
                        ) : (
                          <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                            {line.text}
                          </p>
                        )
                      )}
                      {item.link && (
                        <Link
                          href={item.link}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline mt-1"
                        >
                          Book now <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 min-w-0">
              <h2 className="heading-lg mb-2">Submit a Query</h2>
              <div className="w-12 h-0.5 bg-accent mb-4" />

              <div className="flex items-start gap-2 p-3 bg-warning-bg border border-warning-border rounded-lg mb-6">
                <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning leading-relaxed">
                  This form is for <strong>site-related issues</strong> and <strong>technical support</strong> only and For property queries or consultations, click on Book Consultation.
                </p>
              </div>

              {state.success ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-muted rounded-lg">
                  <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-success" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    Thank You!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Your query has been received. Our team will get in touch shortly.
                  </p>
                </div>
              ) : (
                <form action={formAction} className="space-y-5">
                  {state.error && (
                    <div className="p-3 bg-destructive-bg border border-destructive-border rounded text-xs text-destructive">
                      {state.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={customer?.name || ""}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                      {state.fieldErrors.name && (
                        <p className="text-[0.65rem] text-destructive mt-1">{state.fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-foreground mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={customer?.phone || ""}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                      {state.fieldErrors.phone && (
                        <p className="text-[0.65rem] text-destructive mt-1">{state.fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={customer?.email || ""}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    {state.fieldErrors.email && (
                      <p className="text-[0.65rem] text-destructive mt-1">{state.fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="query" className="block text-xs font-semibold text-foreground mb-1.5">
                      Your Query
                    </label>
                    <textarea
                      id="query"
                      name="query"
                      rows={4}
                      placeholder="Describe your issue or query..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                    {state.fieldErrors.query && (
                      <p className="text-[0.65rem] text-destructive mt-1">{state.fieldErrors.query}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Query
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us + Map */}
      <section className="section-py bg-muted">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="w-full lg:w-[380px] shrink-0">
              <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-accent mb-2">
                Our Office
              </p>
              <h2 className="heading-lg mb-2">Visit Us</h2>
              <div className="w-12 h-0.5 bg-accent mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                We&apos;re based in Panchkula and serve clients across India and abroad.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    #27, Level - II, Corporate Complex, CITY COURT, Near Kalka Highway, Panchkula (Chandigarh)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <a href="tel:+919877155088" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    +91 98771 55088
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href="mailto:propertyfifth@dsssolutions.in" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    propertyfifth@dsssolutions.in
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Mon - Sat | 10:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=30.6613276,76.8350666&zoom=15"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Fifth Office Location"
              />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
