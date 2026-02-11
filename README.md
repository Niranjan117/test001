# Bloom -- Mapping World's Harvest in Real Time

Bloom is a full-stack agricultural intelligence system that monitors crop distribution across Indian states, predicts market saturation, and gives farmers and officials real-time, data-driven planting recommendations. It was built as a working prototype to demonstrate how deep learning, live data pipelines, and generative AI can be combined into a single decision-support tool that actually runs end to end -- from satellite image classification all the way to a conversational advisor that reads live market feeds.

---

## What the project does

The core problem is straightforward: when too many farmers in a region plant the same crop, prices crash at harvest. When too few plant a staple, shortages follow. Traditional surveying is slow and manual. Bloom automates this loop.

A custom TensorFlow image classification model scans regional crop imagery and identifies what is growing where -- Wheat, Rice, Sugarcane, Cotton, Mustard, Pulses, and others -- with over 91% accuracy. That model feeds a FastAPI backend that aggregates the classifications into regional statistics, simulates a live satellite feed, and tracks market demand signals. The frontend dashboard then renders all of this as interactive charts, a choropleth map of India, animated weather widgets, a 7-day price prediction engine, and a smart crop suggestor that scores recommendations by price trend, demand, ROI, risk, and water availability.

On top of all that sits Bloom AI, a conversational assistant powered by the Google Gemini API. It is not a generic chatbot. It operates as a Retrieval-Augmented Generation system: it reads the backend's live market data, current MSP rates, regional yield figures, and government scheme details, then synthesises that into specific, actionable answers when a farmer asks something like "What should I plant this Rabi season in Haryana?"

---

## How it was built

### The model

The deep learning core is a MobileNetV2 architecture fine-tuned with transfer learning on a curated dataset of regional crop satellite imagery. MobileNetV2 was chosen for its balance between inference speed and accuracy -- it needs to run in the cloud without expensive GPU instances. The trained model is hosted on Hugging Face, which lets the backend pull it on cold start without bundling large binaries into the deployment.

Training involved collecting crop imagery representative of major Indian agricultural zones, augmenting it for rotation, scale, and lighting variance, and then training the classification head on top of MobileNetV2's frozen feature extractor before unfreezing selected layers for fine-tuning. The final model classifies input images into crop categories and outputs a confidence score.

### The backend

The backend is a FastAPI application deployed on Render. It serves as the central data hub for the entire system. On startup, it downloads the model from Hugging Face and loads the regional analytics dataset. It exposes several endpoints:

- `/health` -- Returns service status and uptime.
- `/dashboard-stats` -- Returns aggregated regional crop distribution, farmer registration counts, yield averages, and market demand data with price trends.
- `/simulate-live-feed` -- Picks a random image from the dataset, runs it through the model, and returns the classification result with confidence score, simulating what a real satellite feed integration would look like.
- `/predict` -- Accepts an uploaded image and returns the model's classification and confidence.

The backend also computes derived statistics: supply levels based on demand distribution, market status flags (Stable, Active, Critical), and per-crop price trends. These computed values are what the frontend's market intelligence cards and the AI assistant both consume.

CORS is enabled for all origins to support the frontend deployment on a separate domain (Vercel).

### The frontend

The frontend is a pure static site -- vanilla HTML, CSS, and JavaScript with no build step. It is structured for direct deployment on Vercel:

```
index.html              Landing page with scroll-driven image sequence animation
dashboard.html          Main intelligence dashboard
register.html           Farmer registration form (writes to Firebase Firestore)
css/
  styles.css            Landing page styles
  dashboard.css         Dashboard styles (3300+ lines including animated weather icons)
  register.css          Registration page styles
js/
  script.js             Landing page interactions and GSAP animations
  flower.js             Scroll-triggered image sequence player (300 frames)
  dashboard.js          Dashboard logic, charts, map, AI assistant (~2200 lines)
  register.js           Registration form handler with Firestore integration
  config.env.js         API keys and configuration (gitignored)
  config.env.template.js  Template showing required config structure
assets/
  imageSequence/        300 WebP frames for the landing page bloom animation
vercel.json             Vercel deployment config with caching and clean URL rewrites
```

The landing page uses GSAP and ScrollTrigger to play a 300-frame image sequence as the user scrolls, creating a bloom animation that sets the visual tone for the product.

The dashboard is the operational core. It is a single-page application with four sections navigated via a sidebar:

**Main Dashboard** -- Displays quick stats (total registrations, area coverage, average yield, crop count), a doughnut chart of crop distribution, a live AI model data table comparing real-time inference results against baseline, and market intelligence cards showing supply status and market conditions with animated status badges.

**Regional Analysis** -- Features an interactive Leaflet.js choropleth map of India coloured by agricultural production output per state. Clicking a state updates the sidebar with that region's specific statistics. Includes yield comparison bar charts and growth trend visualisations.

**Analytics** -- Contains the weather intelligence section with CSS-only animated weather icons (sun, clouds, rain, thunderstorm, snow, flurries -- each built entirely from HTML and CSS keyframe animations, no images or icon fonts), a 7-day forecast display, a market price prediction chart using Chart.js with configurable crop and region selectors, and the smart crop suggestor.

