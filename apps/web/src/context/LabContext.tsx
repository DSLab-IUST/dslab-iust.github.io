import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONFIG } from "@/config";
import { githubOrgHref } from "@/lib/format";
import { loadLabData } from "@/lib/stats";
import type { GithubStats, LabWork, Member, PresentationData } from "@/types";

interface LabContextValue {
  members: Member[];
  githubStats: GithubStats | null;
  labWork: LabWork;
  presentations: PresentationData;
  loading: boolean;
  orgHref: string;
  selectedMember: Member | null;
  openMember: (member: Member) => void;
  closeMember: () => void;
}

const LabContext = createContext<LabContextValue | null>(null);

export function LabProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const [labWork, setLabWork] = useState<LabWork>({ currentWork: [], projects: [] });
  const [presentations, setPresentations] = useState<PresentationData>({ presentations: [] });
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLabData()
      .then((data) => {
        if (cancelled) return;
        setMembers(data.members);
        setGithubStats(data.githubStats);
        setLabWork(data.labWork);
        setPresentations(data.presentationData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const orgHref = githubOrgHref(githubStats?.organization, CONFIG.githubOrg);
  const openMember = useCallback((member: Member) => setSelectedMember(member), []);
  const closeMember = useCallback(() => setSelectedMember(null), []);

  const value = useMemo<LabContextValue>(() => ({
    members,
    githubStats,
    labWork,
    presentations,
    loading,
    orgHref,
    selectedMember,
    openMember,
    closeMember,
  }), [members, githubStats, labWork, presentations, loading, orgHref, selectedMember, openMember, closeMember]);

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) throw new Error("useLab must be used within LabProvider");
  return context;
}
