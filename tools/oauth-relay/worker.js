/**
 * Optional Device Flow relay — deploy only if you want the "Sign in with
 * GitHub" tab. The site works without it through the fine-grained token flow.
 *
 * Why it is needed: `api.github.com` sends CORS headers, but the OAuth
 * endpoints on `github.com` do not. A browser therefore cannot call
 * `/login/device/code` or `/login/oauth/access_token` directly. This worker
 * forwards those two requests and nothing else. It holds no secret — the
 * Device Flow has none — so it stores nothing and cannot mint tokens on its own.
 *
 * Deploy on Cloudflare Workers:
 *   npx wrangler deploy tools/oauth-relay/worker.js --name dslab-oauth-relay
 *
 * Then set the repository variable GH_OAUTH_RELAY to the worker URL.
 */

const ALLOWED_ORIGINS = ['https://dslab-iust.github.io', 'http://localhost:5173'];

const ALLOWED_PATHS = new Set(['/login/device/code', '/login/oauth/access_token']);

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400',
});

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') ?? '';
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST' || !ALLOWED_PATHS.has(pathname)) {
      return new Response('Not found', { status: 404, headers: corsHeaders(origin) });
    }

    // GitHub's OAuth endpoints expect form encoding; the site speaks JSON.
    const params = new URLSearchParams(await request.json());

    const upstream = await fetch(`https://github.com${pathname}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  },
};
