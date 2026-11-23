# SADDLE website

The specification and implementation guide at **https://jocki-app.github.io/saddle-website/**. No custom domain is required. Static pages are generated from the versioned v1 reference documents and schemas in `reference/`; `reference/source.json` records the canonical specification revision.

Update from a clean, committed specification checkout with `npm run spec:update -- /path/to/saddle-specification`. Review the pinned revision and reference diff, then commit them together. Both SDKs test the same versioned conformance vectors; the website publishes these vectors and schemas alongside all eight specification chapters.

Run `npm run build`, `npm test`, and `npm run preview`. Output uses relative links so it works below the GitHub Pages repository path. The site supports search, mobile navigation, keyboard access, system themes and an explicit theme toggle.

The Pages workflow deploys when `PAGES_ENABLED=true` and GitHub Actions is configured as the repository's Pages source. The independent canonical source lives in [saddle-specification](https://github.com/jocki-app/saddle-specification).

Licensed under GPL-3.0-only.
