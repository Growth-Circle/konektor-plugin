import assert from 'node:assert/strict'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export async function validatePackage(root = ROOT) {
  const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'))
  const manifest = await json('.cursor-plugin/plugin.json')
  const packageInfo = await json('package.json')
  assert.equal(manifest.name, 'konektor', 'Use the registered plugin name')
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/u, 'Use a release version')
  assert.equal(manifest.version, packageInfo.version, 'Package versions must match')
  assert.equal(manifest.author?.name, 'GROW', 'Use publisher GROW')
  assert.equal(manifest.homepage, 'https://konektor.id')
  assert.equal(manifest.repository, 'https://github.com/Growth-Circle/konektor-plugin')
  assert.equal(manifest.license, 'MIT')
  assert.ok(manifest.description?.length > 0 && manifest.description.length <= 160)
  assert.deepEqual(manifest.skills, ['skills/konektor'])
  assert.equal(manifest.mcpServers, 'mcp.json')
  for (const path of [manifest.logo, manifest.mcpServers, ...manifest.skills]) {
    assert.equal(typeof path, 'string')
    assert.ok(!path.startsWith('/') && !path.split(/[\\/]/u).includes('..'), 'Use safe relative asset paths')
    const absolute = resolve(root, path)
    assert.ok(absolute.startsWith(resolve(root) + sep))
    assert.equal((await lstat(absolute)).isSymbolicLink(), false, 'Package paths must not be symlinks')
  }

  const config = await json('mcp.json')
  assert.deepEqual(Object.keys(config), ['mcpServers'])
  assert.deepEqual(Object.keys(config.mcpServers), ['konektor'])
  const server = config.mcpServers.konektor
  assert.deepEqual(Object.keys(server).sort(), ['auth', 'url'])
  assert.equal(server.url, 'https://mcp.konektor.id/mcp/claude')
  assert.deepEqual(Object.keys(server.auth).sort(), ['CLIENT_ID', 'scopes'])
  assert.equal(server.auth.CLIENT_ID, 'https://konektor.id/oauth/clients/cursor.json')
  const scopes = [
    'agent.workspace.read', 'agent.analytics.read', 'agent.leads.read',
    'agent.conversions.read', 'agent.ads.read', 'agent.rotators.read',
    'agent.inbox.read', 'agent.rules.read', 'agent.agentic.read', 'offline_access',
  ]
  assert.deepEqual(server.auth.scopes, scopes, 'Request the reviewed read permission set')
  assert.deepEqual(Object.keys(packageInfo.dependencies ?? {}), [])
  assert.deepEqual(Object.keys(packageInfo.devDependencies ?? {}), [])

  const skill = await readFile(resolve(root, 'skills/konektor/SKILL.md'), 'utf8')
  assert.match(skill, /^---\nname: konektor\ndescription: .+\n---\n/u)
  assert.ok(skill.includes('aggregate tools'))
  assert.ok(skill.includes('Never request a password, API key, or OAuth token in chat.'))

  let fileCount = 0
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (['.git', 'node_modules', '.local'].includes(entry.name)) continue
      const path = resolve(directory, entry.name)
      assert.equal(entry.isSymbolicLink(), false, 'Package files must not be symlinks')
      assert.ok(!/^\.env(?:\.|$)|^\.dev\.vars|\.(?:pem|key)$/u.test(entry.name), 'Credential files must not be packaged')
      if (entry.isDirectory()) await inspect(path)
      else {
        fileCount++
        const source = await readFile(path, 'utf8')
        assert.ok(!/knc_(?:at|rt)_[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u.test(source), 'Credential material must not be packaged')
        if (entry.name.endsWith('.md')) {
          for (const match of source.matchAll(/\]\(([^)]+)\)/gu)) {
            const target = match[1].split('#')[0]
            if (!target || /^[a-z][a-z\d+.-]*:/iu.test(target)) continue
            const linkPath = resolve(dirname(path), target)
            assert.ok(linkPath.startsWith(resolve(root) + sep), 'Documentation links must stay inside the package')
            await lstat(linkPath)
          }
        }
      }
    }
  }
  await inspect(root)
  return { version: manifest.version, fileCount }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await validatePackage()
    console.log(`Package valid: Konektor ${result.version}, ${result.fileCount} files, read-only OAuth configuration.`)
  } catch {
    console.error('Package validation failed. Check manifests, permissions, paths, and package files.')
    process.exitCode = 1
  }
}
