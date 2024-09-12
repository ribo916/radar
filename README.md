# Layer Cake Example

This is a starter example for using [Layer Cake](https://layercake.graphics). It sets you up with the line and area chart as seen [in the examples](https://layercake.graphics/example/Line). It uses [SvelteKit](https://kit.svelte.dev/docs/) and so the file structure and file naming conventions come from there.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit mhkeller/layercake-template my-chart
cd my-chart
```

_Note that you will need to have [Node.js](https://nodejs.org) installed._

## Key Notes

- csv (default) is just a cut/paste directly from the JohnKew side. Original code was written using a custom version, so I implemented a dataprocessor.js file to read the real raw data and translate it to my needs
- Airtable can only return 100 records, so we loop through using pagintion to get all 250-ish records
- Xano returns all records we require, but mapping is slightly different

## Get started

Install the dependencies...

```bash
npm install
npm run build && npm run preview
```

Your app will be running at [localhost:4173](http://localhost:4173).

## Developing

```sh
# if you didn't already install, run the install command
npm install
npm run dev
```

Your app will be running at [localhost:5173](http://localhost:5173).
