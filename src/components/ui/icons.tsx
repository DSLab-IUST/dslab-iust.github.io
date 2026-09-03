import type { SVGProps } from 'react';

/**
 * One icon system only (Lucide geometry, 24px grid, 1.75 stroke). Size comes
 * from the surrounding component so icons inherit the control scale.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

export const CloseIcon = (props: IconProps) => (
  <Icon width="18" height="18" {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon width="20" height="20" {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Icon>
);

export const LanguagesIcon = (props: IconProps) => (
  <Icon width="17" height="17" {...props}>
    <path d="M4 5h10M9 3v2c0 4.4-2.2 8-5 9M6 10c0 2.6 2.7 5 6 5" />
    <path d="m13 21 4-9 4 9M14.6 18h4.8" />
  </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ArrowIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const CalendarIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const MapPinIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

export const UsersIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </Icon>
);

export const MicIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </Icon>
);

export const GitHubIcon = (props: IconProps) => (
  <Icon width="17" height="17" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.8 1.5a13 13 0 0 0-7 0C6.3 1.1 5.2 1.4 5.2 1.4A4.9 4.9 0 0 0 5.1 5a5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7" />
  </Icon>
);

export const ScholarIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="m12 4 9 5-9 5-9-5 9-5Z" />
    <path d="M7 11.2V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.8" />
  </Icon>
);

export const ExternalLinkIcon = (props: IconProps) => (
  <Icon width="14" height="14" {...props}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </Icon>
);

export const PlusIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const PencilIcon = (props: IconProps) => (
  <Icon width="15" height="15" {...props}>
    <path d="M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4Z" />
    <path d="m14.5 5.5 4 4" />
  </Icon>
);

export const TrashIcon = (props: IconProps) => (
  <Icon width="15" height="15" {...props}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </Icon>
);

export const CopyIcon = (props: IconProps) => (
  <Icon width="15" height="15" {...props}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon width="15" height="15" {...props}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Icon>
);

export const ShieldIcon = (props: IconProps) => (
  <Icon width="17" height="17" {...props}>
    <path d="M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10.5-4.6-1.9-8-5.5-8-10.5v-6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const LogOutIcon = (props: IconProps) => (
  <Icon width="16" height="16" {...props}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="m15 16 5-4-5-4M20 12H9" />
  </Icon>
);

export const AlertIcon = (props: IconProps) => (
  <Icon width="18" height="18" {...props}>
    <path d="M12 3.5 22 20H2L12 3.5Z" />
    <path d="M12 10v4M12 17.2h.01" />
  </Icon>
);

export const InboxIcon = (props: IconProps) => (
  <Icon width="22" height="22" {...props}>
    <path d="M3 13h5l1.5 3h5L16 13h5" />
    <path d="M5.5 4h13l2.5 9v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l2.5-9Z" />
  </Icon>
);
