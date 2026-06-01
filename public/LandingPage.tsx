"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    title: "Smart Card Dashboard",
    desc: "All your credit cards in one place. Track balances, limits, and reward points at a glance.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
      </svg>
    ),
    title: "Spend Optimizer",
    desc: "Enter a category, amount, and vendor — get the best card from your wallet instantly.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: "AI Card Advisor",
    desc: "Chat with Gemini AI about milestone benefits, lounge access, reward transfers, and more.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Smart Tips",
    desc: "Personalised insights on how to maximise reward points before they expire.",
  },
];

const steps = [
  { num: "01", label: "Add your cards", sub: "Select from 21+ Indian credit cards" },
  { num: "02", label: "Describe your spend", sub: "Category, amount, vendor" },
  { num: "03", label: "Get the best card", sub: "Optimised pick, instantly" },
];

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-3xl" />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CreditWise</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center"
      >
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-powered credit card optimiser for India
        </div>

        <h1
          className={`text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          Stop leaving{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            reward points
          </span>
          <br />on the table
        </h1>

        <p
          className={`text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          CreditWise tells you exactly which card to swipe, every time — and helps you squeeze every rupee of value from your rewards.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/30"
          >
            Get started free
          </Link>
          <Link
            href="/dashboard?demo=true"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-medium text-sm text-gray-300 transition-colors"
          >
            Try demo →
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase text-center mb-10">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`relative p-6 rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-sm transition-all duration-700`}
              style={{ transitionDelay: `${400 + i * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)" }}
            >
              <span className="text-3xl font-bold text-white/8 tabular-nums">{s.num}</span>
              <p className="mt-3 font-semibold text-white text-[15px]">{s.label}</p>
              <p className="text-gray-500 text-sm mt-1">{s.sub}</p>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-2 -translate-y-1/2 text-gray-700">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase text-center mb-10">
          Features
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-white/6 bg-white/[0.03] hover:bg-white/[0.055] hover:border-white/10 transition-all duration-300 backdrop-blur-sm"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center text-blue-300 mb-4 group-hover:scale-105 transition-transform duration-200">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white text-[15px] mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-blue-950/60 to-violet-950/60 backdrop-blur-sm p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to optimise your cards?</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">
            Join CreditWise and start making every swipe count.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/30"
          >
            Get started free
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} CreditWise. Built by Piyush.
      </footer>
    </main>
  );
}
