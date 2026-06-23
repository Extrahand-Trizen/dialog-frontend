# CapRover — frontend

**Production URL:** https://wa-dialog-frontend.backend.extrahand.in  
(CORS / config uses the **origin only** — not `/login` or other paths.)

## Env vars (CapRover UI only — Save & Restart, no rebuild)

| Variable | Production value |
|----------|------------------|
| `VITE_API_URL` | `https://wa-dialog-backend.backend.extrahand.in/api/v1` |

## Backend CORS (required)

On the **backend** CapRover app:

```env
CORS_ORIGIN=https://wa-dialog-frontend.backend.extrahand.in
```

Restart backend after changes. Full guide: `../trizendialog-backend/CAPROVER.md`
