# Frontend Apps

Two Angular apps live here:

- `customer` - public booking site
- `admin` - salon owner dashboard

This folder is a full Angular workspace with two runnable apps.

## Run Locally

```bash
cd frontend
npm install
npm run start:customer
```

Admin app:

```bash
npm run start:admin
```

You can also use Angular CLI directly:

```bash
npx ng serve customer
npx ng serve admin
```

Update API base URLs in:

- `frontend/customer/src/environments/environment.ts`
- `frontend/admin/src/environments/environment.ts`

Note: Older per-app `package.json` files remain for reference but are not required when using the workspace at `frontend/`.
