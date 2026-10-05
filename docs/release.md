# Release checklist

The package is prepared for review. A local package check does not prove a production connection or marketplace approval.

## Application

- [ ] Deploy the fixed public client metadata and resolver.
- [ ] Verify that consent shows Cursor / Grok Bot.
- [ ] Run `npm run verify:oauth` against production.
- [ ] Complete OAuth from Cursor with an eligible test workspace.
- [ ] Complete OAuth from Grok Bot with an eligible test workspace.
- [ ] List tools and run one aggregate read in each client.
- [ ] Confirm that write tools are absent from the plugin's read grant.
- [ ] Confirm that an unrelated workspace is inaccessible.
- [ ] Verify token refresh and grant revocation.

## Package

- [ ] Run `npm run validate` and `npm test`.
- [ ] Check English and Indonesian guides against the released UI.
- [ ] Confirm the public repository contains no credentials or private application code.
- [ ] Confirm package version, original logo, publisher GROW, and repository URL.

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
