import type { fa } from './fa';

type Dictionary = {
  readonly [K in keyof typeof fa]: (typeof fa)[K] extends Record<string, unknown>
    ? {
        readonly [P in keyof (typeof fa)[K]]: (typeof fa)[K][P] extends Record<string, unknown>
          ? { readonly [Q in keyof (typeof fa)[K][P]]: string }
          : string;
      }
    : string;
};

export const en: Dictionary = {
  brand: {
    short: 'DS Lab',
    name: 'Distributed Systems Lab',
    university: 'Iran University of Science and Technology',
    tagline: 'Research on distributed systems, cloud computing and software engineering',
  },

  nav: {
    home: 'Home',
    events: 'Events',
    research: 'Research',
    projects: 'Projects',
    members: 'Members',
    admin: 'Admin',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
  },

  actions: {
    signIn: 'Sign in with GitHub',
    signOut: 'Sign out',
    save: 'Save',
    cancel: 'Cancel',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    retry: 'Try again',
    copy: 'Copy',
    copied: 'Copied',
    close: 'Close',
    viewAll: 'View all',
    details: 'Details',
    register: 'Register',
    openOnGitHub: 'Open on GitHub',
  },

  theme: {
    label: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
  },

  locale: {
    label: 'Change language',
  },

  home: {
    kicker: 'Research Lab',
    heroTitleLead: 'We build and measure',
    heroTitleAccent: 'distributed',
    heroTitleTrail: 'systems',
    heroLede:
      'The Distributed Systems Lab at Iran University of Science and Technology works on cloud architecture, large-scale coordination and software dependability.',
    exploreResearch: 'Research areas',
    seeEvents: 'Upcoming events',
    stats: {
      members: 'Active members',
      projects: 'Live projects',
      research: 'Research areas',
      events: 'Events this year',
    },
    upcomingKicker: 'Calendar',
    upcomingTitle: 'Upcoming events',
    upcomingLede: 'Seminars, workshops and thesis defenses hosted by the lab.',
    researchKicker: 'Areas',
    researchTitle: 'What we work on',
    projectsKicker: 'Built here',
    projectsTitle: 'Live projects',
    leadsKicker: 'Core',
    leadsTitle: 'Core members',
  },

  events: {
    title: 'Events',
    lede: 'Every session the lab hosts, from the weekly seminar to thesis defenses.',
    upcoming: 'Upcoming',
    past: 'Past',
    empty: 'Nothing has been scheduled here yet.',
    location: 'Location',
    capacity: 'Capacity',
    speaker: 'Speaker',
    unlimited: 'Unlimited',
    seats: '{{seats}} seats',
    startsIn: 'Starts {{when}}',
    live: 'Happening now',
    kind: {
      seminar: 'Seminar',
      workshop: 'Workshop',
      defense: 'Defense',
      meetup: 'Meetup',
      course: 'Course',
    },
  },

  research: {
    title: 'Research areas',
    lede: 'The themes our studies and projects are organised around.',
    empty: 'No research area has been published yet.',
  },

  projects: {
    title: 'Projects',
    lede: 'Systems designed and maintained inside the lab.',
    empty: 'No project has been published yet.',
    team: 'Team',
    startedAt: 'Started',
    status: {
      all: 'All',
      active: 'In progress',
      completed: 'Completed',
      archived: 'Archived',
    },
  },

  members: {
    title: 'Members',
    lede: 'Researchers, graduate students and faculty of the lab.',
    empty: 'No member has been published yet.',
    lead: 'Core',
    interests: 'Interests',
    degree: {
      all: 'All',
      faculty: 'Faculty',
      phd: 'PhD',
      msc: 'MSc',
      bsc: 'BSc',
    },
  },

  auth: {
    title: 'Lab member sign-in',
    lede: 'Sign in with your GitHub account to manage content. Access is limited to members of the {{org}} organization.',
    deviceTab: 'GitHub sign-in',
    tokenTab: 'Access token',
    startDeviceFlow: 'Request a sign-in code',
    deviceStep1: 'Copy this code:',
    deviceStep2: 'Open the GitHub activation page and enter the code.',
    openVerification: 'Open GitHub page',
    waiting: 'Waiting for approval on GitHub…',
    expiresIn: 'Code expires in {{time}}',
    tokenLabel: 'Personal access token',
    tokenHint:
      'Create a fine-grained token with Contents: Read and write on this repository and Members: Read on the organization.',
    tokenPlaceholder: 'github_pat_…',
    createToken: 'Create a token on GitHub',
    signedInAs: 'Signed in as {{name}}',
    sessionNote: 'Your session stays active for {{days}} days.',
    relayMissing:
      'Direct GitHub sign-in is not configured for this deployment. Use the access token instead.',
    errors: {
      notMember:
        'You are not a member of the {{org}} organization. Only members may enter the admin area.',
      denied: 'The sign-in request was declined on GitHub.',
      expired: 'The sign-in code expired. Please try again.',
      network: 'GitHub could not be reached.',
      invalidToken: 'That token is invalid or has expired.',
      noPush: 'Your token cannot write to the repository. Contents: Read and write is required.',
      unknown: 'Something went wrong during sign-in.',
    },
  },

  admin: {
    title: 'Content management',
    lede: 'Changes are committed to the repository under your own account.',
    publishNotice:
      'Your change is committed. It goes live once the build and deploy workflow finishes, usually within a minute or two.',
    tabs: {
      events: 'Events',
      members: 'Members',
      projects: 'Projects',
      research: 'Research',
    },
    newEvent: 'New event',
    newMember: 'New member',
    newProject: 'New project',
    newResearch: 'New area',
    editEvent: 'Edit event',
    editMember: 'Edit member',
    editProject: 'Edit project',
    editResearch: 'Edit area',
    deleteTitle: 'Delete “{{title}}”?',
    deleteBody:
      'The entry is removed from the data file and the change is committed. This cannot be undone.',
    saving: 'Committing to GitHub…',
    retrying: 'Retrying ({{attempt}}) — the file changed while you were saving.',
    savedWithRetries: 'Committed after {{count}} attempts.',
    viewCommit: 'View commit',
    guardTitle: 'Restricted area',
    guardBody: 'Sign in as a member of the {{org}} organization to view this page.',
  },

  form: {
    titleFa: 'Title (Persian)',
    titleEn: 'Title (English)',
    descriptionFa: 'Description (Persian)',
    descriptionEn: 'Description (English)',
    summaryFa: 'Summary (Persian)',
    summaryEn: 'Summary (English)',
    nameFa: 'Name (Persian)',
    nameEn: 'Name (English)',
    roleFa: 'Role (Persian)',
    roleEn: 'Role (English)',
    bioFa: 'Bio (Persian)',
    bioEn: 'Bio (English)',
    locationFa: 'Location (Persian)',
    locationEn: 'Location (English)',
    speakerFa: 'Speaker (Persian)',
    speakerEn: 'Speaker (English)',
    kind: 'Event type',
    startsAt: 'Starts at',
    endsAt: 'Ends at',
    capacity: 'Capacity (0 means unlimited)',
    registrationUrl: 'Registration link',
    tags: 'Tags (comma separated)',
    featured: 'Feature on the home page',
    degree: 'Degree',
    lead: 'Core member',
    avatarUrl: 'Avatar URL',
    email: 'Email',
    githubUsername: 'GitHub username',
    scholarUrl: 'Google Scholar URL',
    interests: 'Interests (comma separated)',
    status: 'Status',
    repositoryUrl: 'Repository URL',
    demoUrl: 'Demo URL',
    memberIds: 'Project members',
    startedAt: 'Start date',
    glyph: 'Glyph',
    order: 'Display order',
    optional: 'optional',
    errors: {
      required: 'This field is required.',
      url: 'Enter a valid URL.',
      email: 'Enter a valid email address.',
      number: 'Enter a valid number.',
      dateOrder: 'The end time must come after the start time.',
    },
  },

  state: {
    loading: 'Loading…',
    loadFailed: 'The content could not be loaded.',
    notFoundTitle: 'Page not found',
    notFoundBody: 'There is nothing at this address.',
    backHome: 'Back to home',
  },

  footer: {
    contact: 'Contact',
    explore: 'Explore',
    address: 'Address',
    rights: 'Distributed Systems Lab — Iran University of Science and Technology',
    builtWith: 'Hosted on GitHub Pages',
  },
};
