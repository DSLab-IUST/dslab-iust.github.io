/**
 * Every deployment-specific value lives here. Nothing in this file is a secret:
 * an OAuth *client id* is public by design, and the Device Flow never needs a
 * client secret — which is exactly why it suits a static host.
 */

const env = import.meta.env;

export const siteConfig = {
  repository: {
    owner: 'DSLab-IUST',
    name: 'dslab-iust.github.io',
    branch: 'main',
    /** Folder holding the editable JSON content, relative to the repo root. */
    dataDirectory: 'data',
  },

  /** Only members of this GitHub organization may reach the admin area. */
  organization: 'DSLab-IUST',

  auth: {
    /** Replace with the Client ID of your GitHub OAuth App — see README §Auth. */
    clientId: env.VITE_GITHUB_CLIENT_ID ?? 'Ov23liXXXXXXXXXXXXXX',
    /** `repo` to commit content, `read:org` to verify membership. */
    scopes: ['repo', 'read:org'] as const,
    sessionDays: 7,
    /**
     * GitHub's OAuth endpoints (github.com/login/*) send no CORS headers, so a
     * browser cannot call them directly. Point this at a thin same-origin-CORS
     * relay to enable the Device Flow; leave it empty to hide that option and
     * rely on the fine-grained token flow, which needs no infrastructure.
     */
    deviceFlowRelay: env.VITE_GITHUB_OAUTH_RELAY ?? '',
    allowPersonalAccessToken: true,
  },

  /** Bounded retry for the read-modify-write cycle against the Contents API. */
  commit: {
    maxAttempts: 5,
    baseDelayMs: 400,
    maxDelayMs: 4000,
  },

  links: {
    github: 'https://github.com/DSLab-IUST',
    email: 'dslab@iust.ac.ir',
    university: 'https://www.iust.ac.ir',
    address: {
      fa: 'تهران، نارمک، دانشگاه علم و صنعت ایران، دانشکده مهندسی کامپیوتر',
      en: 'School of Computer Engineering, Iran University of Science and Technology, Tehran',
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
