# Konektor

[Bahasa Indonesia](docs/README.id.md) · [Konektor](https://konektor.id) · [Permissions](docs/permissions.md)

Konektor connects Cursor and Grok Bot to your authorized Konektor workspaces through MCP and OAuth.
GROW maintains this plugin in the Growth-Circle GitHub organization.

**Preview:** The package is ready for source review. The new OAuth client requires an application release before authentication can work.
Cursor and Grok Bot login checks and marketplace approval are pending. See the [release checklist](docs/release.md).

Ask for workspace metrics, campaign results, conversion delivery status, WhatsApp tracking, and authorized lead or Inbox data.
The plugin requests read access. It does not request permission to change leads, send messages, or change ad budgets.

## Before you connect

- Use a Konektor account with an owner or admin role in an eligible workspace.
- The workspace must have an active trial or an eligible Starter plan or higher.
- Use a Cursor or Grok Bot version that supports remote MCP and static OAuth configuration.
- A team admin may need to allow the plugin or server.

## Connect

After a marketplace listing is approved, install **Konektor** from Marketplace and select **Authenticate** or **Connect**.
Before listing approval, use the remote configuration below to test the connection.

1. Copy the `konektor` entry from [mcp.json](mcp.json) into your MCP configuration.
2. In Cursor, use `.cursor/mcp.json` for a project or `~/.cursor/mcp.json` for your account.
3. In Grok Bot, add a custom **Remote HTTPS** MCP server.
4. Set the server URL to `https://mcp.konektor.id/mcp/claude`.
5. Set the OAuth client ID to `https://konektor.id/oauth/clients/cursor.json`.
6. Keep the client secret empty.
7. Start authentication and sign in to Konektor in your browser.
8. Review the requested permissions and select the workspaces you want to connect.
9. Select **Allow**. The Indonesian button is **Izinkan**.
10. Ask the agent to list the available Konektor tools.

The client stores OAuth credentials. The package contains no credentials and starts no local server.
You do not need to install Node.js to use the plugin.

## Try it

- “Show lead totals and the conversion funnel for this month.”
- “Which campaign generated the most leads in the last seven days?”
- “Check conversion delivery failures and pending events.”
- “Show ad spend and return on ad spend for this week.”
- “Check whether my workspace tracking is configured.”

For multiple workspaces, select a workspace before you request its data.
For metric questions, the included skill uses aggregate tools and avoids lead or message contents.
Lead and Inbox tools can return personal data when you explicitly request it.

## Revoke access

Open **Settings → API & Webhooks** in Konektor and find **AI Connections**.
Find the **Cursor / Grok Bot** connection and select **Revoke access**.
For multiple workspaces, open the first workspace selected during consent to find and revoke the connection.
Revocation stops the connection. Removing the plugin alone does not revoke the Konektor grant.

Cursor and Grok Bot use the same public client in this package.
A new authorization for the same account and first selected workspace replaces the previous connection.
Reconnect the affected client if its previous connection stops working.

## Connection problems

| Result | Action |
| --- | --- |
| Authentication does not start | Check the server URL and public client ID. Keep the client secret empty. |
| The request is unavailable | Start authentication again. The request may have expired or been used. |
| No workspace is available | Check your owner/admin role and workspace subscription. |
| No tools appear | Complete authentication and refresh the tool list. Check the team connector policy. |
| A tool is missing | Check the requested and granted permissions. This package requests read access. |
| Authentication uses another callback | Check the exact callback against the supported client metadata. Contact the maintainer. |

## Development and release

Node.js 22 or later is required for maintainer checks. The package has no npm dependencies or build step.

```sh
npm run validate
npm test
npm run verify:oauth
```

`verify:oauth` checks live discovery, fixed client metadata, and rejection of unauthenticated requests.
It does not complete a user login or prove authenticated tool execution.
See the [release checklist](docs/release.md) for the remaining application and marketplace checks.

## License

The package code and instructions use the [MIT license](LICENSE).
The Konektor name and logo identify the product. The license does not grant trademark rights.
