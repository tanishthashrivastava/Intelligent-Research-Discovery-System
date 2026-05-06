import { useState, useEffect } from "react";
import { Upload, Loader2, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";

export default function UploadPapers({ user }: { user: User }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  // FETCH PAPERS
  const fetchPapers = async () => {
    try {
      const res = await fetch("http://localhost:8000/papers");
      const data = await res.json();

      // duplicate remove
      const unique = Array.isArray(data.papers)
        ? data.papers.filter(
            (v: any, i: number, a: any[]) =>
              a.findIndex((t) => t.filename === v.filename) === i
          )
        : [];

      setUploadedFiles(unique);
    } catch (err) {
      console.error(err);
      setUploadedFiles([]);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // FILE SELECT
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // UPLOAD
  const handleUpload = async () => {
    if (!files.length) {
      alert("Select file first");
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
      }

      setSuccess(true);
      setFiles([]);
      fetchPapers();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setUploading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  // SUMMARIZE
  const handleSummarize = async (filename: string) => {
  try {
    setLoadingSummary(true);
    setSummary("");

    const res = await fetch(
      `http://localhost:8000/summarize/${encodeURIComponent(filename)}`
    );

    const data = await res.json();

    console.log("SUMMARY =", data);

    setSummary(data.summary || "No summary generated");
  } catch (err) {
    console.error(err);
    alert("Summary failed");
  }

  setLoadingSummary(false);
};

  // ASK AI
  const handleAsk = async () => {
    if (!askQuestion.trim()) return;

    try {
      setAsking(true);
      setAskAnswer("");

      const combinedText = uploadedFiles
        .map((p) => p.content)
        .join("\n\n")
        .slice(0, 12000);

      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          question: `
You are a research assistant.

Read the paper content below and answer ONLY the user's question.

Rules:
- give direct answer only
- do NOT repeat paper text
- do NOT paste document content
- concise answer
- if user asks 50 words -> around 50 words
- professional academic tone

Paper:
${combinedText}

Question:
${askQuestion}
`,
        }),
      });

      const data = await res.json();

      setAskAnswer(data.answer || "No answer");
    } catch (err) {
      console.error(err);
      alert("Ask AI failed");
    }

    setAsking(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Upload Research Papers</h2>
        <p className="text-slate-500 mt-2">
          Upload PDFs or ZIP folders to analyze with AI
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div
        className="border-2 border-dashed rounded-3xl p-12 text-center bg-white cursor-pointer"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.zip"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Upload className="text-blue-600 w-8 h-8" />
        </div>

        <h3 className="font-bold text-lg">Click or drag to upload</h3>
        <p className="text-slate-500">Supports PDF / ZIP</p>
      </div>

      {/* SELECTED */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl border p-5">
          {files.map((file, i) => (
            <div key={i} className="flex justify-between py-2">
              <span>{file.name}</span>
              <button onClick={() => removeFile(i)}>Remove</button>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl"
          >
            {uploading ? "Uploading..." : "Start Analysis"}
          </button>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
          Upload successful
        </div>
      )}

      {/* PAPERS */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-bold mb-4">Uploaded Papers</h3>

          {uploadedFiles.map((paper) => (
            <div
              key={paper.id}
              className="flex justify-between items-center py-3 border-b"
            >
              <span className="text-blue-600">{paper.filename}</span>

              <button
                onClick={() => handleSummarize(paper.filename)}
                className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
              >
                Summarize
              </button>
            </div> 
          ))} 
        </div>
      )}

      {/* SUMMARY */}
      {(loadingSummary || summary) && (
        <div className="bg-blue-50 border rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">AI Summary</h3>

          {loadingSummary ? (
            <div className="flex gap-2 text-blue-600">
              <Loader2 className="animate-spin w-4 h-4" />
              Generating...
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{summary}</p>
          )}
        </div>
      )}

      {/* ASK AI */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Ask AI about uploaded papers
          </h3>

          <div className="flex gap-3">
            <input
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder="Ask anything from uploaded paper..."
              className="flex-1 border rounded-xl px-4 py-3 outline-none"
            />

            <button
              onClick={handleAsk}
              className="bg-blue-600 text-white px-5 rounded-xl"
            >
              {asking ? <Loader2 className="animate-spin w-4 h-4" /> : <Send />}
            </button>
          </div>

          {askAnswer && (
            <div className="mt-5 bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-sm">
              {askAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
