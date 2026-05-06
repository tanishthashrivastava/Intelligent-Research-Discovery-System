import { useState, useEffect, useRef } from "react";
import {
  Search,
  ExternalLink,
  Sparkles,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SearchPapers({ user }: any) {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const autoRan = useRef(false);

  // SEARCH
  const handleSearch = async (customQuery?: string) => {
    const finalQuery = customQuery || query;

    if (!finalQuery.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: finalQuery,
          email: user?.email,
          top_k: 5
        })
      });

      const data = await res.json();

      console.log("SEARCH =", data);

      const finalPapers = Array.isArray(data?.results)
        ? data.results
        : [];

      setPapers(finalPapers);

    } catch (err) {
      console.error(err);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRan.current) return;

    const homepage =
      localStorage.getItem("homepageSearch");

    const community =
      localStorage.getItem("communitySearch");

    const finalQuery = homepage || community;

    if (finalQuery) {
      autoRan.current = true;

      setQuery(finalQuery);

      localStorage.removeItem("homepageSearch");
      localStorage.removeItem("communitySearch");

      setTimeout(() => {
        handleSearch(finalQuery);
      }, 300);
    }
  }, []);

  // SAVE
  const handleSave = async (paper: any) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/save-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user?.email,
          title: paper.title,
          abstract: paper.abstract,
          link: paper.link
        })
      });

      const data = await res.json();

      alert(data.message);

      setSaved((prev) => ({
        ...prev,
        [paper.link]: true
      }));

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // SUMMARY
  const handleSummarize = async (paper: any) => {
    if (summaries[paper.link]) return;

    setSummarizing(paper.link);

    try {
      const res = await fetch("http://127.0.0.1:8000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: paper.abstract || paper.title || ""
        })
      });

      const data = await res.json();

      console.log("SUMMARY DATA =", data);

      setSummaries((prev) => ({
        ...prev,
        [paper.link]: data.summary || "No response"
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setSummarizing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* SEARCH */}
      <div className="bg-white p-3 rounded-2xl shadow border flex gap-3">
        <Search className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSearch()
          }
          placeholder="Search research papers..."
          className="flex-1 outline-none"
        />

        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading
            ? <Loader2 className="animate-spin w-4 h-4" />
            : "Search"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="space-y-6">
        {!loading && papers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No papers found
          </div>
        )}

        {papers.map((paper, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow border"
          >
            {/* title */}
            <div className="flex justify-between gap-4">
              <h3 className="font-bold text-lg">
                {paper.title}
              </h3>

              <a
                href={paper.link}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            {/* abstract */}
            <p className="mt-3 text-gray-600 text-sm">
              {paper.abstract}
            </p>

            {/* citation */}
            <div className="mt-3 text-xs bg-slate-50 p-3 rounded border text-slate-600">
              <b>Citation:</b> {paper.citation}
            </div>

            {/* buttons */}
            <div className="flex gap-5 mt-4">
              <button
                onClick={() => handleSave(paper)}
                className="text-green-600 font-semibold text-sm"
              >
                {saved[paper.link]
                  ? "Saved ✓"
                  : "Save to Library"}
              </button>

              <button
                onClick={() => handleSummarize(paper)}
                className="text-blue-600 font-semibold text-sm flex gap-1 items-center"
              >
                {summarizing === paper.link
                  ? <Loader2 className="animate-spin w-4 h-4" />
                  : <Sparkles className="w-4 h-4" />}
                AI Summary
              </button>
            </div>

            {/* summary */}
            <AnimatePresence>
              {summaries[paper.link] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-blue-50 p-4 rounded-lg text-sm whitespace-pre-line"
                >
                  {summaries[paper.link]}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 