**Farmer Registry** -- Pulls registration data from Firebase Firestore and displays it in a searchable, sortable table with statistics.

### The AI assistant

Bloom AI lives in a collapsible panel on the dashboard. It first attempts to call the Google Gemini API (trying gemini-2.5-flash, then 2.0-flash, then 2.0-flash-lite as fallbacks). The system prompt is dense and specific: it includes current MSP rates for eight major crops, seasonal calendars, regional yield benchmarks for seven states, government scheme details, and strict formatting rules.

The assistant processes Gemini's response through a sanitisation pipeline that strips any full HTML documents the model might return, converts markdown to inline formatting, and normalises bullet points. If all API calls fail (rate limits, network issues), it falls back to a local response generator that provides cached but still useful answers based on keyword matching.

This is effectively a RAG setup: the "retrieval" component is the live data from the backend and the structured knowledge baked into the system prompt, and the "generation" is Gemini synthesising that into natural-language advice.

### Data and authentication

Farmer registration data is stored in Firebase Firestore. The registration form on the frontend writes directly to Firestore using the Firebase JS SDK. The dashboard reads from the same collection to populate the farmer registry table.

All sensitive configuration -- Firebase credentials, the backend API URL, and the Gemini API key -- lives in `js/config.env.js`, which is excluded from version control via `.gitignore`. A template file (`js/config.env.template.js`) documents the required structure so anyone cloning the repo can set up their own keys.

---

## Technology stack

| Layer | Technology |
|-------|-----------|
| Deep learning model | TensorFlow, MobileNetV2, transfer learning |
| Model hosting | Hugging Face |
| Backend API | FastAPI (Python), deployed on Render |
| Frontend | Vanilla HTML/CSS/JavaScript, no build step |
| Frontend hosting | Vercel |
| Charts | Chart.js |
| Maps | Leaflet.js with CartoDB tile layers |
| Animations | GSAP, ScrollTrigger, CSS keyframe animations |
| Database | Firebase Firestore |
| AI assistant | Google Gemini API (2.5-flash / 2.0-flash / 2.0-flash-lite) |
| Icon system | Custom inline SVG icons (Lucide-style paths) |

---

## Running locally

1. Clone the repository.

2. Copy the config template and fill in your keys:
   ```
   cp js/config.env.template.js js/config.env.js
   ```
   Edit `js/config.env.js` with your Firebase config, backend API URL, and Gemini API key.

3. Serve the site with any static file server. For example:
   ```
   npx serve .
   ```
   Or use the VS Code Live Server extension. Note that ES module imports require an HTTP server -- opening `index.html` via `file://` will not work.

4. The backend must be running and accessible at the URL specified in your config. The backend repository contains its own setup instructions.

---

## Deploying to Vercel

The project is configured for zero-config Vercel deployment:

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Set the root directory to the repository root (where `vercel.json` lives).
4. No build command or output directory is needed -- Vercel serves the static files directly.
5. Make sure `js/config.env.js` is present in your deployment (either committed to a private repo or injected during build).

The `vercel.json` file configures:
- Clean URLs (`.html` extensions are stripped automatically).
- Aggressive caching for assets (1 year for images, 1 day for CSS and JS).
- Rewrites so `/dashboard` and `/register` resolve to their respective HTML files.

---

## Backend API

The FastAPI backend is deployed separately on Render. Its endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service status |
| `/health` | GET | Health check with uptime |
| `/dashboard-stats` | GET | Regional crop analytics, market demand, weather data |
| `/simulate-live-feed` | GET | Random satellite image classification (simulated feed) |
| `/predict` | POST | Upload an image for crop classification |

Live backend: `https://bloom-w0r1.onrender.com`

---

## Project structure rationale

Every architectural decision was made to keep the system simple enough to actually deploy and maintain as a student project, while still demonstrating a real end-to-end pipeline:

- Vanilla JS instead of React or Vue because there is no build step to debug, no node_modules to manage, and Vercel serves it instantly.
- MobileNetV2 instead of a larger model because it runs on Render's free tier without timing out on inference.
- Hugging Face for model hosting instead of bundling weights because it keeps the backend repository small and the cold start manageable.
- Firebase Firestore for farmer data because it provides a free tier with real-time capabilities and requires zero server-side database setup.
- Inline SVG icons instead of an icon library because it eliminates external dependencies and renders instantly without font loading delays.
- CSS-only animated weather icons instead of Lottie or GIF files because they scale perfectly, respect the colour theme, and add zero payload.

---

## Credits

- **Project Lead:** Niranjan Kandpal
- **Institution:** Veer Madho Singh Bhandari Uttarakhand Technical University, Department of Computer Science and Engineering
- **Weather icon animations:** Inspired by a Dribbble concept by Kylor
- **Map data:** Natural Earth via GeoJSON
- **Tile layers:** CartoDB (light and dark variants)

---

## License

This project was built for academic purposes. If you want to use or adapt any part of it, go ahead -- just mention where it came from.
