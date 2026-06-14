"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "channel">("choose");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function saveChannel() {
    if (!name.trim()) { setError("Введи название канала"); return; }
    setLoading(true);
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelName: name.trim() }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Ошибка, попробуй снова");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm text-center">
        {mode === "choose" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#272727] flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <h1 className="text-white text-xl font-semibold mb-2">Добро пожаловать!</h1>
            <p className="text-[#aaa] text-sm mb-8">Как ты хочешь использовать WeTube?</p>
            <button
              onClick={() => setMode("channel")}
              className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-semibold py-3 rounded-xl mb-3 transition"
            >
              Создать канал
            </button>
            <button
              onClick={() => { router.push("/"); router.refresh(); }}
              className="w-full bg-[#272727] hover:bg-[#3f3f3f] text-white font-semibold py-3 rounded-xl transition"
            >
              Просто смотреть
            </button>
          </>
        ) : (
          <>
            <h1 className="text-white text-xl font-semibold mb-2">Название канала</h1>
            <p className="text-[#aaa] text-sm mb-6">Это имя будет видно всем</p>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="Мой канал"
              maxLength={50}
              className="w-full bg-[#272727] border border-[#3f3f3f] focus:border-white outline-none text-white text-sm px-4 py-3 rounded-xl mb-2 placeholder:text-[#666] transition"
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button
              onClick={saveChannel}
              disabled={loading}
              className="w-full bg-[#ff0000] hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl mb-3 transition"
            >
              {loading ? "Сохраняем..." : "Создать"}
            </button>
            <button
              onClick={() => setMode("choose")}
              className="w-full bg-[#272727] hover:bg-[#3f3f3f] text-white py-3 rounded-xl transition text-sm"
            >
              Назад
            </button>
          </>
        )}
      </div>
    </div>
  );
}
