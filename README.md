# LE Curriculum 2570

Logistics Engineering curriculum website for Kalasin University. The site includes the OBE alluvial diagrams, curriculum maps, course catalog, and IE and SC study plans.

## Run with Docker

```sh
docker build -t le-curriculum2570 .
docker run --rm -p 127.0.0.1:4173:4173 le-curriculum2570
```

Open http://localhost:4173/obe#alluvial for the OBE diagrams.

## Local development

```sh
npm ci --prefix web
npm run dev --prefix web
```

Run `npm run build --prefix web` to generate the static site in `web/dist`. The build reads `data/curriculum.json` and the curriculum issues register.
