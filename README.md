# FRAME Photography

FRAME is a premium cinematic photography portfolio and studio website built with Next.js App Router. It runs in local mode by default using starter assets from `public/images/`, and can be configured to use Cloudinary + MongoDB for uploaded gallery management.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and configure local values:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Environment setup

The project supports two storage modes through the `PHOTO_STORAGE_MODE` variable:

- `local` (default): uses start images from `public/images/`
- `cloud`: expects MongoDB and Cloudinary credentials to be configured

Example `.env.local` values:

```bash
PHOTO_STORAGE_MODE=local
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AUTH_SECRET=
ADMIN_EMAIL=admin@frame.studio
ADMIN_PASSWORD=change-me
RESEND_API_KEY=
CONTACT_EMAIL=studio@frame.studio
EMAIL_FROM=studio@frame.studio
```

## MongoDB setup

1. Create a MongoDB Atlas database or local MongoDB instance.
2. Add a database user with read/write access.
3. Set `MONGODB_URI` in your environment.
4. The app expects to store photo metadata in a collection such as `photos`.

## Cloudinary setup

1. Create a Cloudinary account and a cloud.
2. Add your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` values.
3. Use a signed upload flow from the server for admin upload actions.
4. When `PHOTO_STORAGE_MODE=cloud`, the app will use Cloudinary URLs and public IDs for gallery delivery.

## Admin access

Set:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

Then visit `/admin/login` to sign in. The dashboard is protected with NextAuth credentials and server-side access checks.

## Contact form

The email form uses Resend when `RESEND_API_KEY` and `CONTACT_EMAIL` are configured. Without those values, the form will fail gracefully and tell visitors the contact feature is unavailable.

## Production deployment

Use Vercel and configure environment variables in the project settings:

- `PHOTO_STORAGE_MODE`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `EMAIL_FROM`

Run:

```bash
npm run build
```

to verify production readiness.

## Deployment checklist

- Confirm local mode works without any cloud secrets.
- Configure `.env.local` or Vercel env vars for cloud mode.
- Set a secure `AUTH_SECRET` and strong admin password.
- Ensure Cloudinary, MongoDB, and Resend credentials are valid in production.
- Verify `/gallery`, `/contact`, and `/admin/login` all render correctly.

## Notes

Local starter images in `public/images/` are for demo purposes and are not intended to be edited or managed through the admin interface in cloud mode.
