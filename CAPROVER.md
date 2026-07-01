# CapRover — frontend

**Production URL:** https://trizen-dialog.extrahand.in  
(Legacy: https://wa-dialog-frontend.backend.extrahand.in)

CORS / backend config uses the **origin only** — not `/login` or other paths.

## Env vars (CapRover UI only — Save & Restart, no rebuild)

| Variable | Production value |
|----------|------------------|
| `VITE_API_URL` | `https://wa-dialog-backend.backend.extrahand.in/api/v1` |

## Backend CORS (required)

On the **backend** CapRover app (`wa-dialog-backend`):

```env
CORS_ORIGIN=https://trizen-dialog.extrahand.in
```

If you still use the old frontend hostname too:

```env
CORS_ORIGIN=https://trizen-dialog.extrahand.in,https://wa-dialog-frontend.backend.extrahand.in
```

Restart the **backend** after changing CORS (Save & Restart). Full guide: `../dialog-backend/CAPROVER.md`
