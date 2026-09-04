<div align="center">

# DSLab IUST

### Distributed Systems Lab — Iran University of Science and Technology

**School of Computer Engineering · Directed by Prof. Mohsen Sharifi**

Researching distributed operating systems, high-performance computing, and cloud system software.

<br>

[![Site](https://img.shields.io/badge/Site-dslab--iust.github.io-111827?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://dslab-iust.github.io/)
![React](https://img.shields.io/badge/React-111827?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-111827?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Vite](https://img.shields.io/badge/Vite-111827?style=for-the-badge&logo=vite&logoColor=646CFF)
![Turborepo](https://img.shields.io/badge/Turborepo-111827?style=for-the-badge&logo=turborepo&logoColor=EF4444)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-111827?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-111827?style=for-the-badge&logo=githubactions&logoColor=2088FF)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-111827?style=for-the-badge&logo=github&logoColor=FFFFFF)

</div>

---

## About DSLab IUST

**DSLab IUST — Distributed Systems Lab** at the School of Computer Engineering, Iran University of Science and Technology, has been directed by **Prof. Mohsen Sharifi** since 2002. The lab studies challenges in distributed computing and systems, wireless sensor (actor) networks, cloud computing environments, and computer security and web engineering — with special focus on distributed operating systems and high-performance computing.

The long-term aim is the know-how and technology of engineering a truly distributed operating system: a kernelware that can support heterogeneous platforms.

> Next Generation Operating Systems will be Aware and Distributed by Nature at the Kernel Level…

### Research areas

Six connected problem spaces, as shown on the site:

| Code | Area |
|---|---|
| `HPC` | High Performance Computing — performability across application, compiler, runtime, OS, network and hardware, including ExaScale middleware |
| `DIST` | Distributed Systems and Computing — distributed OS, virtualization, peer-to-peer, ubiquitous and autonomic computing |
| `CLOUD` | Cloud Computing Environments — VM scheduling, virtual clusters, and resource management at the VMM |
| `CEP` | Complex Event Processing — distributing CEP so high-rate streams can scale beyond a single engine |
| `WSAN` | Wireless Sensor (Actor) Networks — coordination, QoS, fault-tolerance and real-time task assignment |
| `SEC` | Computer Security and Web Engineering — information security and systematic engineering of web-based systems |

---

## Website

The official site is a React 19 + TypeScript app in `src/web`, built with Vite, Turborepo and Tailwind CSS v4. Content is JSON at the repository root; photos live in `assets/`. Both are copied into the web app during `dev` and `build`.

Live: [dslab-iust.github.io](https://dslab-iust.github.io/)

### Page structure

1. **Hero** — lab mission, topology graph, and a stats ribbon (commits, project count, Research Coffee Meter, last GitHub snapshot). Dark / light theme is available from the header.
2. **Research** — the six problem spaces above.
3. **People** — Lab Director, Core Leads, members, a current-member roster, and alumni (PhD, master’s, undergraduate). Cards and roster rows open a profile modal.
4. **Now Building** — active research threads from `data/current-work.json`.
5. **Presentations** — upcoming talks from `data/presentations.json` (empty until talks are scheduled).
6. **Publications** — selected journal and conference papers from `data/projects.json`.
7. **Mission** — kernelware manifesto and lab quote.

Degree badges (`B.Sc` / `M.Sc` / `Ph.D`) appear on member cards. Member names in current work, publications and presentations are matched against `data/members.json` (by `name` or `github`) so photos, roles and focus tags are reused.

### Repository layout

```text
.
├── data/                      # JSON content (source of truth)
│   ├── members.json
│   ├── current-work.json
│   ├── presentations.json
│   ├── projects.json
│   └── github-stats.json      # generated; do not hand-edit in normal use
├── assets/                    # member photos and favicon
├── src/web/                   # Vite + React app (@dslab/web)
├── scripts/update-github-stats.mjs
├── design/                    # visual language (tokens + design skill)
└── .github/workflows/pages.yml
```

### Local development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm preview
```

Refresh GitHub stats locally (requires `GITHUB_ORG` and `DSLAB_GITHUB_TOKEN`):

```bash
pnpm stats
```

The workspace is `src/*` (`pnpm-workspace.yaml`). CI builds with Node 24 and pnpm 11, then deploys `src/web/dist` to GitHub Pages.

---

## Member & project data

Edit the JSON under `data/`. Vite copies it into `src/web/public/` on every dev server start and production build.

```text
data/
├── members.json        # People, roles, photos, links, degree, leadership, research focus
├── current-work.json   # Active research threads (Now Building)
├── presentations.json  # Upcoming talks; empty object list when none are scheduled
├── projects.json       # Selected publications, tags, contributors and DOI links
└── github-stats.json   # Aggregate GitHub activity (written by the stats script)
```

Photos referenced as `"photo": "assets/name.jpg"` should be placed in the root `assets/` folder.

### People (`members.json`)

The file is a JSON array of member objects. `leadership` controls where someone appears:

| `leadership` | Where they show |
|---|---|
| `director` | Featured director card |
| `lead` | Core leads grid |
| `member` (or omitted) | Members grid |
| `researcher` | Current-members roster (as listed on the official DSLab page) |
| `alumni` | Alumni roster, grouped by `alumniGroup`: `phd` · `master` · `undergraduate` |

```json
{
  "name": "Example Researcher",
  "role": "PhD Student",
  "cardFooter": "PhD Student",
  "leadership": "member",
  "github": "optional-login",
  "linkedin": "https://www.linkedin.com/in/example/",
  "photo": "assets/example.jpg",
  "bio": "Short research bio.",
  "degree": "phd",
  "focus": ["Distributed Systems"]
}
```

`degree` may be `bsc`, `msc`, or `phd` (aliases such as `bachelor` / `master` also work). Optional profile fields: `email`, `scholar`, `researchgate`, `scopus`, `dblp`, `homepage`, `years`, `thesis`.

### Current work

Edit `data/current-work.json` to update **Now Building**. The file is a JSON array — add, remove or reorder objects to change what appears.

Current threads:

- Distributed kernelware
- ExaScale HPC middleware
- Distributed complex event processing
- Cloud virtualization and VM scheduling

```json
{
  "title": "Sample Work",
  "status": "In progress",
  "description": "We propose...",
  "tags": ["Serverless", "FaaS"],
  "members": ["Prof. Mohsen Sharifi"]
}
```

### Publications

Edit `data/projects.json` for the **Publications** grid. Optional `links` can point to papers, demos or repositories. The site currently lists selected papers from Prof. Sharifi’s faculty page (2023–2026), with DOIs when available.

```json
{
  "title": "Sample Paper",
  "type": "Journal paper",
  "status": "Published",
  "description": "Sample description",
  "tags": ["High Performance Computing"],
  "members": ["Prof. Mohsen Sharifi"],
  "links": [
    { "url": "https://doi.org/10.1000/example", "label": "DOI", "icon": "external-link" }
  ]
}
```

### Upcoming presentations

Edit `data/presentations.json` to manage the numbered talk list (nav: **Presentations**). The `member` value is matched against `name` or `github` in `members.json`; the card then reuses that person’s photo, role and research-focus tags.

The list is currently empty (`"presentations": []`). Add objects inside `presentations`; visible card numbers update automatically. Leave `link` empty to show “Meet link soon”.

```json
{
  "member": "Matin Ghanbari",
  "title": "Presentation title",
  "date": "Monday, 7 September",
  "time": "10:00",
  "location": "DSLab IUST / Online",
  "link": "https://example.com/presentation",
  "linkLabel": "Join presentation",
  "series": "NEXT WEEK"
}
```

---

## GitHub analytics

A GitHub Actions workflow (push to `main`, manual dispatch, and every 6 hours) runs `scripts/update-github-stats.mjs`, then builds and deploys Pages.

The public site exposes **aggregate metrics only**:

- repository count (non-archived, non-fork, after exclusions)
- organization-wide commit activity
- last statistics update (or a last-known-good snapshot)
- Research Coffee Meter (1 coffee per 20 commits)

Private repository names, URLs, descriptions and source contents are never written to `data/github-stats.json`. Contributor activity in the 90-day window is limited to GitHub usernames listed on members.

Repository secrets/vars:

- `DSLAB_GITHUB_TOKEN`
- `DSLAB_GITHUB_ORG`
- `DSLAB_EXCLUDE_REPOS`

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Monorepo | Turborepo + pnpm workspaces (`src/*`) |
| Styling | Tailwind CSS v4 + custom tokens (`src/web/src/styles/`) |
| Content | JSON in `data/` |
| Automation | GitHub Actions |
| Hosting | GitHub Pages |
| Icons | lucide-react |
| GitHub data | GitHub REST API (metadata-only stats) |

---

## Design language

Visual identity is specified in `design/SKILL.md` and `src/web/src/styles/tokens.css`. Colour is functional (active / connected / fault), not decorative:

| Token | Hex | Role |
|---|---|---|
| `fabric` | `#10141F` | Dark ground (header, footer, hero) |
| `paper` | `#F5F6F8` | Light content ground |
| `wire` | `#5B6478` | Secondary text, rules, graph edges |
| `quorum` | `#D6A93B` | Active / consensus |
| `link` | `#2FA6A6` | Connection / reference |
| `fault` | `#C0533E` | Error / partition only |

Typography: **Vazirmatn** for UI and body, **JetBrains Mono** for real data (dates, status, node ids). Layouts stay sharp and research-oriented, with a node/edge topology in the hero rather than generic SaaS chrome.

---

## Contact

| | |
|---|---|
| Email | [msharifi@iust.ac.ir](mailto:msharifi@iust.ac.ir) |
| Tel/Fax | +98 21 7322 53 07 |
| Faculty page | [webpages.iust.ac.ir/msharifi](https://webpages.iust.ac.ir/msharifi/) |
| Official DSLab page | [dslab.html](https://webpages.iust.ac.ir/msharifi/public/dslab.html) |
| Address | School of Computer Engineering, Iran University of Science and Technology, University Road, Hengam Street, Resalat Square, Narmak, Tehran, Iran (postal code 1684613114) |

---

## Special thanks

Thanks to [Ali Ahmadi (@AliAhmadi-Software)](https://github.com/AliAhmadi-Software) for the original idea and code contributions that helped shape this project.

---

<div align="center">

### DSLab IUST

**Distributed Systems Lab — Iran University of Science and Technology**

*Research · Engineering · Distributed Systems*

</div>
