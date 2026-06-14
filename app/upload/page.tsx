"use client";

import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Чтобы загружать видео, нужно войти</p>
        <button
          onClick={() => signIn("google")}
          className="bg-[#3d98ff] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-500 transition"
        >
          Войти через Google
        </button>
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Выбери видеофайл");
      return;
    }
    setError("");
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) { setError("Заполни название и выбери файл"); return; }

    setUploading(true);
    setError("");
    setProgress(10);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        router.push(`/watch/${data.id}`);
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          setError(err.error ?? "Ошибка загрузки");
        } catch {
          setError("Ошибка загрузки");
        }
        setUploading(false);
        setProgress(0);
      }
    };

    xhr.onerror = () => { setError("Ошибка сети"); setUploading(false); setProgress(0); };

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Загрузить видео</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition ${
            file ? "border-blue-500 bg-blue-500/10" : "border-[#3f3f3f] hover:border-gray-500"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <>
              <svg className="w-12 h-12 text-blue-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              <p className="text-gray-300 font-medium">Выбери или перетащи видео</p>
              <p className="text-gray-500 text-sm mt-1">MP4, WebM, MOV</p>
            </>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Название *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Название видео"
            className="w-full bg-[#272727] border border-[#3f3f3f] focus:border-white rounded-xl px-4 py-3 text-white outline-none transition placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Расскажи о видео..."
            className="w-full bg-[#272727] border border-[#3f3f3f] focus:border-white rounded-xl px-4 py-3 text-white outline-none transition placeholder:text-gray-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {uploading && (
          <div className="space-y-2">
            <div className="h-2 bg-[#272727] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm text-center">{progress}% загружено...</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full bg-[#ff0000] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
        >
          {uploading ? "Загружается..." : "Опубликовать"}
        </button>
      </form>
    </div>
  );
}
