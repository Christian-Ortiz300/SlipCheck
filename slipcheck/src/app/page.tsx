"use client";

import { useState } from "react";

export default function Home() {
  const [slipText, setSlipText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onCheck() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slipText }),
    });

    setResult(await res.json());
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">SlipCheck (MVP)</h1>

      <textarea
        className="w-full h-48 p-3 rounded border"
        placeholder="Paste your slip text here..."
        value={slipText}
        onChange={(e) => setSlipText(e.target.value)}
      />

      <button
        onClick={onCheck}
        disabled={loading || slipText.trim().length === 0}
        className="px-4 py-2 rounded border hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Slip"}
      </button>

      {result && (
        <pre className="p-3 rounded border overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
