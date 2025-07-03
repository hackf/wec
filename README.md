# Windsor Essex Cycling

Cycling app for for the Windsor-Essex region, Pelee Island, and the Detroit riverside.

## Development

> [!NOTE]
> Requires the current [Node.JS LTS version](https://nodejs.org/en/download) to be installed

This project uses [Vite](https://vite.dev/guide/features.html) for the development environment and building the projection build.

### API Keys

This code base uses [GraphHopper](https://www.graphhopper.com/developers/) for routing and geocoding. GraphHopper has a generous free tier which works well for development.

The API key is set using environment variables, create the file `.env.local` in the project root with the following content:

```env
VITE_APP_API_KEY=<api_key>
```

> [!NOTE]
> See [vite env variables and modes](https://vite.dev/guide/env-and-mode.html) for more information.

### Running the project

```bash
npm ci
npm run dev
# or
npx vite
```
