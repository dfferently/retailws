# Create app

This is a code bundle for Create app. The original project is available at https://www.figma.com/design/zqVdS1QzxrV5GDLobUwUXo/Create-app.

## Package manager policy

This project is **npm-only**. Use npm for dependency installation and scripts to keep `package-lock.json` authoritative.

## Quick Start

Use the app only through the Vite dev server:

`npm install` → `npm run dev` → open `http://localhost:5173`

> ⚠️ Не открывать `index.html` напрямую из проводника.
>
> Запуск через `file://.../index.html` **не поддерживается**. Entry point for Vite remains `/src/main.tsx` in `index.html`.

## Running the code

Run `npm install` to install the dependencies.

Run `npm run dev` to start the development server.
## Prerequisites

Before you start, make sure you have installed:

- **Node.js 20 LTS** (recommended)
- **npm** (comes with Node.js)

## Run from scratch

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

## Production check

Build the project for production:

```bash
npm run build
```

## Troubleshooting

### Error: `Cannot find module 'react'` / `Cannot find module 'react-dom'`

This usually means dependencies were not installed correctly.

Run:

```bash
npm install
```

### Dependency conflict: clean install

If you have dependency conflicts or corrupted local modules:

1. Remove installed modules and lockfile:

   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:

   ```bash
   npm install
   ```
