# div styler

A tool for styling a single `div` element.

## Local development

The simplest approach is to open `index.html` directly in your browser — no server needed.

### With Node

To run locally with the Node server:

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000).

### With Docker

```bash
docker compose up --build
```

Then open [http://localhost:8080](http://localhost:8080).

To stop:

```bash
docker compose down
```

## Deployment

The app is hosted on Heroku and deploys automatically when changes are pushed to the `main` branch via the GitHub integration.
