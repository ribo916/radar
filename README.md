# Paddle Data Visualization App

This application visualizes pickleball paddle data using [Layer Cake](https://layercake.graphics). It provides multiple data sources and deployment options for flexibility.

## Features

- Visualizes pickleball paddle data from various reviewers
- Deployed on Vercel with automatic updates

## Data Sources

1. **CSV (Default)**: Data loaded directly from CSV files. API implementations were removed as I didn't want to maintain them separately


## Getting Started

### Prerequisites

- Node.js (version X.X.X or higher)
- npm (version X.X.X or higher)

### Installation

```bash
npm install
```

### Running the App

For production:

```bash
npm run build && npm run preview
```

The app will be available at [http://localhost:4173](http://localhost:4173).

For development:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Deployment

The app is deployed using Vercel, which automatically deploys updates when changes are pushed to the `master` branch.

### Live Demos

- [https://paddles.vercel.app/](https://paddles.vercel.app/) 

## Data Update Process

### JohnKew Data

1. Visit [https://www.johnkewpickleball.com/paddle-database](https://www.johnkewpickleball.com/paddle-database)
2. View the page source and locate the `<iframe src="">` tag containing the raw data link
3. Save the data in Google Sheets and download as CSV
4. Update the data processor file

### PBEffect Data

1. Visit [https://pickleballeffect.com/pickleball-paddle-database/](https://pickleballeffect.com/pickleball-paddle-database/)
2. Download the CSV file from the Airtable
3. Update the data processor file

### PBStudio Data

1. Visit PBStudio site and just cut/paste all data from Notion (no option to download a CSV)
2. Paste into Google Sheets, add header data manually, then download as CSV
3. Update the data processor file

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
