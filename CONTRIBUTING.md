# Contributing content

راهنمای فارسی: [docs/contributing.fa.md](docs/contributing.fa.md)

The live site is [dslab-iust.github.io](https://dslab-iust.github.io/). Almost all visible content comes from JSON under `data/` and photos under `assets/images/`. You do **not** need to edit React, CSS, or TypeScript to add yourself, a paper, a talk, or a research thread.

| I want to… | File to edit |
|---|---|
| Add or update a person | [`data/members.json`](data/members.json) + optional photo in `assets/images/` |
| Add or remove a research thread | [`data/current-work.json`](data/current-work.json) |
| Add or remove a publication | [`data/projects.json`](data/projects.json) |
| Add or remove a talk | [`data/presentations.json`](data/presentations.json) |

Do **not** hand-edit `data/github-stats.json` or `data/linkedin-photos.json`. CI writes those.

---

## 1. How to submit a change

Pick **GitHub in the browser** if you only need to edit JSON (and maybe upload one photo). Clone locally if you want to preview the site.

### A. Edit on GitHub (no local setup)

1. Open the file you need, for example [data/members.json](https://github.com/DSLab-IUST/dslab-iust.github.io/blob/main/data/members.json).
2. Click the pencil (**Edit this file**). If you are not a collaborator, GitHub will fork the repo for you.
3. Make the change. JSON must stay valid: no trailing commas, use double quotes, keep commas between objects.
4. To add a photo, open [Upload files](https://github.com/DSLab-IUST/dslab-iust.github.io/upload/main/assets/images) on the same branch and put the image in `assets/images/` (not in `linkedin/` or `placeholders/`).
5. Commit to a new branch and open a pull request against `main`.
6. After merge, GitHub Actions builds and deploys Pages. Your profile appears at `https://dslab-iust.github.io/people/<slug>` (see [name → URL](#name--profile-url)).

### B. Clone and preview locally

You need [Node.js 24](https://nodejs.org/) and [pnpm 11](https://pnpm.io/installation).

```bash
git clone https://github.com/DSLab-IUST/dslab-iust.github.io.git
cd dslab-iust.github.io
git checkout -b add-your-name
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit JSON, save, refresh. Vite copies `data/` and `assets/` into the app on every start.

```bash
pnpm build
pnpm preview
```

Commit, push, and open a pull request.

Use conventional commits when you can: `docs: add Matin Ghanbari to members`, `feat: add CEP presentation`, `fix: update alumni affiliation`.

---

## 2. Add yourself to People

This is the usual path for a current student or researcher.

### Step 1 — Choose where you appear

`leadership` in `data/members.json` controls the section:

| `leadership` | Section on the site | Who should use it |
|---|---|---|
| `director` | Featured director card | Lab director only |
| `lead` | Core leads | Lab-wide research leadership |
| `member` (or omit the field) | **Members** grid | Current students and researchers — **this is you** |
| `researcher` | Current-members roster | People listed that way on the official DSLab page |
| `alumni` | Alumni, grouped by `alumniGroup` | Graduates |

Current members: set `"leadership": "member"`. Do not use `director`.

### Step 2 — Insert the object in the right place

`data/members.json` is a JSON **array**. Order in the file is display order within each section.

1. Open `data/members.json`.
2. Find the last object with `"leadership": "member"` (before the alumni block).
3. Add a comma after that object, then paste your object.

Minimum example:

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

Required fields: `name`, `role`. Everything else is optional but recommended.

### Step 3 — Fill the fields

| Field | Required | What to put |
|---|---|---|
| `name` | yes | Display name. Matching in other files is case-insensitive on this string. |
| `role` | yes | Lab status, e.g. `PhD Candidate`, `Researcher`, `Master's Student`. |
| `cardFooter` | no | Short line on the card. Often the same as `role`. If omitted, `role` is used. |
| `leadership` | no | See the table above. Omit or `member` for the Members grid. |
| `degree` | no | `bsc`, `msc`, or `phd` (aliases: `bachelor`, `master`, `bachelor's`, …). Persian values `کارشناسی` / `کارشناسی ارشد` / `دکتری` also work. Shows the B.Sc / M.Sc / Ph.D badge. |
| `bio` | no | Short research bio. If empty, a public GitHub bio is used when `github` is set. |
| `focus` | no | Array of research tags shown as chips. |
| `github` | no | **Username only**, not a URL (`MatinGhanbari`, not `https://github.com/…`). Used for the GitHub icon, avatar fallback, and name matching. |
| `linkedin` | no | Full profile URL, `https://www.linkedin.com/in/…`. |
| `email` | no | Lab or academic email. |
| `scholar` | no | Google Scholar profile URL. |
| `researchgate` | no | ResearchGate profile URL. |
| `scopus` | no | Scopus author URL. |
| `dblp` | no | DBLP person URL. |
| `homepage` | no | Personal or faculty page URL. |
| `photo` | no | Repo-relative path, usually `assets/images/<slug>.jpg`. See [photos](#4-photos). |
| `aka` | no | Another published name. |
| `thesis` | no | Thesis title; shown on the card and profile. |

Do not set `linkedinPhoto` yourself. That field is filled at runtime from the LinkedIn cache (alumni only).

### Step 4 — Add a photo (recommended)

1. Name the file in kebab-case, matching your slug: `your-full-name.jpg` (see [name → URL](#name--profile-url)).
2. Put it in `assets/images/` at the repo root — not `assets/images/placeholders/` and not `assets/images/linkedin/`.
3. Set `"photo": "assets/images/your-full-name.jpg"` in your member object.
4. Prefer a square-ish portrait. `jpg`, `png`, and `webp` all work.

Without `photo`, the site uses (in order): a generated geometric placeholder, then your GitHub avatar if `github` is set. Alumni with a LinkedIn URL can get a cached LinkedIn photo automatically (see below).

After adding a member **without** a photo, generate the placeholder once:

```bash
pnpm placeholders
```

This writes `assets/images/placeholders/<slug>.svg` only if that file does not already exist. CI also runs this on every deploy, so skipping it locally is fine.

### Step 5 — Check JSON, then open a PR

- Validate JSON (VS Code / GitHub will flag errors). A single missing comma breaks the whole People section.
- Keep names unique. The profile URL is derived from `name`.
- In the PR, say who you are and which section you belong in (member / lead / alumni).

Checklist:

- [ ] Object added to `data/members.json` with valid JSON
- [ ] `leadership` is `member` (or the correct value)
- [ ] Photo committed under `assets/images/` **or** `pnpm placeholders` / CI will create one
- [ ] `github` is a login, `linkedin` / `scholar` / etc. are full URLs
- [ ] Site previewed locally, or you at least opened the JSON on GitHub and confirmed the diff

---

## 3. Update or remove a person

### Update your profile

Edit the same object in `data/members.json`. Change bio, links, `focus`, `degree`, `photo`, `role`, or `cardFooter`. Keep `name` stable if other files mention you (`current-work.json`, `projects.json`, `presentations.json`). If you must rename, update every `members` / `member` string that used the old name.

### Move from member to alumni

Do **not** delete your object. Change it:

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

| Extra alumni field | Meaning |
|---|---|
| `alumniGroup` | `phd`, `master`, or `undergraduate` — required to appear in a group. |
| `years` | Years at the lab, e.g. `2013 – 2019`. |
| `role` | Lab status after leaving (`PhD Alumnus`, `M.Sc Alumnus`, …). Current job goes in `position` + `affiliation`. |
| `position` | Current job title. |
| `affiliation` | Current workplace. |
| `location` | City / country. |
| `thesis` | Thesis title. |

Alumni LinkedIn photos: if `linkedin` is set, CI runs `pnpm linkedin-photos` and may cache a public photo under `assets/images/linkedin/`. That takes priority over local `photo` for alumni. You do not need to run this locally.

### Remove someone completely

1. Delete their object from `data/members.json` (and the comma so JSON stays valid).
2. Delete their file in `assets/images/` if it exists (leave `placeholders/` and `linkedin/` to CI).
3. Remove their name from `members` arrays in `data/current-work.json` and `data/projects.json`.
4. Remove talks that use them as `"member"` in `data/presentations.json`, or point those talks at someone else.

Prefer **alumni** over deletion so publications and history still resolve.

---

## 4. Photos

Resolution order for the avatar:

1. Alumni only: cached LinkedIn photo (from `data/linkedin-photos.json`)
2. Local `"photo"` path
3. GitHub avatar (when `github` is set and stats include that profile)
4. Generated placeholder `assets/images/placeholders/<slug>.svg`

Rules:

- Paths are repo-relative from the root: `assets/images/name.jpg`, never `/src/…` or a Windows path.
- Do not commit into `assets/images/placeholders/` unless you generated it with `pnpm placeholders`.
- Do not commit into `assets/images/linkedin/` or edit `data/linkedin-photos.json` by hand.
- Do not commit copies under `src/web/public/` — Vite copies `data/` and `assets/` at build time.

---

## 5. Add or remove other data

Names in work, papers, and talks are matched against `data/members.json` by **`name` or `github`** (trim + case-insensitive). If the string does not match, the site still renders the item but the console warns and the photo/role chips are missing.

Use the exact `name` from `members.json` (for example `"Prof. Mohsen Sharifi"`, not `"Mohsen Sharifi"`).

### Now Building — `data/current-work.json`

JSON array. Add, remove, or reorder objects. Order is display order.

```json
{
  "title": "Sample research thread",
  "status": "In progress",
  "description": "One short paragraph.",
  "tags": ["Distributed Systems", "Kernelware"],
  "members": ["Prof. Mohsen Sharifi", "Your Full Name"]
}
```

| Field | Meaning |
|---|---|
| `title` | Card heading. |
| `status` | e.g. `In progress`. Words like `published` / `done` style the badge as idle. |
| `description` | Body text. |
| `tags` | Chips. |
| `members` | Names or GitHub logins that exist in `members.json`. |

To remove a thread, delete that object from the array (watch commas).

### Publications — `data/projects.json`

JSON array. Same shape as current work, plus `type` and `links`.

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

`icon` is optional (`external-link` is the usual value). To remove a paper, delete its object.

### Presentations — `data/presentations.json`

This file is an **object** with a `presentations` array (not a top-level array). Card numbers are the array index.

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

| Field | Meaning |
|---|---|
| `member` | Must match `name` or `github` in `members.json`. Photo and role are reused. |
| `title` | Talk title. |
| `date` / `time` | Free-text, shown as-is. |
| `location` | Room or `DSLab IUST / Online`. |
| `link` | Meet/Zoom URL. Leave empty (`""` or omit) to show “Meet link soon”. |
| `linkLabel` | Button label; default is “Join on Meet”. |
| `series` | Small label, e.g. `NEXT WEEK`. |

To clear the list, set `"presentations": []`. The empty state on the site includes an “Edit on GitHub” link to this file.

---

## Name → profile URL

`name` is turned into a slug:

1. Strip a leading `Prof.` / `Dr.` / `Professor`
2. Lowercase
3. Non-alphanumeric runs become `-`

Examples: `Matin Ghanbari` → `/people/matin-ghanbari`, `Prof. Mohsen Sharifi` → `/people/mohsen-sharifi`.

Keep names unique. Changing `name` changes the public URL.

---

## Commands (optional)

| Command | When |
|---|---|
| `pnpm install` | First clone |
| `pnpm dev` | Preview while editing JSON/photos |
| `pnpm build` / `pnpm preview` | Production check |
| `pnpm placeholders` | New members without `photo` |
| `pnpm linkedin-photos` | Alumni LinkedIn cache (CI already runs this) |
| `pnpm stats` | Refresh public GitHub org stats (CI already runs this) |

---

## What not to change for content PRs

- `src/web/` UI code, unless you are fixing a site bug
- `data/github-stats.json`, `data/linkedin-photos.json`
- `src/web/public/` (generated copy of `data/` + `assets/`)
- Lab-wide copy in `src/web/src/config.ts` (`LAB`, `RESEARCH`) unless you mean to change the lab description itself

Questions: open an issue or a draft PR on [DSLab-IUST/dslab-iust.github.io](https://github.com/DSLab-IUST/dslab-iust.github.io).
