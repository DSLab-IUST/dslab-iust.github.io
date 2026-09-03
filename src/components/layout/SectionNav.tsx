import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Link, NavigationType, useLocation, useNavigationType } from 'react-router-dom';
import { scrollToHash } from '@/lib/scrollToHash';
import { useContent } from '@/providers/ContentProvider';
import { SECTION_IDS, sectionFromHash, sectionTo, type SectionId } from './navigation';

const ActiveSectionContext = createContext<SectionId | null>(null);

export function useActiveSection(): SectionId | null {
  return use(ActiveSectionContext);
}

/**
 * Keeps hash navigation, first-load deep links and the active nav item in sync
 * with the sections on the home page. Browser back/forward keeps native restore.
 */
export function SectionNavProvider({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const { status } = useContent();
  const hashSection = sectionFromHash(hash);
  const [spied, setSpied] = useState<SectionId | null>(null);
  const [seenHash, setSeenHash] = useState(hash);
  const firstEntry = useRef(true);
  const waitingForContent = useRef(status !== 'ready');

  if (hash !== seenHash) {
    setSeenHash(hash);
    setSpied(null);
  }

  useEffect(() => {
    if (pathname !== '/') return;

    const target = hash || '#home';
    const isFirst = firstEntry.current;
    firstEntry.current = false;

    if (isFirst && !hash) return;
    if (!isFirst && navigationType === NavigationType.Pop) return;

    scrollToHash(target);
  }, [pathname, hash, navigationType]);

  useEffect(() => {
    if (status !== 'ready') {
      waitingForContent.current = true;
      return;
    }
    if (pathname !== '/' || !hash || !waitingForContent.current) return;
    waitingForContent.current = false;
    scrollToHash(hash, 'auto');
  }, [pathname, hash, status]);

  useEffect(() => {
    if (pathname !== '/') return;

    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id && SECTION_IDS.includes(id as SectionId)) {
          setSpied(id as SectionId);
        }
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [pathname, status]);

  const active = pathname === '/' ? (spied ?? hashSection) : null;

  return <ActiveSectionContext value={active}>{children}</ActiveSectionContext>;
}

interface SectionLinkProps {
  hash: SectionId;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Brand mark and similar links should not claim `aria-current`. */
  markCurrent?: boolean;
}

export function SectionLink({
  hash,
  children,
  className,
  onClick,
  markCurrent = true,
}: SectionLinkProps) {
  const { pathname, hash: currentHash } = useLocation();
  const active = useActiveSection();
  const current = markCurrent && active === hash;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.();
    const alreadyThere =
      pathname === '/' && (currentHash === `#${hash}` || (hash === 'home' && currentHash === ''));
    if (alreadyThere) {
      event.preventDefault();
      scrollToHash(`#${hash}`);
    }
  };

  return (
    <Link
      to={sectionTo(hash)}
      preventScrollReset
      onClick={handleClick}
      className={className}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
