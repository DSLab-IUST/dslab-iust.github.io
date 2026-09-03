import { siteConfig } from '@/config/site';
import { githubRequest, githubRequestNoContent } from './client';
import { GitHubError } from './errors';

export interface GitHubViewer {
  login: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
}

interface ViewerResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface MembershipResponse {
  state: 'active' | 'pending';
}

interface RepositoryResponse {
  permissions?: { push?: boolean };
}

export async function fetchViewer(token: string, signal?: AbortSignal): Promise<GitHubViewer> {
  const viewer = await githubRequest<ViewerResponse>('/user', { token, signal });

  return {
    login: viewer.login,
    name: viewer.name ?? viewer.login,
    avatarUrl: viewer.avatar_url,
    profileUrl: viewer.html_url,
  };
}

/**
 * Membership is the gate for the whole admin area.
 *
 * `/user/memberships/orgs/{org}` is authoritative but needs the `read:org`
 * scope; when a narrower token is used it 403s, so the public member roster is
 * consulted as a fallback.
 */
export async function isOrganizationMember(
  token: string,
  login: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const org = encodeURIComponent(siteConfig.organization);

  try {
    const membership = await githubRequest<MembershipResponse>(`/user/memberships/orgs/${org}`, {
      token,
      signal,
    });
    return membership.state === 'active';
  } catch (error) {
    if (error instanceof GitHubError && error.code === 'not-found') return false;
    // A token without `read:org` is forbidden here but may still see the roster.
    if (!(error instanceof GitHubError) || error.code !== 'forbidden') throw error;
  }

  return githubRequestNoContent(`/orgs/${org}/members/${encodeURIComponent(login)}`, {
    token,
    signal,
  });
}

/** Surfaces a token that can read the org but cannot commit to the repository. */
export async function canPushToRepository(token: string, signal?: AbortSignal): Promise<boolean> {
  const { owner, name } = siteConfig.repository;

  try {
    const repo = await githubRequest<RepositoryResponse>(`/repos/${owner}/${name}`, {
      token,
      signal,
    });
    return repo.permissions?.push === true;
  } catch {
    return false;
  }
}
