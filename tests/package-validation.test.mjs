import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { ROOT, validatePackage } from '../scripts/validate.mjs'

async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), 'konektor-plugin-test-'))
  try {
    await cp(ROOT, root, { recursive: true, filter: path => !path.includes('/.git') })
    await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('rejects write access and credential fields in remote configuration', async () => {
  for (const change of [
    server => server.auth.scopes.push('agent.ads.write'),
    server => { server.auth.CLIENT_SECRET = 'synthetic-test-value' },
    server => { server.headers = { Authorization: 'synthetic-test-value' } },
  ]) await fixture(async root => {
    const path = join(root, 'mcp.json')
    const config = JSON.parse(await readFile(path, 'utf8'))
    change(config.mcpServers.konektor)
    await writeFile(path, JSON.stringify(config))
    await assert.rejects(validatePackage(root))
  })
})

test('rejects credential files and symlinks', async () => {
  await fixture(async root => {
    await writeFile(join(root, '.env'), 'SYNTHETIC_TEST=example')
    await assert.rejects(validatePackage(root))
  })
  await fixture(async root => {
    await symlink('/tmp', join(root, 'external'))
    await assert.rejects(validatePackage(root))
  })
})

test('rejects broken documentation links', async () => {
  await fixture(async root => {
    await writeFile(join(root, 'docs', 'broken.md'), '[Guide](missing.md)\n')
    await assert.rejects(validatePackage(root))
  })
})
