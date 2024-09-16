# Intro

This app was started with a sample project for [Layer Cake](https://layercake.graphics). 


## Key Notes
- Data comes from a csv that is just a cut/paste directly from the JohnKew side. Original code was written using a custom version, so I implemented a dataprocessor.js file to read the real raw data and translate after I migrated to that. 
- As another example, the .csv was also loaded into Airtable, as well as Xano, which both support APIs to get data.  
    - Default - just load data from the .csv in the codebase
    - Airtable - This api can only return 100 records, so we loop through using pagintion to ensure we get all data
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

## How was this deployed

The app was deployed using a free Vercel account. It reads the github repo and auto deploys ever time the master branch is updated. 

https://paddles.vercel.app/ - reads from the .csv
https://paddles.vercel.app/?useAirtable=true - read paddle data from Airtable API
https://paddles.vercel.app/?useXano=true - read paddle data from Xano API

