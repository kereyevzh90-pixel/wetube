import { db } from "@/lib/db";
import VideoCard from "@/components/VideoCard";
import FilterChips from "@/components/FilterChips";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Все", "Игры", "Музыка", "Спорт", "Новости", "Фильмы", "Прямые эфиры", "Обучение"];

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const { q, cat } = await searchParams;

  const videos = await db.video.findMany({
    orderBy: { createdAt: "desc" },
    where: q ? {
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
      ],
    } : undefined,
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <FilterChips categories={CATEGORIES} active={cat ?? "Все"} search={q} />
      <div className="px-6 pt-6 pb-10 max-w-screen-2xl mx-auto">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
            <svg className="w-20 h-20 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15l6-4-6-4v8z"/>
            </svg>
            <p className="text-lg text-gray-400">{q ? `Ничего не найдено по "${q}"` : "Пока нет видео"}</p>
            {!q && <p className="text-sm text-gray-600">Будь первым — загрузи видео!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
            {videos.map((v: { id: string; title: string; views: number; createdAt: Date; thumbnail: string | null; filename: string; user: { id: string; name: string | null; image: string | null } }) => (
              <VideoCard
                key={v.id}
                id={v.id}
                title={v.title}
                views={v.views}
                createdAt={v.createdAt.toISOString()}
                thumbnail={v.thumbnail}
                filename={v.filename}
                user={v.user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
