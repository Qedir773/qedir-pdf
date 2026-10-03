# QƏDİR.pdf

Brauzerdə işləyən PDF, DOCX, OCR, səs, QR, kollaj və Gemini AI alətləri. Frontend Vite/React ilə yığılır, Cloudflare Worker isə statik faylları yayımlayır və `/inspektor` sorğularını Hostinger origin-ə ötürür.

## Tələblər

- Node.js 24 (`>=22` dəstəklənir)
- npm

## Lokal işə salma

```bash
npm ci
npm run dev
```

## Yoxlamalar

```bash
npm run lint
npm test
npm run build
npm run deploy:dry
```

## Deployment arxitekturası

| URL | Mənbə | Deploy |
| --- | --- | --- |
| `qedir.com/*` | `Qedir773/qedir-pdf` | Cloudflare Worker Builds |
| `qedir.com/inspektor/*` | `Qedir773/inspektor_qovluq/sened-sistemi` | Hostinger avtomatik deploy |
| `inspektor-origin.qedir.com` | Hostinger origin | Birbaşa istifadəçi interfeysi deyil |

`worker/inspektor.js` `/inspektor` prefiksini qoruyaraq sorğunu `https://inspektor-origin.qedir.com` ünvanına proxy edir. Digər bütün sorğular `dist` qovluğundakı statik frontend-ə gedir.

## Cloudflare konfiqurasiyası

- Production branch: `master`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Worker adı: `qedir-pdf`
- Statik fayllar: `dist`

`master` push-u GitHub-da lint, test və dry-run build yoxlamalarını işlədir. Production deploy Cloudflare-in Git inteqrasiyası vasitəsilə ayrı icra olunur.

## Hostinger konfiqurasiyası

`inspektor_qovluq` reposunun `master` branch-i Hostinger-də avtomatik deploy olunur:

- Root directory: `sened-sistemi`
- Node.js: `24.x`
- Public origin: `inspektor-origin.qedir.com`

Bu repo Hostinger-ə deploy edilmir. `/inspektor` tətbiqində dəyişiklik yalnız `inspektor_qovluq` reposunda edilməlidir.
