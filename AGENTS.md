# TrizenDialog Frontend

WhatsApp notification operations console for `trizendialog-backend`.

## Rule zero — don't invent patterns

Before creating a new pattern, utility, hook, component, or error-handling style:

1. Search the codebase
2. Reuse the existing pattern
3. Consistency beats local optimization

## Governance (frozen — 5 files)

| File | Owns |
|------|------|
| `.cursor/rules/frontend-architecture.mdc` | State ownership, feature layout, import direction, permissions, feature flags |
| `.cursor/rules/frontend-ui.mdc` | Pages, components, forms, tables, routing, accessibility |
| `.cursor/rules/frontend-query.mdc` | Query client, keys, mutations, URL state, debounce, polling |
| `.cursor/rules/frontend-resilience.mdc` | Graceful degradation, error/empty states, error boundaries |
| `.cursor/rules/frontend-standards.mdc` | Formatting, React hygiene, security, review checklist |

## Reference implementations

| Pattern | File |
|---------|------|
| List page (4 states) | `features/templates/pages/TemplatesPage.tsx` |
| CRUD + mutations | `features/notification-rules/pages/NotificationRulesPage.tsx` |
| Secret-once flow | `features/api-keys/components/ApiKeySecretDialog.tsx` |
| Dashboard (progressive) | `features/dashboard/pages/OverviewPage.tsx` |
| Mutation + toast | `features/templates/hooks/useSyncTemplates.ts` |
| Cross-feature data | `hooks/use-whatsapp-accounts.ts` |
| Permissions | `lib/permissions.ts` |
| Admin route guard | `features/auth/guards/AdminRoute.tsx` |

## Stack

- React 19, React Router 7, TanStack Query 5, TanStack Table 8
- React Hook Form + Zod, shadcn/ui, Tailwind CSS 4, Vite 8

## State ownership

| State | Owner |
|-------|--------|
| Server state | TanStack Query |
| Session | Auth Context + Query (`/auth/me`) |
| Local UI | `useState` |
| Cross-page UI | Zustand (rare) |

## Development

```bash
cp .env.example .env
npm install
npm run dev
```

Default API: `http://localhost:4010/api/v1`

### Browse screens without login (dev only)

Set in `.env`:

```text
VITE_DEV_MOCK_AUTH=true
```

Then `npm run dev` — you'll be signed in as a mock **admin** and can open any route directly (`/overview`, `/templates`, `/whatsapp`, etc.). New routes work automatically; no login needed.

- Only active under `npm run dev` — production builds ignore this flag
- API panels show error/empty states if the backend is down (no redirect to login)
- Amber banner at top indicates mock auth is on

## Deployment

Set `VITE_API_URL` at build time. Ensure backend CORS includes your frontend origin.

## Shared utilities

| Utility | Path |
|---------|------|
| `useDebouncedValue` | `src/hooks/use-debounced-value.ts` |
| `useTableParams` | `src/hooks/use-table-params.ts` |
| `useWhatsAppAccounts` | `src/hooks/use-whatsapp-accounts.ts` |
| `useTemplateOptions` | `src/hooks/use-template-options.ts` |
| `usePhoneNumberOptions` | `src/hooks/use-phone-number-options.ts` |
| Permissions | `src/lib/permissions.ts` |
| Feature flags | `src/config/features.ts` |
| Formatting | `src/lib/format/` |
| Mutation toasts | `src/lib/mutation-toast.ts` |
| API errors | `src/lib/api-error.ts` |
| `QueryErrorPanel`, `EmptyState`, `InlineError` | `src/components/shared/` |
| `RouteErrorBoundary` | `src/components/shared/RouteErrorBoundary.tsx` |

## Structure

```text
src/
  app/           # queryClient, router, App
  config/        # feature flags
  features/      # Domain modules
  components/    # layout + shared + ui
  hooks/         # Cross-cutting hooks only
  lib/           # api-client, permissions, format, errors
  types/         # Shared API types
```
