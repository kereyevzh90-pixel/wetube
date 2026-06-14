@AGENTS.md

# WeTube — проект

YouTube-клон на Next.js 16, задеплоен на Vercel.

## Стек
- **Next.js 16.2.9** (Turbopack, App Router)
- **Prisma 5.22** + **Neon PostgreSQL** (облачная БД)
- **Vercel Blob** — хранилище видео (не локальная папка!)
- **NextAuth v5 (beta)** — Google OAuth
- **Tailwind CSS v4**

## Продакшн
- URL: https://wetube-woad.vercel.app
- GitHub: https://github.com/kereyevzh90-pixel/wetube
- DB: Neon (подключена через Vercel Storage)
- Blob: wetube-blob (Public, IAD1)

## Деплой
```
vercel --prod --yes
```
После каждого `git push` можно деплоить этой командой.

## Важные детали
- Видео хранятся как полные blob URL в поле `Video.filename` (не относительный путь)
- `prisma migrate deploy` запускается автоматически при каждом билде
- Сайдбар скрыт по умолчанию, открывается кнопкой ☰
- После входа через Google → редирект на `/setup` (выбор: создать канал или просто смотреть)
- `channelName` в модели User — если null, пользователь "просто зритель"
- `prisma.config.ts` исключён из TypeScript (использует API Prisma 6, а установлена 5)
- `public/uploads/` в gitignore — локальные видео не коммитятся

## Env переменные (на Vercel)
- `DATABASE_URL` — Neon Postgres (добавлена автоматически)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob
- `AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Google OAuth
Authorized redirect URI в Google Console:
```
https://wetube-woad.vercel.app/api/auth/callback/google
```
