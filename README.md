# 01_Odd-School (ai Make) v3

## Overview
This repository contains the production-ready source code for the 01_Odd-School (ai Make) v3 web application. It packages the existing interface into a runnable product while preserving the original behavior.

## Tech Stack
- [Vite](https://vitejs.dev/) for fast development tooling.
- [React 18](https://react.dev/) with TypeScript for the client application.
- [Radix UI](https://www.radix-ui.com/) primitives and supporting libraries for accessible components.

## Local Setup
1. Install Node.js 18 or later.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables
Create a `.env` file based on `.env.example`. Vite exposes variables prefixed with `VITE_` to the client. No variables are required by default, but you can add project-specific values as needed.

## Scripts
- `npm run dev`: Start the local development server.
- `npm run build`: Generate a production build in the `dist` directory.

## Project Structure
- `src/`: Application source code, including pages, components, and styles.
- `index.html`: Vite entry HTML file.
- `vite.config.ts`: Vite configuration.
- `package.json`: Project metadata and scripts.

## Design
The UI follows the 01_Odd-School design system. Visuals were originally authored in Figma and have been implemented here for production use.
