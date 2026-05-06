import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Github
} from 'lucide-react';
import { User } from '../types';

export default function Home({ user }: { user: User | null }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;

    localStorage.setItem("homepageSearch", query);

    if (user) {
      navigate("/dashboard/search");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-5 h-5" /> 
              </div>

              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ILR System
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/about"
                className="text-base font-medium text-slate-600 hover:text-blue-600 transition-colors" 
              >
                About
              </Link>

              {user ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-5 py-2 mb-7 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
              AI-Powered Research Assistant
            </span>

            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Intelligent Literature <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Review System
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
              Accelerate your research with semantic search, automated summarization,
              and AI-driven gap detection. The ultimate tool for modern researchers.
            </p>

            {/* SEARCH BAR */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search papers like: Machine Learning in Healthcare..."
                  className="flex-1 px-7 py-6 outline-none text-lg text-slate-700"
                />

                <button
                  onClick={handleSearch}
                  className="px-10 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-lg"
                >
                  Explore Research
                </button>
              </div>

              {!user && (
                <p className="text-base text-slate-500 mt-3">
                  Search starts here — login required for full analysis.
                </p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="px-10 py-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-lg"
              >
                Start Researching <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["10K+", "Papers Indexed"],
              ["2K+", "AI Summaries"],
              ["500+", "Research Gaps Found"],
              ["24/7", "AI Assistant"],
            ].map(([num, label], i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
              >
                <div className="text-4xl font-bold text-blue-600">
                  {num}
                </div>

                <div className="text-base text-slate-500 mt-3">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Semantic Search",
                desc: "Search across millions of papers from arXiv, Semantic Scholar, and more with AI-powered relevance."
              },
              {
                icon: BarChart3,
                title: "Gap Detection",
                desc: "Automatically identify unexplored research areas and potential future directions in your field."
              },
              {
                icon: MessageSquare,
                title: "AI Assistant",
                desc: "Chat with your research papers. Ask for summaries, explanations, or related citations."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="text-blue-600 w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>

            <span className="font-bold text-slate-900">
              ILR System
            </span>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 Intelligent Literature Review System. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-slate-400 hover:text-slate-600"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 