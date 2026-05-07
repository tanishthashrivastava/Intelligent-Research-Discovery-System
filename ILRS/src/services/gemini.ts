export async function summarizePaper(text: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    return data.summary || "Summary unavailable";

  } catch (err) {
    console.error(err);
    return "Summary failed";
  }
}

export async function comparePapers(papers: any[]) {
  try {
    const text = papers
      .map(
        (p) =>
          `TITLE: ${p.title}\nABSTRACT: ${p.abstract}`
      )
      .join("\n\n====================\n\n");

    const res = await fetch("http://localhost:8000/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    const data = await res.json();

    return data.analysis || "Comparison unavailable";
  } catch (err) {
    console.error(err);
    return "Comparison unavailable";
  }
}  

export async function askAssistant(
  question: string,
  email: string
) {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/ask",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          question,
        }),
      }
    );

    const data = await res.json();

    return data.answer || "No answer";
  } catch {
    return "AI server error";
  }
} 