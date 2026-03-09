# div styler

A tool for styling a single `div` element.

## Local development

The simplest approach is to open `index.html` directly in your browser — no server needed.

### Docker (nginx)

To run locally with the same nginx setup used in production-like environments:

```bash
docker compose up --build
```

Then open [http://localhost:8080](http://localhost:8080).

To stop:

```bash
docker compose down
```

The Docker setup uses nginx with gzip compression, static asset caching, and security headers (see `nginx.conf`).

## Deployment

This is a static site with no build step. To deploy on Vercel:

1. Push the repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Vercel auto-detects it as a static site — leave the build command and output directory blank
4. Deploy

Vercel will ignore the Docker/nginx files and serve `index.html` directly.
