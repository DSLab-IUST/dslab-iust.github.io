# راهنمای افزودن محتوا

سایت زنده: [dslab-iust.github.io](https://dslab-iust.github.io/). تقریباً همهٔ محتوای قابل‌مشاهده از JSON داخل `data/` و عکس‌های `assets/images/` می‌آید. برای اضافه کردن خودتان، مقاله، ارائه یا موضوع پژوهشی **نیازی به ویرایش React یا CSS نیست**.

نسخهٔ انگلیسی همین راهنما: [CONTRIBUTING.md](../CONTRIBUTING.md)

| می‌خواهم… | فایل |
|---|---|
| خودم را اضافه یا پروفایلم را به‌روز کنم | [`data/members.json`](../data/members.json) + در صورت تمایل عکس در `assets/images/` |
| موضوع پژوهشی اضافه یا حذف کنم | [`data/current-work.json`](../data/current-work.json) |
| مقاله اضافه یا حذف کنم | [`data/projects.json`](../data/projects.json) |
| ارائه اضافه یا حذف کنم | [`data/presentations.json`](../data/presentations.json) |

`data/github-stats.json` و `data/linkedin-photos.json` را دستی ویرایش نکنید؛ CI آن‌ها را می‌نویسد.

---

## ۱. ارسال تغییر

اگر فقط JSON (و شاید یک عکس) لازم دارید، **از ویرایشگر گیت‌هاب در مرورگر** استفاده کنید. اگر می‌خواهید سایت را پیش‌نمایش کنید، ریپو را کلون کنید.

### الف) ویرایش در گیت‌هاب (بدون نصب)

1. فایل مورد نظر را باز کنید؛ مثلاً [data/members.json](https://github.com/DSLab-IUST/dslab-iust.github.io/blob/main/data/members.json).
2. روی آیکون مداد (**Edit this file**) کلیک کنید. اگر همکار ریپو نیستید، گیت‌هاب فورک می‌سازد.
3. تغییر را اعمال کنید. JSON باید معتبر بماند: بدون ویرگول انتهایی، با دابل‌کوت، ویرگول بین آبجکت‌ها.
4. برای عکس، از [Upload files](https://github.com/DSLab-IUST/dslab-iust.github.io/upload/main/assets/images) روی همان برنچ فایل را در `assets/images/` بگذارید (نه داخل `linkedin/` یا `placeholders/`).
5. روی یک برنچ جدید commit کنید و pull request به `main` باز کنید.
6. بعد از merge، Actions سایت را دیپلوی می‌کند. پروفایل شما در `https://dslab-iust.github.io/people/<slug>` دیده می‌شود.

### ب) کلون و پیش‌نمایش محلی

[Node.js 24](https://nodejs.org/) و [pnpm 11](https://pnpm.io/installation) لازم است.

```bash
git clone https://github.com/DSLab-IUST/dslab-iust.github.io.git
cd dslab-iust.github.io
git checkout -b add-your-name
pnpm install
pnpm dev
```

آدرس Vite (معمولاً `http://localhost:5173`) را باز کنید. JSON را ذخیره کنید و صفحه را رفرش کنید.

```bash
pnpm build
pnpm preview
```

سپس push کنید و pull request باز کنید.

---

## ۲. اضافه کردن خودتان به People

مسیر معمول برای دانشجوی فعلی یا پژوهشگر.

### مرحله ۱ — انتخاب بخش

فیلد `leadership` در `data/members.json` مشخص می‌کند کجا دیده می‌شوید:

| `leadership` | بخش سایت | چه کسی |
|---|---|---|
| `director` | کارت مدیر آزمایشگاه | فقط مدیر آزمایشگاه |
| `lead` | Core leads | راهبری پژوهشی آزمایشگاه |
| `member` (یا حذف فیلد) | گرید **Members** | دانشجویان و پژوهشگران فعلی — **شما** |
| `researcher` | فهرست current members | مطابق صفحهٔ رسمی DSLab |
| `alumni` | Alumni، گروه‌بندی با `alumniGroup` | فارغ‌التحصیلان |

اعضای فعلی: `"leadership": "member"`. از `director` استفاده نکنید.

### مرحله ۲ — گذاشتن آبجکت در جای درست

`data/members.json` یک **آرایه** است. ترتیب فایل، ترتیب نمایش داخل هر بخش است.

1. فایل را باز کنید.
2. آخرین آبجکت با `"leadership": "member"` را پیدا کنید (قبل از بلوک alumni).
3. بعد از آن ویرگول بگذارید و آبجکت خود را بچسبانید.

حداقل نمونه:

```json
{
  "name": "Your Full Name",
  "role": "Researcher",
  "cardFooter": "Researcher",
  "leadership": "member",
  "github": "YourGitHubLogin",
  "linkedin": "https://www.linkedin.com/in/your-slug/",
  "photo": "assets/images/your-full-name.jpg",
  "bio": "One or two sentences about your research at DSLab.",
  "degree": "msc",
  "focus": ["Distributed Systems"]
}
```

الزامی: `name` و `role`. بقیه اختیاری ولی توصیه‌شده است. محتوا را انگلیسی بنویسید تا با بقیهٔ سایت هم‌خوان باشد.

### مرحله ۳ — فیلدها

| فیلد | الزامی | مقدار |
|---|---|---|
| `name` | بله | نام نمایشی. تطبیق در فایل‌های دیگر روی همین رشته (بدون حساسیت به حروف) است. |
| `role` | بله | وضعیت در آزمایشگاه، مثلاً `PhD Candidate` یا `Researcher`. |
| `cardFooter` | خیر | خط کوتاه روی کارت. اگر نباشد، `role` استفاده می‌شود. |
| `leadership` | خیر | جدول بالا. برای Members گرید: `member` یا حذف فیلد. |
| `degree` | خیر | `bsc` / `msc` / `phd` (یا `bachelor` / `master`). مقادیر فارسی `کارشناسی` / `کارشناسی ارشد` / `دکتری` هم کار می‌کنند. بج درجه را نشان می‌دهد. |
| `bio` | خیر | بیوی کوتاه. اگر خالی باشد و `github` داشته باشید، بیوی گیت‌هاب می‌آید. |
| `focus` | خیر | آرایهٔ تگ‌های پژوهشی. |
| `github` | خیر | **فقط یوزرنیم**، نه URL. |
| `linkedin` | خیر | URL کامل پروفایل. |
| `email` | خیر | ایمیل دانشگاهی. |
| `scholar` | خیر | URL گوگل اسکالر. |
| `researchgate` / `scopus` / `dblp` | خیر | URL کامل. |
| `homepage` | خیر | صفحهٔ شخصی یا هیئت علمی. |
| `photo` | خیر | مسیر نسبت به ریشهٔ ریپو: `assets/images/<slug>.jpg`. |
| `aka` | خیر | نام دیگری که با آن منتشر کرده‌اید. |
| `thesis` | خیر | عنوان پایان‌نامه. |

`linkedinPhoto` را خودتان نگذارید؛ در زمان اجرا برای alumni از کش پر می‌شود.

### مرحله ۴ — عکس (توصیه می‌شود)

1. نام فایل kebab-case و مطابق اسلاگ: `your-full-name.jpg`.
2. در `assets/images/` ریشهٔ ریپو بگذارید — نه `placeholders/` و نه `linkedin/`.
3. در آبجکت `"photo": "assets/images/your-full-name.jpg"` را بگذارید.
4. پرترهٔ تقریباً مربعی؛ `jpg` / `png` / `webp`.

بدون `photo`، سایت به‌ترتیب از placeholder هندسی و بعد آواتار گیت‌هاب استفاده می‌کند. فارغ‌التحصیلان با LinkedIn ممکن است عکس کش‌شده بگیرند.

اگر عضو **بدون عکس** اضافه کردید:

```bash
pnpm placeholders
```

فقط اگر فایل `assets/images/placeholders/<slug>.svg` وجود نداشته باشد ساخته می‌شود. CI هم همین را اجرا می‌کند؛ رد کردن محلی اشکالی ندارد.

### مرحله ۵ — اعتبارسنجی JSON و PR

- JSON نامعتبر (ویرگول جاافتاده) کل بخش People را می‌شکند.
- `name` باید یکتا باشد؛ URL پروفایل از آن ساخته می‌شود.
- در PR بنویسید کی هستید و در کدام بخش (member / lead / alumni).

چک‌لیست:

- [ ] آبجکت در `data/members.json` با JSON معتبر
- [ ] `leadership` برابر `member` (یا مقدار درست)
- [ ] عکس در `assets/images/` **یا** placeholder توسط CI
- [ ] `github` یوزرنیم است؛ بقیهٔ لینک‌ها URL کامل‌اند
- [ ] پیش‌نمایش محلی، یا حداقل diff روی گیت‌هاب بررسی شده

---

## ۳. به‌روزرسانی یا حذف فرد

### به‌روزرسانی پروفایل

همان آبجکت را در `data/members.json` ویرایش کنید. اگر `name` را عوض می‌کنید، تمام ارجاع‌ها در `current-work.json`، `projects.json` و `presentations.json` را هم عوض کنید.

### تبدیل عضو به alumni

آبجکت را **حذف نکنید**. تغییرش دهید:

```json
{
  "name": "Your Full Name",
  "role": "M.Sc Alumnus",
  "cardFooter": "2023 – 2026",
  "leadership": "alumni",
  "alumniGroup": "master",
  "years": "2023 – 2026",
  "degree": "msc",
  "bio": "Master's alumnus of DSLab CE-IUST. Now …",
  "focus": ["Distributed Systems"],
  "position": "Your job title",
  "affiliation": "Company or university",
  "location": "City, Country",
  "linkedin": "https://www.linkedin.com/in/your-slug/",
  "github": "YourGitHubLogin"
}
```

| فیلد alumni | معنی |
|---|---|
| `alumniGroup` | `phd` یا `master` یا `undergraduate` — بدون آن در هیچ گروهی دیده نمی‌شوید. |
| `years` | سال‌های حضور، مثلاً `2013 – 2019`. |
| `role` | وضعیت بعد از خروج. شغل فعلی در `position` + `affiliation`. |
| `position` / `affiliation` / `location` | عنوان شغلی، محل کار، شهر. |
| `thesis` | عنوان پایان‌نامه. |

عکس LinkedIn فارغ‌التحصیلان را CI با `pnpm linkedin-photos` کش می‌کند؛ لازم نیست محلی اجرا کنید.

### حذف کامل

1. آبجکت را از `data/members.json` حذف کنید (ویرگول‌ها را درست کنید).
2. فایل عکس اختصاصی در `assets/images/` را حذف کنید (`placeholders/` و `linkedin/` را به CI بسپارید).
3. نام را از آرایه‌های `members` در `current-work.json` و `projects.json` بردارید.
4. ارائه‌هایی که `"member"` آن‌ها این فرد است را حذف یا به فرد دیگری وصل کنید.

ترجیح: alumni به‌جای حذف، تا مقاله‌ها و تاریخچه resolve بمانند.

---

## ۴. عکس‌ها

ترتیب آواتار:

1. فقط alumni: عکس کش‌شدهٔ LinkedIn
2. مسیر `"photo"` محلی
3. آواتار گیت‌هاب (اگر `github` ست شده باشد)
4. placeholder در `assets/images/placeholders/<slug>.svg`

مسیرها نسبت به ریشهٔ ریپو هستند: `assets/images/name.jpg`. داخل `src/web/public/` چیزی commit نکنید؛ Vite در بیلد کپی می‌کند.

---

## ۵. بقیهٔ داده

نام‌ها در کار جاری، مقاله و ارائه با `name` یا `github` در `members.json` تطبیق داده می‌شوند (بدون حساسیت به حروف). اگر جور نباشد، آیتم نمایش داده می‌شود ولی عکس و نقش نمی‌آید.

از همان رشتهٔ `name` استفاده کنید؛ مثلاً `"Prof. Mohsen Sharifi"` نه `"Mohsen Sharifi"`.

### Now Building — `data/current-work.json`

آرایهٔ JSON. ترتیب = ترتیب نمایش.

```json
{
  "title": "Sample research thread",
  "status": "In progress",
  "description": "One short paragraph.",
  "tags": ["Distributed Systems", "Kernelware"],
  "members": ["Prof. Mohsen Sharifi", "Your Full Name"]
}
```

برای حذف یک موضوع، آن آبجکت را از آرایه بردارید.

### انتشارات — `data/projects.json`

همان شکل، به‌علاوهٔ `type` و `links`.

```json
{
  "title": "Paper title",
  "type": "Journal paper",
  "status": "Published",
  "description": "Venue, year, and one-line summary.",
  "tags": ["High Performance Computing"],
  "members": ["Prof. Mohsen Sharifi", "Your Full Name"],
  "links": [
    { "url": "https://doi.org/10.1000/example", "label": "DOI", "icon": "external-link" }
  ]
}
```

### ارائه‌ها — `data/presentations.json`

این فایل یک **آبجکت** با آرایهٔ `presentations` است (آرایهٔ سطح‌بالا نیست).

```json
{
  "presentations": [
    {
      "member": "Your Full Name",
      "title": "Talk title",
      "date": "Monday, 7 September",
      "time": "10:00",
      "location": "DSLab IUST / Online",
      "link": "https://meet.google.com/your-code",
      "linkLabel": "Join presentation",
      "series": "NEXT WEEK"
    }
  ]
}
```

`member` باید با `name` یا `github` در `members.json` یکی باشد. `link` خالی = «Meet link soon». برای خالی کردن لیست: `"presentations": []`.

---

## نام → آدرس پروفایل

از `name` اسلاگ ساخته می‌شود: پیشوند `Prof.` / `Dr.` / `Professor` حذف، حروف کوچک، بقیهٔ غیرحرفی تبدیل به `-`.

مثال: `Matin Ghanbari` → `/people/matin-ghanbari`

---

## دستورها

| دستور | زمان |
|---|---|
| `pnpm install` | اولین کلون |
| `pnpm dev` | پیش‌نمایش هنگام ویرایش |
| `pnpm build` / `pnpm preview` | چک پروداکشن |
| `pnpm placeholders` | عضو جدید بدون `photo` |
| `pnpm linkedin-photos` | کش LinkedIn فارغ‌التحصیلان (CI هم اجرا می‌کند) |
| `pnpm stats` | آمار گیت‌هاب ارگ (CI هم اجرا می‌کند) |

برای PR محتوا معمولاً `src/web/`، فایل‌های generated و `src/web/public/` را تغییر ندهید.
