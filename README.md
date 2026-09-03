# DS Lab — آزمایشگاه سیستم‌های توزیع‌شده

وب‌سایت استاتیک آزمایشگاه سیستم‌های توزیع‌شده دانشگاه علم و صنعت ایران.
تک‌صفحه‌ای (SPA)، دوزبانه (فارسی/انگلیسی)، دو تم، بدون هیچ سرور یا دیتابیس خارجی.

محتوا در فایل‌های JSON داخل همین مخزن نگه‌داری می‌شود و اعضای سازمان گیت‌هاب
می‌توانند مستقیماً از خود سایت آن را ویرایش کنند؛ هر تغییر یک کامیت روی مخزن است.

**استک:** React 19 · TypeScript · Tailwind CSS v4 · Vite 7 · react-router · i18next

---

## فهرست

1. [اجرای پروژه](#۱-اجرای-پروژه)
2. [ساختار پروژه](#۲-ساختار-پروژه)
3. [دیزاین سیستم](#۳-دیزاین-سیستم)
4. [مدل داده](#۴-مدل-داده)
5. [احراز هویت](#۵-احراز-هویت)
6. [نوشتن روی مخزن و سیاست retry](#۶-نوشتن-روی-مخزن-و-سیاست-retry)
7. [انتشار روی GitHub Pages](#۷-انتشار-روی-github-pages)
8. [چک‌لیست راه‌اندازی](#۸-چکلیست-راهاندازی)

---

## ۱. اجرای پروژه

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # خروجی در dist/
npm run preview
npm run lint
npm run typecheck
```

برای اجرای محلی با احراز هویت، `.env.example` را به `.env.local` کپی کنید.

---

## ۲. ساختار پروژه

```
.
├─ data/                       ← منبع محتوا؛ همین فایل‌ها با API گیت‌هاب ویرایش می‌شوند
│  ├─ events.json  members.json  projects.json  research.json
├─ build/data-directory.ts     ← پلاگین Vite: سرو data/ در dev و کپی آن در build
├─ public/404.html             ← fallback مسیرهای عمیق روی GitHub Pages
├─ tools/oauth-relay/          ← رله اختیاری Device Flow (Cloudflare Worker)
└─ src/
   ├─ app/                     ← ریشه‌ی برنامه: router، providerها، error boundary
   ├─ components/
   │  ├─ layout/               ← هدر، فوتر، منوی موبایل، سوییچ تم و زبان
   │  └─ ui/                   ← کتابخانه‌ی کامپوننت توکنایز‌شده
   ├─ config/site.ts           ← تنها فایل تنظیمات (org، repo، client_id، retry)
   ├─ features/
   │  ├─ admin/                ← فرم‌ها، لیست‌ها و منطق commit
   │  ├─ auth/                 ← session، خطاها، پنل‌های ورود
   │  ├─ events/ members/ projects/ research/
   ├─ i18n/                    ← پیکربندی و دیکشنری‌های fa/en
   ├─ lib/
   │  ├─ github/               ← client، contents، deviceFlow، identity، base64
   │  └─ cn · cookies · storage · format · async · viewTransition
   ├─ providers/               ← Theme · Locale · Toast · Auth · Content
   ├─ routes/                  ← صفحه‌ها
   └─ styles/                  ← tokens · base · components · animations
```

**قاعده‌ی جداسازی:** `lib` هیچ چیزی از React نمی‌داند، `features` منطق دامنه دارد،
`components/ui` بی‌طرف و بدون دانش دامنه است، و `routes` فقط ترکیب می‌کند.

---

## ۳. دیزاین سیستم

منبع واحد حقیقت `DESIGN.md` است و در `src/styles/tokens.css` پیاده شده.

- توکن‌هایی که با namespace تیلویند هم‌نام‌اند داخل `@theme static` تعریف شده‌اند،
  پس هم به‌صورت `var(--color-surface)` و هم به‌صورت utility مثل `bg-surface`,
  `text-h1`, `rounded-pill`, `ease-hover` در دسترس‌اند.
- پالت پیش‌فرض تیلویند با `--color-*: initial` حذف شده تا هیچ رنگی خارج از
  دیزاین سیستم قابل استفاده نباشد.
- تم دارک با override همان توکن‌ها زیر `html[data-theme='dark']` ساخته می‌شود؛
  یعنی هیچ کامپوننتی نیاز به شاخه‌ی دارک ندارد.
- واریانت `dark:` به همین attribute گره خورده است، نه به `prefers-color-scheme`.
- کامپوننت‌های پیچیده‌ی DESIGN.md (کارت با sheen، هدر شیشه‌ای، بج، مودال، توست)
  در `@layer components` نوشته شده‌اند و JSX فقط آن‌ها را با utilityهای چیدمان
  ترکیب می‌کند.

### انیمیشن تعویض تم و زبان

هر دو از **View Transitions API** استفاده می‌کنند (`src/lib/viewTransition.ts`):

- **تم:** پالت جدید به شکل دایره‌ای از محل خود دکمه‌ی toggle باز می‌شود.
- **زبان:** لایه‌ی قدیمی در جهت خواندنِ قبلی محو و بلور می‌شود و لایه‌ی جدید از
  سمت مقابل می‌نشیند.

در مرورگرهای بدون پشتیبانی یا با `prefers-reduced-motion: reduce` همان cross-fade
نرم توکن‌ها اجرا می‌شود.

### جلوگیری از پرش اولیه

اسکریپت کوچکی در `<head>` (فایل `index.html`) پیش از اولین رندر، تم را از
`localStorage['dslab:theme']` و زبان را از `localStorage['dslab:locale']` می‌خواند
و `data-theme` / `lang` / `dir` را ست می‌کند.

---

## ۴. مدل داده

هر فایل در `data/` یک آرایه از موجودیت است. تایپ‌ها در `src/types/content.ts`.

هر متن قابل نمایش دوزبانه است: `{ "fa": "…", "en": "…" }`.

| فایل            | موجودیت     | فیلدهای شاخص                                                                                              |
| --------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `events.json`   | رویداد      | `kind`, `startsAt`, `endsAt`, `location`, `capacity`, `speaker`, `registrationUrl`, `tags`, `featured`    |
| `members.json`  | عضو         | `degree` (faculty/phd/msc/bsc), `lead`, `avatarUrl`, `email`, `githubUsername`, `scholarUrl`, `interests` |
| `projects.json` | پروژه       | `status` (active/completed/archived), `repositoryUrl`, `demoUrl`, `memberIds`, `startedAt`                |
| `research.json` | حوزه پژوهشی | `glyph`, `tags`, `order`                                                                                  |

همه‌ی موجودیت‌ها `createdAt`، `updatedAt` و `updatedBy` دارند که به‌صورت خودکار
پر می‌شود.

**رویدادهای آینده و گذشته** با `startsAt`/`endsAt` تفکیک می‌شوند؛ اگر `endsAt`
خالی باشد پنجره‌ی دو ساعته فرض می‌شود و رویداد در بازه‌ی برگزاری بج «در حال
برگزاری» می‌گیرد (`src/features/events/eventPhase.ts`).

---

## ۵. احراز هویت

### ۵.۱ قاعده‌ی دسترسی

هر کسی می‌تواند سایت را ببیند. برای ورود:

1. توکن کاربر گرفته می‌شود.
2. `GET /user` هویت را می‌گیرد.
3. `GET /user/memberships/orgs/{org}` عضویت فعال را بررسی می‌کند
   (fallback: `GET /orgs/{org}/members/{login}`).
4. اگر کاربر عضو سازمان نباشد، **توکن دور ریخته می‌شود، هیچ نشستی ساخته نمی‌شود**
   و پیام «شما عضو سازمان … نیستید» نمایش داده می‌شود.
5. `GET /repos/{owner}/{repo}` بررسی می‌کند که توکن اجازه‌ی push دارد یا نه؛ اگر
   نداشت، پنل مدیریت هشدار می‌دهد.

نشست در کوکی `dslab:session` با `Path=/; SameSite=Strict; Secure` و انقضای
۷ روز ذخیره می‌شود. چون هاست استاتیک است `HttpOnly` ممکن نیست؛ `SameSite=Strict`
جلوی ارسال کوکی در هر درخواست cross-site را می‌گیرد. در هر بار بارگذاری سایت،
اعتبار توکن و عضویت دوباره از گیت‌هاب تأیید می‌شود.

> `localStorage` فقط برای `theme` و `locale` استفاده می‌شود، نشست همیشه در کوکی است.

### ۵.۲ ساخت GitHub OAuth App

1. به `https://github.com/organizations/DSLab-IUST/settings/applications` بروید و
   **New OAuth App** را بزنید (برای Device Flow می‌توانید OAuth App شخصی هم بسازید).
2. مقادیر:

   | فیلد                       | مقدار                                                                          |
   | -------------------------- | ------------------------------------------------------------------------------ |
   | Application name           | `DS Lab Site`                                                                  |
   | Homepage URL               | `https://dslab-iust.github.io`                                                 |
   | Authorization callback URL | `https://dslab-iust.github.io` (در Device Flow استفاده نمی‌شود ولی اجباری است) |

3. بعد از ساخت، در تنظیمات همان اپ تیک **Enable Device Flow** را بزنید. بدون این
   گزینه، `POST /login/device/code` خطای `device_flow_disabled` می‌دهد.
4. `Client ID` را بردارید. **Client Secret نسازید** — Device Flow به آن نیاز ندارد
   و در سایت استاتیک قابل نگه‌داری امن نیست.

### ۵.۳ Scopeهای لازم

```
repo       ← نوشتن روی data/*.json در مخزن
read:org   ← بررسی عضویت کاربر در سازمان
```

اگر مخزن عمومی است، `public_repo` به‌جای `repo` کافی است. برای کم‌کردن دامنه‌ی
دسترسی می‌توانید در `src/config/site.ts` مقدار `scopes` را تغییر دهید.

### ۵.۴ نکته‌ی مهم درباره‌ی CORS در Device Flow

`api.github.com` هدرهای CORS می‌فرستد، اما endpointهای OAuth روی `github.com`
**نمی‌فرستند**. بنابراین مرورگر نمی‌تواند مستقیماً `/login/device/code` و
`/login/oauth/access_token` را صدا بزند. این محدودیت سمت گیت‌هاب است و هیچ کد
کلاینتی نمی‌تواند دور بزندش.

پروژه هر دو مسیر را پشتیبانی می‌کند:

| روش                             | نیازمندی           | وضعیت                                    |
| ------------------------------- | ------------------ | ---------------------------------------- |
| **توکن Fine-grained** (پیش‌فرض) | هیچ زیرساختی       | همیشه فعال                               |
| **Device Flow**                 | یک رله‌ی کوچک CORS | فقط اگر `VITE_GITHUB_OAUTH_RELAY` ست شود |

اگر رله تنظیم نشده باشد، تب «ورود با گیت‌هاب» اصلاً نمایش داده نمی‌شود و کاربر
مستقیم به روش توکن هدایت می‌شود.

**رله‌ی آماده:** `tools/oauth-relay/worker.js` — یک Cloudflare Worker حدود ۵۰ خطی
که فقط همان دو مسیر را forward می‌کند، هیچ رازی نگه نمی‌دارد و هیچ داده‌ای ذخیره
نمی‌کند.

```bash
npx wrangler deploy tools/oauth-relay/worker.js --name dslab-oauth-relay
```

سپس در `Settings → Secrets and variables → Actions → Variables` مخزن:

```
GH_OAUTH_CLIENT_ID = Ov23li…
GH_OAUTH_RELAY     = https://dslab-oauth-relay.<subdomain>.workers.dev
```

### ۵.۵ روش توکن Fine-grained (بدون هیچ زیرساخت)

عضو سازمان از `https://github.com/settings/personal-access-tokens/new` توکن
می‌سازد با:

- **Resource owner:** `DSLab-IUST`
- **Repository access:** فقط `dslab-iust.github.io`
- **Repository permissions → Contents:** `Read and write`
- **Organization permissions → Members:** `Read-only`

توکن در فرم ورود وارد می‌شود؛ همان بررسی عضویت انجام می‌شود و همان نشست ۷ روزه
ساخته می‌شود.

---

## ۶. نوشتن روی مخزن و سیاست retry

هر ویرایش در پنل مدیریت به یک کامیت روی `main` تبدیل می‌شود
(`src/lib/github/contents.ts`).

چرخه‌ی read-modify-write:

1. `GET /repos/{owner}/{repo}/contents/data/{name}.json` → محتوا + `sha`.
2. تابع تغییر روی **آخرین** نسخه‌ی محتوا اجرا می‌شود.
3. `PUT` با همان `sha`.

اگر بین مرحله ۱ و ۳ کاربر دیگری کامیت کرده باشد، گیت‌هاب `sha` را رد می‌کند
(409/422). در این حالت به‌جای force کردن:

- کل چرخه از ابتدا تکرار می‌شود،
- تابع تغییر دوباره روی محتوای تازه اجرا می‌شود، پس تغییرِ همکار حفظ می‌شود،
- فاصله‌ی بین تلاش‌ها **exponential backoff با jitter کامل** است تا دو نفر
  هم‌زمان دوباره به هم برخورد نکنند،
- حداکثر ۵ تلاش (`siteConfig.commit`).

به همین دلیل هر عملیات به‌شکل یک **تابع خالص روی کل لیست** بیان شده
(`items => nextItems`)، نه patch مبتنی بر اندیس.

### پیام کامیت

طبق قرارداد Conventional Commits و شامل نام کاربر و عنوان مورد:

```
feat(events): add "الگوریتم‌های اجماع در سامانه‌های بزرگ‌مقیاس" (@matin)
chore(members): update "نگار احمدی" (@matin)
chore(projects): remove "TraceLab" (@matin)
```

### پیام به کاربر

پس از موفقیت، یک toast نمایش داده می‌شود:

> تغییر شما ثبت شد. انتشار روی سایت پس از پایان فرایند build و deploy
> (حدود یک تا دو دقیقه) انجام می‌شود.

به‌همراه لینک مستقیم کامیت. اگر retry لازم شده باشد، تعداد تلاش‌ها هم گزارش
می‌شود.

---

## ۷. انتشار روی GitHub Pages

`.github/workflows/deploy.yml` روی هر push به `main` اجرا می‌شود: lint → build →
`upload-pages-artifact` → `deploy-pages`. چون کامیت‌های پنل مدیریت هم روی `main`
می‌نشینند، تغییر محتوا به‌صورت خودکار منتشر می‌شود.

تنظیمات لازم در مخزن:

1. **Settings → Pages → Build and deployment → Source:** `GitHub Actions`.
2. **Settings → Actions → General → Workflow permissions:** خواندن کافی است؛
   دیپلوی از طریق OIDC انجام می‌شود.
3. متغیرهای `GH_OAUTH_CLIENT_ID` و `GH_OAUTH_RELAY` (اختیاری) را ست کنید.

نکات فنی:

- `public/.nojekyll` جلوی پردازش Jekyll را می‌گیرد.
- `public/404.html` مسیر درخواستی را در `sessionStorage` می‌گذارد و به ریشه
  برمی‌گرداند؛ `src/main.tsx` پیش از mount شدن router آن را بازیابی می‌کند. در
  نتیجه لینک عمیق، refresh و لینک اشتراکی همه درست کار می‌کنند.
- `base` برابر `/` است چون این مخزن یک User/Org Page است. برای Project Page
  مقدار `base` در `vite.config.ts` باید `'/<repo-name>/'` شود.

---

## ۸. چک‌لیست راه‌اندازی

- [ ] در `src/config/site.ts` مقادیر `repository`, `organization` و `links` را
      بررسی کنید.
- [ ] OAuth App بسازید، Device Flow را فعال کنید و `Client ID` را در متغیر
      `GH_OAUTH_CLIENT_ID` بگذارید.
- [ ] اگر Device Flow می‌خواهید، رله را دیپلوی و `GH_OAUTH_RELAY` را ست کنید؛
      در غیر این صورت اعضا از توکن Fine-grained استفاده می‌کنند.
- [ ] در Settings → Pages منبع را روی GitHub Actions بگذارید.
- [ ] فایل‌های `data/*.json` را با محتوای واقعی آزمایشگاه جایگزین کنید.
- [ ] با یک عضو سازمان و یک غیرعضو ورود را تست کنید.
- [ ] هر دو تم و هر دو زبان را روی موبایل و دسکتاپ ببینید.
