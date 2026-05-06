import { motion } from "motion/react";
import {
  Brain,
  Search,
  FileText,
  BarChart3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Search,
      title: "Semantic Paper Search",
      desc: "Search research papers intelligently using embeddings and AI-powered relevance ranking.",
    },
    {
      icon: FileText,
      title: "Automated Summarization",
      desc: "Generate concise summaries from uploaded papers and lengthy research documents instantly.",
    },
    {
      icon: BarChart3,
      title: "Gap Detection",
      desc: "Identify unexplored research opportunities and detect future scope in academic domains.",
    },
    {
      icon: Brain,
      title: "AI Research Assistant",
      desc: "Ask research-related questions and get contextual intelligent responses in seconds.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase">
              About ILR System
            </span>

            <h1 className="text-5xl font-bold text-slate-900 mt-6 leading-tight">
              Smarter Literature Reviews with{" "}
              <span className="text-blue-600">
                Artificial Intelligence
              </span>
            </h1>

            <p className="text-lg text-slate-600 mt-6 leading-relaxed">
              Intelligent Literature Review System is an AI-powered research
              platform designed to simplify paper discovery, automate
              summarization, detect research gaps, and help researchers make
              faster academic decisions with confidence.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "AI-driven semantic search",
                "Automated paper summarization",
                "Research gap identification",
                "Interactive AI research assistant",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop"
              alt="AI Research"
              className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />

            <div className="absolute bottom-6 left-6 bg-white p-5 rounded-2xl shadow-xl w-[260px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Sparkles className="text-blue-600" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    AI Powered
                  </p>
                  <p className="text-sm text-slate-500">
                    Research Intelligence
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECOND IMAGE SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid md:grid-cols-2 gap-8">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
            alt="Research Collaboration"
            className="rounded-3xl h-[280px] w-full object-cover shadow-lg"
          />

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Built for Modern Researchers
            </h2>

            <p className="text-slate-600 leading-relaxed">
              From searching academic papers to understanding insights,
              comparing findings, and discovering unexplored opportunities —
              ILR System helps researchers reduce manual effort and improve
              productivity using AI.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900">
            Core Features
          </h2>

          <p className="text-slate-500 mt-3">
            Everything needed for smart academic research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <item.icon className="text-blue-600 w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
} 