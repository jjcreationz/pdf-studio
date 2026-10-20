# JJ Creationz PDF Studio

A browser-based PDF workspace starter for the JJ Creationz brand.

## Features in this starter
- Open and preview a PDF in the browser
- Add text overlays to a selected page
- Download the edited PDF
- Rotate pages and download the result
- Runs locally in the browser; no account or daily task counter is built in

## Important scope note
This first version adds text as an overlay. It does not rewrite the original embedded text in place, and it is not a full replacement for every commercial PDF editor feature. Password-protected, malformed, or very large PDFs may fail depending on browser memory and PDF structure.

## Run locally
Install Node.js (LTS), then in this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Deploy with GitHub Pages
1. Push this folder's contents to a GitHub repository (the `package.json` must be in the repository root).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Add a workflow file at `.github/workflows/deploy.yml` using the workflow in this repository.
5. Wait for the Actions workflow to finish. The live URL appears under Settings → Pages.

This app uses a relative Vite base path so it can run from a GitHub Pages project URL.

## Privacy
PDFs are processed in the browser by this app. Do not add analytics or server uploads unless you intentionally choose to change that behavior.
