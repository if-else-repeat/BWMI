import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Database,
  WifiOff,
  Fingerprint,
  ShieldCheck,
  Layers,
  Layout,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 bg-[#f4f4f0] pb-24 font-sans text-gray-900">
      {/* Top Header Lockup */}
      <header className="bg-black text-[#f4f4f0] px-4 py-3 brutal-border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#10b981] inline-block animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-sm md:text-base font-mono">
              Build What Moves India{" "}
              <span className="text-gray-400 font-medium">
                (Varun Mayya x OpenAI)
              </span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="bg-[#10b981] text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Online
            </span>
            <span className="text-gray-400 text-xs tracking-wider uppercase font-bold">
              Final Submission Architecture
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 space-y-20">
        {/* HERO SECTION */}
        <section className="space-y-6">
          <div className="inline-block bg-white brutal-border border-l-4 border-l-[#048282] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-600 shadow-sm">
            Architectural Brief
          </div>

          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-black leading-[0.9] font-sans">
            Build What <br className="hidden sm:block" />
            <span className="text-[#048282]">Moves India.</span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-700 font-sans leading-relaxed max-w-4xl font-medium pt-4">
            A fundamental reimagining of Indian public-service digital
            infrastructure. Moving from fragile, server-dependent portals that
            crash under load to a resilient,
            <strong className="text-black">
              {" "}
              offline-first, zero-data-loss browser architecture.
            </strong>
          </p>
        </section>

        {/* THE LAUNCHPAD: Action Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b-[3px] border-black pb-3">
            <Layout className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-black font-sans">
              Interactive Working Prototypes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Prototype 01 Card */}
            <a
              href="/prototype/epfo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 bg-white brutal-border brutal-shadow hover:-translate-y-1 transition-transform group flex flex-col justify-between min-h-[280px] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#048282]" />
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#048282] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Prototype 01
                </span>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#048282] transition-colors">
                  <ArrowRight className="w-5 h-5 text-gray-900 group-hover:text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tight leading-none">
                  Resilient <br />
                  EPFO Portal
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  A complete end-to-end replica of the official Employees'
                  Provident Fund Organisation member portal. Features fully
                  functional offline-first form filing, WebAuthn passkey login,
                  and multi-user simulation.
                </p>
              </div>
            </a>

            {/* Prototype 02 Card */}
            <a
              href="/prototype/gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 bg-black text-white brutal-border brutal-shadow-dark hover:-translate-y-1 transition-transform group flex flex-col justify-between min-h-[280px] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C1622D]" />
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C1622D] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Prototype 02
                </span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C1622D] transition-colors">
                  <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tight leading-none text-white">
                  Unified <br />
                  Public Gateway
                </h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Demonstrating visual and technical scalability across multiple
                  government departments. A central citizen dashboard showcasing
                  Income Tax, Parivahan, and e-SHRAM integrations using our
                  standardized resilient architecture.
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* SECTION: ARCHITECTURAL INNOVATIONS */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-3 border-b-[3px] border-black pb-3">
            <Cpu className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-black font-sans">
              Core Architectural Innovations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Innovation 1 */}
            <div className="bg-white p-6 brutal-border border-t-[6px] border-t-[#048282]">
              <Database className="w-8 h-8 text-[#048282] mb-4" />
              <h3 className="text-lg font-bold text-black uppercase mb-3 leading-tight">
                0ms Keystroke <br />
                Data Persistence
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Forms write instantly to the browser's IndexedDB via Dexie.js.
                Power outages, network disconnects, or accidental tab closures
                result in exactly 0% data loss for the citizen.
              </p>
            </div>

            {/* Innovation 2 */}
            <div className="bg-white p-6 brutal-border border-t-[6px] border-t-[#C1622D]">
              <WifiOff className="w-8 h-8 text-[#C1622D] mb-4" />
              <h3 className="text-lg font-bold text-black uppercase mb-3 leading-tight">
                Offline Submission <br />
                Sync Queueing
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                If a citizen submits a critical claim during a 504 Gateway
                Timeout or dead network, the payload is securely cached locally
                and automatically replayed to the server upon reconnection.
              </p>
            </div>

            {/* Innovation 3 */}
            <div className="bg-white p-6 brutal-border border-t-[6px] border-t-black">
              <Fingerprint className="w-8 h-8 text-black mb-4" />
              <h3 className="text-lg font-bold text-black uppercase mb-3 leading-tight">
                Bypassing SMS OTP <br />
                Bottlenecks
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Replacing congested central SMS gateways with WebAuthn Passkeys.
                Leveraging local device hardware (Touch ID / Face ID) for
                instant, secure authentication without relying on cellular
                networks.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: DESIGN SYSTEM */}
        <section className="space-y-8 pt-10">
          <div className="flex items-center gap-3 border-b-[3px] border-black pb-3">
            <Layers className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-black font-sans">
              Visual Identity & Accessibility
            </h2>
          </div>

          <div className="bg-white brutal-border brutal-shadow p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3">
              <div className="w-16 h-16 bg-black flex items-center justify-center text-white brutal-border brutal-shadow-sm mb-4">
                <ShieldCheck className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-2xl font-black uppercase leading-tight">
                Designed for <br />
                Real Indian Users
              </h3>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#048282] inline-block" />
                  High-Contrast Neo-Brutalism
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Solid borders, stark contrast, and zero low-opacity gradients.
                  Guarantees maximum legibility under bright outdoor sunlight on
                  low-cost mobile screens.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C1622D] inline-block" />
                  Space Mono for Data
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monospace typography isolates critical identifiers (UANs,
                  PANs, Accounts). Prevents citizens from misreading '0' for 'O'
                  or '1' for 'I'.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-black inline-block" />
                  Cognitive Focus Workflow
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Elimination of bloated marquee notices during forms.
                  Standardized 3-step wizards (Identify → Declare → Sign) ensure
                  one task per screen.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#10b981] inline-block" />
                  Native Bilingual Support
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every interface element instantly toggles between English and
                  Hindi locally, without requiring a full page reload or server
                  roundtrip.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
