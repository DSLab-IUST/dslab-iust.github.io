export const CONFIG = {
  githubOrg: "DSLab-IUST",
  statsUrl: "/data/github-stats.json",
  membersUrl: "/data/members.json",
  currentWorkUrl: "/data/current-work.json",
  projectsUrl: "/data/projects.json",
  presentationsUrl: "/data/presentations.json",
  commitsPerCoffee: 20,
} as const;

export const THEME_STORAGE_KEY = "dslab:theme";
export const STATS_CACHE_KEY = "dslab:last-good-github-stats";

export const LAB = {
  name: "DSLab IUST",
  fullName: "Distributed Systems Lab",
  school: "School of Computer Engineering",
  university: "Iran University of Science and Technology",
  director: "Prof. Mohsen Sharifi",
  quote: "Next Generation Operating Systems will be Aware and Distributed by Nature at the Kernel Level…",
  email: "msharifi@iust.ac.ir",
  phone: "+98 21 7322 53 07",
  postalCode: "1684613114",
  address: [
    "School of Computer Engineering",
    "Iran University of Science and Technology",
    "University Road, Hengam Street, Resalat Square, Narmak",
    "Tehran, Iran",
  ],
  homepage: "https://webpages.iust.ac.ir/msharifi/",
  dslabPage: "https://webpages.iust.ac.ir/msharifi/public/dslab.html",
  github: "https://github.com/DSLab-IUST",
} as const;

export const RESEARCH = [
  {
    name: "High Performance Computing",
    short: "HPC",
    icon: "cpu",
    text: "Performability across application, compiler, runtime, OS, network and hardware layers — with current work on ExaScale middleware for heterogeneous, dynamically reconfigurable systems.",
  },
  {
    name: "Distributed Systems and Computing",
    short: "DIST",
    icon: "network",
    text: "Independent, dispersed components that communicate toward a common goal: distributed operating systems, virtualization, peer-to-peer, ubiquitous and autonomic computing.",
  },
  {
    name: "Cloud Computing Environments",
    short: "CLOUD",
    icon: "cloud-cog",
    text: "Virtualization for manageability, scalability and reliability of large-scale systems — VM scheduling, virtual clusters, and resource management at the VMM.",
  },
  {
    name: "Complex Event Processing",
    short: "CEP",
    icon: "workflow",
    text: "Detecting correlated patterns in high-rate event streams. The lab works on distributing CEP so processing can scale beyond a single central engine.",
  },
  {
    name: "Wireless Sensor (Actor) Networks",
    short: "WSAN",
    icon: "radio",
    text: "Sensor and actuator nodes over wireless links for monitoring and acting on the physical world — coordination, QoS, fault-tolerance and real-time task assignment.",
  },
  {
    name: "Computer Security and Web Engineering",
    short: "SEC",
    icon: "shield",
    text: "Information security for computers and networks, and systematic engineering of high-quality, maintainable web-based systems.",
  },
] as const;
