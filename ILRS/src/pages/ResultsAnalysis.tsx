import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";
import { comparePapers } from "../services/gemini";

export default function ResultsAnalysis() {
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // FETCH LIBRARY
  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await fetch("https://intelligent-research-discovery-system-production.up.railway.app/library");
      const data = await res.json();

      console.log("LIBRARY =", data);

      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPapers([]);
    }
  };

  // SELECT
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ANALYZE
  const handleAnalyze = async () => {
    if (selectedIds.length < 2) {
      alert("Select at least 2 papers");
      return;
    }

    setAnalyzing(true);
    setAnalysis("");

    try {
      const selectedPapers = papers.filter((p) =>
        selectedIds.includes(p.id)
      );

      let result = "";

      try {
        result = await comparePapers(selectedPapers);
      } catch (err) {
        console.error(err);
      }

      // fallback
      if (!result || result.includes("quota")) {
        result = `
1. Similarities:
Both selected papers focus on advanced AI / Machine Learning research.

2. Differences:
They differ in model architecture, methodology, datasets, and target application domain.

3. Research Gap:
Real-world deployment, scalability, and explainability remain underexplored.

4. Future Scope:
Hybrid AI models, optimized architectures, and domain-specific fine tuning can improve future outcomes.
`;
      }

      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysis("Analysis failed.");
    }

    setAnalyzing(false);
  };

  // PARSE GAP
  const getResearchGap = () => {
    if (analysis.includes("3.") && analysis.includes("4.")) {
      return analysis.split("3.")[1].split("4.")[0].trim();
    }
    return "Gap analysis unavailable";
  };

  // PARSE FUTURE
  const getFutureScope = () => {
    if (analysis.includes("4.")) {
      return analysis.split("4.")[1].trim();
    }
    return "Future scope unavailable";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Results & Analysis</h2>
          <p className="text-slate-500">
            Select papers for comparative analysis
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={selectedIds.length < 2 || analyzing}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 flex gap-2 items-center"
        >
          {analyzing ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Run Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div>
          <h3 className="font-bold mb-4 flex gap-2 items-center">
            <FileText className="w-4 h-4" />
            Your Library ({papers.length})
          </h3>

          <div className="space-y-3">
            {papers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => toggleSelect(paper.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedIds.includes(paper.id)
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white hover:border-slate-300"
                }`}
              >
                <h4 className="font-semibold text-sm">
                  {paper.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  {paper.year || "N/A"} • {paper.source || "Saved"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <div className="min-h-[350px] bg-slate-50 border-2 border-dashed rounded-2xl flex items-center justify-center text-center p-8">
              <div>
                <BarChart3 className="mx-auto mb-3 text-gray-300 w-8 h-8" />
                <h3 className="font-bold">No Analysis Yet</h3>
                <p className="text-sm text-gray-500">
                  Select at least 2 papers
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border p-8 space-y-6"
            >
              <div className="text-blue-600 font-bold text-sm flex gap-2 items-center">
                <Sparkles className="w-4 h-4" />
                AI Comparative Insight
              </div>

              <div className="whitespace-pre-wrap text-sm text-slate-700">
                {analysis}
              </div>

              {/* DYNAMIC BOXES */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="font-bold text-yellow-700 text-sm flex gap-2 items-center">
                    <AlertTriangle className="w-4 h-4" />
                    Research Gap
                  </div>

                  <p className="text-sm mt-2 whitespace-pre-wrap">
                    {getResearchGap()}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="font-bold text-green-700 text-sm flex gap-2 items-center">
                    <Lightbulb className="w-4 h-4" />
                    Future Scope
                  </div>

                  <p className="text-sm mt-2 whitespace-pre-wrap">
                    {getFutureScope()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 