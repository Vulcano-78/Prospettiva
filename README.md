This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment variables

Copy `.env.example` to `.env.local` for development. The relevant variables are:

| Variable | Required | Description |
|---|---|---|
| `OPENAPI_TOKEN` | yes | Bearer token for the Openapi.it catasto API. Server-side only — never exposed to the browser. |
| `OPENAPI_CATASTO_BASE_URL` | no | Base URL of the catasto provider. Defaults to the sandbox `https://test.catasto.openapi.it` when unset (with a server log warning). Set to `https://catasto.openapi.it` for production. |

The territorio (province / comuni) lookups are proxied server-side through `/api/catasto/territorio` and `/api/catasto/territorio/[provincia]`, which read both variables. The token never reaches the client bundle.

To configure on Vercel: Project Settings → Environment Variables → add `OPENAPI_CATASTO_BASE_URL` (Production = `https://catasto.openapi.it`, Preview/Development = sandbox URL or leave empty), then redeploy.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
