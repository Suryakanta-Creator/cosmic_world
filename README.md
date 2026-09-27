# Cosmic World

A futuristic interactive space exploration experience built with React, Vite, TypeScript, Framer Motion and React Three Fiber.

## Deploy on Vercel

1. Import `Suryakanta-Creator/cosmic_world` into Vercel.
2. Add `GEMINI_API_KEY` in **Project Settings → Environment Variables**.
3. Optionally add `GEMINI_MODEL` to override the default model.
4. Deploy.

The Gemini API key stays server-side inside `/api/chat`; it is not bundled into the browser application.

## Local development

```bash
npm install
npm run dev
```

### Notes

- NASA Near-Earth Object screens currently use NASA's public `DEMO_KEY`, which is rate-limited.
- Login/register is a browser-only prototype using localStorage; it is not production authentication.
