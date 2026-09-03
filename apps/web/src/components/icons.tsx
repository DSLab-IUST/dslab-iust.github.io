import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Braces,
  BrainCircuit,
  CalendarDays,
  Clock3,
  CloudCog,
  Coffee,
  Cpu,
  ExternalLink,
  FolderKanban,
  GitCommitHorizontal,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Network,
  Presentation,
  Radio,
  Shield,
  Sparkles,
  Sun,
  Users,
  Waypoints,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  "arrow-down-right": ArrowDownRight,
  "arrow-up-right": ArrowUpRight,
  "book-open": BookOpen,
  boxes: Boxes,
  braces: Braces,
  "brain-circuit": BrainCircuit,
  "calendar-days": CalendarDays,
  "clock-3": Clock3,
  "cloud-cog": CloudCog,
  coffee: Coffee,
  cpu: Cpu,
  dblp: BookOpen,
  "external-link": ExternalLink,
  "folder-kanban": FolderKanban,
  "git-commit-horizontal": GitCommitHorizontal,
  github: Github,
  globe: Globe,
  "graduation-cap": GraduationCap,
  linkedin: Linkedin,
  mail: Mail,
  "map-pin": MapPin,
  moon: Moon,
  network: Network,
  presentation: Presentation,
  radio: Radio,
  researchgate: Globe,
  scholar: GraduationCap,
  scopus: BookOpen,
  shield: Shield,
  sparkles: Sparkles,
  sun: Sun,
  users: Users,
  waypoints: Waypoints,
  workflow: Workflow,
  x: X,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name as IconName] ?? ExternalLink;
  return <Cmp className={className} aria-hidden="true" />;
}

export function GoogleMeetIcon() {
  return (
    <svg className="google-meet-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#00832D" d="M5.5 7h12A3.5 3.5 0 0 1 21 10.5v11a3.5 3.5 0 0 1-3.5 3.5h-12A3.5 3.5 0 0 1 2 21.5v-11A3.5 3.5 0 0 1 5.5 7Z" />
      <path fill="#00AC47" d="M11 7h6.5A3.5 3.5 0 0 1 21 10.5V16H11V7Z" />
      <path fill="#2684FC" d="M11 16h10v5.5a3.5 3.5 0 0 1-3.5 3.5H11v-9Z" />
      <path fill="#FFBA00" d="m21 12 7-4v8l-7 4v-8Z" />
      <path fill="#EA4335" d="m21 20 7-4v8l-7-4Z" />
    </svg>
  );
}
