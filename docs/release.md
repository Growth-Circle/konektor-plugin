# Release checklist

The package is prepared for review. A local package check does not prove a production connection or marketplace approval.

## Application

- [x] Deploy the fixed public client metadata and resolver.
- [ ] Verify that consent shows Cursor / Grok Bot.
- [x] Run `npm run verify:oauth` against production.
- [ ] Complete OAuth from Cursor with an eligible test workspace.
- [ ] Complete OAuth from Grok Bot with an eligible test workspace.
- [ ] List tools and run one aggregate read in each client.
- [ ] Confirm that write tools are absent from the plugin's read grant.
- [ ] Confirm that an unrelated workspace is inaccessible.
- [ ] Verify token refresh and grant revocation.

## Package

- [x] Run `npm run validate` and `npm test`.
- [ ] Check English and Indonesian guides against the released UI.
- [x] Confirm the public repository contains no credentials or private application code.
- [x] Confirm package version, original logo, publisher GROW, and repository URL.

## Marketplace

- [ ] Submit the repository at https://cursor.com/marketplace/publish.
- [ ] Record the review result and published listing URL.
- [ ] Install the published plugin in Cursor and Grok Bot.
- [ ] Verify authentication and one read from the published package.

## Submission draft

Name: Konektor

Publisher: GROW

Repository: https://github.com/Growth-Circle/konektor-plugin

Website: https://konektor.id

Description: Read Konektor workspace analytics, leads, ads, WhatsApp tracking, and Inbox data through OAuth.

Authentication: Public OAuth client with PKCE S256. No API key or client secret is required.

Permissions: Read access and token refresh. Users select authorized workspaces in Konektor.

Revocation: Settings → API & Webhooks → AI Connections → Cursor / Grok Bot → Revoke access.

Support: Open an issue in the plugin repository. Do not include credentials or member data.

## Preview verification

The package validator and eight package tests passed for version 0.1.0.
[GitHub package checks passed](https://github.com/Growth-Circle/konektor-plugin/actions/runs/37349194131).

The application source passed 187 tests in 27 files and scoped lint checks.
The application build and full type checks also passed.
Independent review checked the OAuth client, callback restrictions, permissions, and package configuration.

The official MCP client SDK passed desktop and cloud callbacks with modern and legacy HTTP protocol negotiation.
These isolated checks cover token exchange, read tools, workspace restrictions, token refresh, and grant revocation.
Claude access and refresh remained valid after Cursor reauthorization and revocation.
The API key route checks also passed.
These checks use fictional accounts and aggregates. They do not prove a production client login.

Cursor CLI recognized Konektor in an isolated project with status `requires_authentication`.
Global MCP settings were not changed.

The application release completed on 6 October 2026.
Production client metadata returned HTTP 200.
OAuth discovery passed for both callbacks. Authorization redirected to Konektor login with HTTP 302.
The checks verified PKCE S256, read scopes, the resource URL, and the login destination.
Previous application secrets and bindings were preserved. The public client was added to the existing allowlist.
No authenticated Cursor or Grok Bot session was verified. No marketplace submission was sent.
