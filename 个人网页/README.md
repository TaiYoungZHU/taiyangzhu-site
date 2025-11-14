Advanced static academic site (sample)

How to use:
1. Put this repo on GitHub.
2. In repository settings, add a secret SITE_URL with your site's base url (e.g. https://taiyangzhu.com).
3. Enable GitHub Actions (they are enabled by default).
4. On push, GitHub Actions will run `npm run build` to generate posts/index.json, posts/rss.xml and data/publications.json.
5. Edit /posts/*.md to add blog posts. They must have YAML frontmatter (title, date, tags, summary).
6. Update data/publications.bib for BibTeX entries. The CI will convert it to JSON.

Notes:
- The build scripts use lightweight parsers and support simple BibTeX formats.
- You'll need to `npm install` to run scripts locally.
