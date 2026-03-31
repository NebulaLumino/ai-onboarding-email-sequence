"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setOutput(data.result || data.output || JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">Onboarding Email Sequence Generator</h1>
        <p className="text-gray-400 mb-8">Fill in the details below and click Generate</p>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-400 focus:outline-none resize-y min-h-48"
            placeholder="Product Name, Trial/Paid, Day-1 Goal, Features to Highlight, Drip Days (day 1,3,5,7)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer bg-orange-500 hover:bg-orange-600"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {error && <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded-lg">{error}</div>}
        {output && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Result</h2>
            <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{output}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
