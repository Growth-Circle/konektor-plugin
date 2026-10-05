import assert from 'node:assert/strict'
import { test } from 'node:test'
import { verifyOAuth } from '../scripts/verify-oauth.mjs'

const clientId = 'https://konektor.id/oauth/clients/cursor.json'
const resourceUrl = 'https://mcp.konektor.id/mcp/claude'
const scopeList = [
  'agent.workspace.read', 'agent.analytics.read', 'agent.leads.read',
  'agent.conversions.read', 'agent.ads.read', 'agent.rotators.read',
  'agent.inbox.read', 'agent.rules.read', 'agent.agentic.read', 'offline_access',
]

function fakeFetch(overrides = {}) {
  return async (url, options) => {
    assert.equal(options.redirect, 'error')
    assert.equal(options.headers.authorization, undefined)
    if (url === resourceUrl) return new Response('', {
      status: overrides.unauthenticatedStatus ?? 401,
      headers: { 'www-authenticate': 'Bearer resource_metadata="https://mcp.konektor.id/.well-known/oauth-protected-resource/mcp/claude"' },
    })
    const body = url === clientId ? {
      client_id: clientId, client_name: 'Cursor / Grok Bot', token_endpoint_auth_method: 'none',
      redirect_uris: overrides.redirects ?? ['https://www.cursor.com/agents/mcp/oauth/callback', 'http://localhost:8787/callback'],
      grant_types: ['authorization_code', 'refresh_token'],
    } : url.endsWith('oauth-authorization-server') ? {
      issuer: 'https://konektor.id', authorization_endpoint: 'https://konektor.id/oauth/authorize',
      token_endpoint: 'https://konektor.id/oauth/token', code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      ...(overrides.registration ? { registration_endpoint: 'https://konektor.id/oauth/register' } : {}),
    } : { resource: resourceUrl, authorization_servers: ['https://konektor.id'], scopes_supported: scopeList }
    return Response.json(body, { status: url === clientId ? overrides.clientStatus ?? 200 : 200 })
  }
}

test('verifies public metadata without claiming authenticated tools', async () => {
  assert.deepEqual(await verifyOAuth(fakeFetch()), {
    client: 'Cursor / Grok Bot', authentication: 'OAuth with PKCE S256', authenticatedToolsVerified: false,
  })
})

test('rejects undeployed metadata', async () => {
  await assert.rejects(verifyOAuth(fakeFetch({ clientStatus: 404 })))
})

test('rejects an unreviewed callback', async () => {
  await assert.rejects(verifyOAuth(fakeFetch({ redirects: ['https://evil.example/callback'] })))
})

test('rejects open registration', async () => {
  await assert.rejects(verifyOAuth(fakeFetch({ registration: true })))
})

test('rejects unauthenticated access that succeeds', async () => {
  await assert.rejects(verifyOAuth(fakeFetch({ unauthenticatedStatus: 200 })))
})
