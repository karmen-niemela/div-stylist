# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK was installed and configured in `server.js` with environment variables for the API key and host. The server now tracks page views when the homepage is served, captures file-serve exceptions with full error context, and shuts down cleanly on SIGINT/SIGTERM to flush pending events. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header (for client/server correlation) and falls back to the client's IP address.

| Event | Description | File |
|---|---|---|
| `page_viewed` | Fired when a visitor loads the DivStylist homepage. Includes `$current_url`, `$referrer`, `$user_agent`, and `$session_id` (when present via `X-POSTHOG-SESSION-ID` header). | `server.js` |
| `$exception` (via `captureException`) | Fired when the server fails to read a requested file. Includes the request URL and path as additional context. | `server.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/156119/dashboard/612097
- **Insight — Page Views & Unique Visitors:** https://eu.posthog.com/project/156119/insights/P1pL7Q3R
- **Insight — Page Views by Referrer:** https://eu.posthog.com/project/156119/insights/YW2zswNS
- **Insight — Server Errors Over Time:** https://eu.posthog.com/project/156119/insights/NVWg0Fzz

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
