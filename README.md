# Key Notes
- This started as an example for using [Layer Cake](https://layercake.graphics).
- Data comes from a csv that is just a cut/paste directly from the JohnKew side. Original code was written using a custom version, so I implemented a dataprocessor.js file to read the real raw data and translate it to my needs. Can also use a query parameter (useAirtable=true, useXano=true) to have data loaded via API instead of the csv. 
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
