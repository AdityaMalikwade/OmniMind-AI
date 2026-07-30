import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Search,
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] bg-cyan-500/20 blur-[150px] rounded-full" />
      <div className="absolute top-[200px] right-[-150px] w-[450px] h-[450px] bg-indigo-600/20 blur-[160px] rounded-full" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              OmniMind AI
            </h1>

            <p className="text-xs text-slate-400">
              Your Second Brain
            </p>
          </div>

        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-white transition">
            How It Works
          </a>

          <a href="#about" className="hover:text-white transition">
            About
          </a>

        </div>

        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="px-5 py-2.5 text-sm text-slate-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-sm font-semibold"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* Hero Section */}
      <main className="relative z-10">

        <section className="px-6 lg:px-16 pt-24 pb-20">

          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-xl">

              <Sparkles className="w-4 h-4 text-cyan-400" />

              AI-Powered Personal Knowledge Engine

            </div>


            {/* Heading */}
            <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight">

              Your Knowledge.

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                One Intelligent Search.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-7 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">

              OmniMind AI transforms your documents, images, notes,
              code and knowledge into one searchable intelligent
              second brain.

            </p>


            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link
                to="/register"
                className="group flex items-center gap-2 px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-lg shadow-indigo-600/20"
              >

                Start Building Your Second Brain

                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />

              </Link>


              <Link
                to="/login"
                className="px-7 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold backdrop-blur-xl"
              >
                Sign In
              </Link>

            </div>

          </div>

        </section>


        {/* Search Preview */}
        <section className="px-6 pb-24">

          <div className="max-w-4xl mx-auto">

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-2xl">

              <div className="rounded-2xl bg-[#080d1c] border border-white/10 p-5">

                <div className="flex items-center gap-4">

                  <Search className="w-6 h-6 text-cyan-400" />

                  <div className="flex-1 text-slate-400">
                    Search your entire knowledge base...
                  </div>

                  <div className="hidden sm:block text-xs text-slate-500 border border-white/10 px-3 py-1.5 rounded-lg">
                    Ctrl K
                  </div>

                </div>

              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-3">

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-slate-500">
                    DOCUMENT
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Machine Learning Notes.pdf
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-slate-500">
                    CODE
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    recommendation_model.py
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-slate-500">
                    IMAGE
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Project Architecture.png
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Features */}
        <section
          id="features"
          className="px-6 lg:px-16 py-24 border-t border-white/10"
        >

          <div className="max-w-6xl mx-auto">

            <div className="text-center">

              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
                Powerful Features
              </p>

              <h2 className="mt-3 text-4xl md:text-5xl font-bold">
                Everything you know.
                <br />
                One intelligent system.
              </h2>

              <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
                Store, understand and retrieve your knowledge
                with AI-powered intelligence.
              </p>

            </div>


            <div className="mt-14 grid md:grid-cols-3 gap-6">

              {/* Feature 1 */}
              <div className="group rounded-3xl bg-white/[0.04] border border-white/10 p-7 hover:bg-white/[0.07] hover:border-cyan-400/30 transition">

                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-cyan-400" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Semantic Search
                </h3>

                <p className="mt-3 text-slate-400 leading-relaxed">
                  Search your knowledge using natural language
                  instead of remembering exact keywords.
                </p>

              </div>


              {/* Feature 2 */}
              <div className="group rounded-3xl bg-white/[0.04] border border-white/10 p-7 hover:bg-white/[0.07] hover:border-indigo-400/30 transition">

                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Smart Documents
                </h3>

                <p className="mt-3 text-slate-400 leading-relaxed">
                  Upload PDFs, documents, images, code and
                  other files into your personal knowledge base.
                </p>

              </div>


              {/* Feature 3 */}
              <div className="group rounded-3xl bg-white/[0.04] border border-white/10 p-7 hover:bg-white/[0.07] hover:border-purple-400/30 transition">

                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  AI Knowledge Chat
                </h3>

                <p className="mt-3 text-slate-400 leading-relaxed">
                  Ask questions about your own documents
                  and get context-aware AI answers.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* How It Works */}
        <section
          id="how-it-works"
          className="px-6 lg:px-16 py-24"
        >

          <div className="max-w-6xl mx-auto">

            <div className="text-center">

              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
                How It Works
              </p>

              <h2 className="mt-3 text-4xl md:text-5xl font-bold">
                From files to intelligence.
              </h2>

            </div>


            <div className="mt-14 grid md:grid-cols-3 gap-6">

              <div className="p-7 rounded-3xl bg-white/[0.04] border border-white/10">

                <div className="text-4xl font-bold text-cyan-400">
                  01
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Upload
                </h3>

                <p className="mt-3 text-slate-400">
                  Add your documents, images, notes and code.
                </p>

              </div>


              <div className="p-7 rounded-3xl bg-white/[0.04] border border-white/10">

                <div className="text-4xl font-bold text-indigo-400">
                  02
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Understand
                </h3>

                <p className="mt-3 text-slate-400">
                  AI extracts, processes and indexes your knowledge.
                </p>

              </div>


              <div className="p-7 rounded-3xl bg-white/[0.04] border border-white/10">

                <div className="text-4xl font-bold text-purple-400">
                  03
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Ask
                </h3>

                <p className="mt-3 text-slate-400">
                  Search or chat with everything you have stored.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* Trust Section */}
        <section
          id="about"
          className="px-6 lg:px-16 py-24 border-t border-white/10"
        >

          <div className="max-w-5xl mx-auto text-center">

            <h2 className="text-4xl md:text-5xl font-bold">
              Built for your knowledge.
            </h2>

            <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
              OmniMind AI is designed to become your personal
              intelligent knowledge layer — helping you find,
              understand and connect information faster.
            </p>


            <div className="mt-12 grid sm:grid-cols-3 gap-6">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                <Zap className="w-7 h-7 text-cyan-400 mx-auto" />

                <h3 className="mt-4 font-semibold">
                  Fast
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Find information in seconds.
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                <ShieldCheck className="w-7 h-7 text-indigo-400 mx-auto" />

                <h3 className="mt-4 font-semibold">
                  Private
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Your knowledge stays organized and controlled.
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                <BrainCircuit className="w-7 h-7 text-purple-400 mx-auto" />

                <h3 className="mt-4 font-semibold">
                  Intelligent
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  AI understands context, not just keywords.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* Final CTA */}
        <section className="px-6 py-24">

          <div className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-10 md:p-16">

            <BrainCircuit className="w-12 h-12 text-cyan-400 mx-auto" />

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Build your Second Brain.
            </h2>

            <p className="mt-5 text-slate-400">
              Start organizing your knowledge with OmniMind AI.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-white/10 px-6 lg:px-16 py-8">

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <BrainCircuit className="w-5 h-5 text-cyan-400" />

            <span className="font-semibold">
              OmniMind AI
            </span>

          </div>

          <p className="text-sm text-slate-500">
            © 2026 OmniMind AI. Your Second Brain.
          </p>

        </div>

      </footer>

    </div>
  );
}