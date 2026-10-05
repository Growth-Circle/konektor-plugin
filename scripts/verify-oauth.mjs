import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT, validatePackage } from './validate.mjs'

/** Verify public metadata only. Never request or print user credentials. */
export async function verifyOAuth(fetchImpl = fetch) {
  await validatePackage()
  const config = JSON.parse(await readFile(resolve(ROOT, 'mcp.json'), 'utf8')).mcpServers.konektor
  const clientId = config.auth.CLIENT_ID
  const get = url => fetchImpl(url, {
    headers: { accept: 'application/json', 'user-agent': 'Konektor-plugin-verification/0.1.0' },
    redirect: 'error', signal: AbortSignal.timeout(15000),
  })
  const clientResponse = await get(clientId)
  assert.equal(clientResponse.status, 200, 'Public client metadata must be deployed')
  const client = await clientResponse.json()
  assert.equal(client.client_id, clientId)
  assert.equal(client.client_name, 'Cursor / Grok Bot')
  assert.equal(client.token_endpoint_auth_method, 'none')
  assert.deepEqual(client.redirect_uris, [
    'https://www.cursor.com/agents/mcp/oauth/callback',
    'http://localhost:8787/callback',
  ])
  assert.deepEqual(client.grant_types, ['authorization_code', 'refresh_token'])

  const resourceResponse = await get('https://mcp.konektor.id/.well-known/oauth-protected-resource/mcp/claude')
  assert.equal(resourceResponse.status, 200)
  const resource = await resourceResponse.json()
  assert.equal(resource.resource, config.url)
  assert.deepEqual(resource.authorization_servers, ['https://konektor.id'])
  assert.ok(config.auth.scopes.every(scope => resource.scopes_supported.includes(scope)))

  const authorizationResponse = await get('https://konektor.id/.well-known/oauth-authorization-server')
  assert.equal(authorizationResponse.status, 200)
  const authorization = await authorizationResponse.json()
  assert.equal(authorization.issuer, 'https://konektor.id')
  assert.equal(authorization.authorization_endpoint, 'https://konektor.id/oauth/authorize')
  assert.equal(authorization.token_endpoint, 'https://konektor.id/oauth/token')
  assert.deepEqual(authorization.code_challenge_methods_supported, ['S256'])
  assert.deepEqual(authorization.token_endpoint_auth_methods_supported, ['none'])
  assert.equal(authorization.registration_endpoint, undefined)

  const denied = await get(config.url)
  assert.equal(denied.status, 401, 'Unauthenticated MCP access must fail')
  assert.ok(denied.headers.get('www-authenticate')?.includes('resource_metadata='))
  return { client: 'Cursor / Grok Bot', authentication: 'OAuth with PKCE S256', authenticatedToolsVerified: false }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await verifyOAuth()
    console.log('Public OAuth metadata verified. User login and authenticated tools still require client checks.')
  } catch {
    console.error('Public OAuth verification failed. Check the application release and OAuth metadata. No credentials were requested.')
    process.exitCode = 1
  }
}
