<div align="center">

# DSLab IUST

### Distributed Systems Lab — Iran University of Science and Technology

**Researching distributed operating systems, high-performance computing, and cloud system software.**

<br>

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

**DSLab IUST — Distributed Systems Lab** at Iran University of Science and Technology is led by **Prof. Mohsen Sharifi**. The lab studies challenges in distributed computing and systems, wireless sensor (actor) networks, cloud computing environments, and computer security and web engineering — with special focus on distributed operating systems and high-performance computing.

The long-term aim is the know-how and technology of engineering a truly distributed operating system, a kernelware that can support heterogeneous platforms.

### Research Areas

`HPC` · `Distributed Systems` · `Cloud Computing` · `Complex Event Processing` · `WSAN` · `Computer Security & Web Engineering`

---

## Website

This repository contains the official DSLab IUST website — a React + TypeScript app built with Vite, Turborepo and Tailwind CSS.

### Main Sections

- **Research** — visual presentation of the lab's main research directions.
- **People** — profiles for the Lab Director, Core Leads, and researchers.
- **Academic Badges** — compact degree indicators for B.Sc, M.Sc, and Ph.D members.
- **Current Work** — manually curated research threads showing what teams are currently building.
- **Projects** — project cards with descriptions, research tags, contributors, and optional publication/demo links.
- **GitHub Activity** — privacy-aware aggregate repository and commit statistics.
- **Research Coffee Meter** — a playful activity metric derived from commit count.

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

The Vite app lives in `src/web`. JSON content at the repository root is copied into the web app during `dev` and `build`.

---

## Member & Project Data

The website is content-driven and keeps most frequently edited information in simple JSON files.

```text
data/
├── members.json        # People, roles, photos, links, degree and research focus
├── presentations.json  # Upcoming talks; member name, title, date, time and link
├── current-work.json   # Active research threads shown in Now Building
├── projects.json       # Selected project cards, tags, contributors and links
└── github-stats.json   # Generated aggregate GitHub activity
```

Member names inside `current-work.json` and `projects.json` are matched against `members.json`, so the site can reuse profile photos and identity information across sections.

### Current work

Edit `data/current-work.json` to update the **Now Building** cards. The file is a JSON array — add, remove or reorder objects to change what appears on the site.

```json
{
  "title": "Sample Work",
  "status": "In progress",
  "description": "We propose...",
  "tags": ["Serverless", "FaaS"],
  "members": ["Abolfazl Arshia"]
}
```

### Projects

Edit `data/projects.json` for the **Projects** grid. Optional `links` can point to papers, demos or repositories.

```json
{
  "title": "Sample Project",
  "type": "Research Project",
  "status": "Under Review",
  "description": "Sample project description",
  "tags": ["Sample", "Project"],
  "members": ["Matin Ghanbari"],
  "links": []
}
```

### Upcoming presentations

Edit `data/presentations.json` to manage the numbered presentation list shown immediately before **Now Building**. The `member` value is matched against `name` (or `github`) in `data/members.json`; the card then reuses that person's photo, role and research-focus tags automatically.

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

Add, remove or reorder objects inside `presentations`; the visible card numbers update automatically. Leave `link` empty to show “Link coming soon”.

---

## GitHub Analytics

DSLab IUST includes an automated statistics workflow built with **GitHub Actions**.

It can surface aggregate information such as:

- total repository count
- organization-wide commit activity
- last statistics update
- derived activity indicators such as the Research Coffee Meter

The public website is designed to expose **aggregate metrics only** and does not need to publish private repository names, source code, or internal project details.

Repository secrets/vars (preferred names; legacy `DINA_*` names still work as a fallback):

- `DSLAB_GITHUB_TOKEN` / `DINA_GITHUB_TOKEN`
- `DSLAB_GITHUB_ORG` / `DINA_GITHUB_ORG`
- `DSLAB_EXCLUDE_REPOS` / `DINA_EXCLUDE_REPOS`

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite |
| Monorepo | Turborepo + pnpm workspaces |
| Styling | Tailwind CSS |
| Content | JSON |
| Automation | GitHub Actions |
| Hosting | GitHub Pages |
| Icons | lucide-react |
| GitHub Data | GitHub REST API |

---

## Design Language

The visual identity combines:

- deep navy backgrounds
- warm cream typography
- DSLab orange accents
- gold leadership highlights
- subtle glass surfaces
- minimal motion and glow effects
- responsive research-oriented layouts

The goal is to give the lab a visual identity that feels equally at home in **AI research, distributed systems, and production-grade infrastructure**.

---

<div align="center">

### DSLab IUST

**Distributed Systems Lab — Iran University of Science and Technology**

*Research · Engineering · Distributed Systems*

</div>
