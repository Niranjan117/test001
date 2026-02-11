# Bloom - Mapping World's Harvest in Real Time

Bloom is a full-stack agricultural intelligence system that monitors crop distribution across Indian states, predicts market saturation, and gives farmers and officials real-time planting recommendations. It was built by first collecting and training a custom TensorFlow model on regional crop imagery, which is hosted on Hugging Face for optimized cloud inference. This model powers a FastAPI backend deployed on Render, which acts as a central command hub to aggregate real-time supply statistics and simulate live satellite feeds, effectively monitoring market saturation risks. The system culminates in a responsive frontend that integrates a Retrieval-Augmented Generation (RAG) system using the Google Gemini API; this AI advisor dynamically reads the backend's live market data to provide farmers and officials with instant, data-driven planting recommendations, ensuring economic stability and food security.

---

## Features

### Real-Time Satellite Crop Classification
A custom MobileNetV2 model fine-tuned on regional satellite crop imagery classifies what is growing across Indian agricultural zones (Wheat, Rice, Sugarcane, Cotton, Mustard, Pulses, and others) with over 91% accuracy. The model runs inference on demand through the backend and returns crop type with confidence score.

### Live Executive Dashboard
A single-page dashboard with four navigable sections that transforms raw inference data into actionable insights. Quick stats bar shows total registrations, area coverage, average yield, and active crop count. A doughnut chart breaks down crop distribution in real time. The live AI model data table compares real-time inference results against baseline values with smooth animated transitions.

### Market Intelligence and Saturation Monitoring
Two market intelligence cards track supply status (with animated progress bar) and market conditions (with blinking status badges for Stable, Active, or Critical states). Supply levels are calculated from demand distribution data. Per-crop price trends, demand drivers, and market sentiment are displayed and updated from the backend.

### Interactive Choropleth Map of India
A Leaflet.js map coloured by agricultural production output per state. Clicking any state updates the sidebar with region-specific statistics including yield comparisons and growth trends. Supports both light and dark CartoDB tile layers that switch with the theme.

### Weather Intelligence with Animated Icons
CSS-only animated weather icons (sun, clouds, rain, thunderstorm, snow, flurries) built entirely from HTML elements and keyframe animations with no images, icon fonts, or external libraries. Includes current conditions display and a 7-day forecast strip.

### Market Price Prediction Chart
A Chart.js line chart with configurable crop and region selectors that displays current price, 7-day predicted price, and the percentage change. Factors like demand index, weather impact, and supply ratio update dynamically based on selected region.

### Smart Crop Suggestor
An algorithm that scores crops across six dimensions: price trend (0-30), demand level (0-20), ROI potential (0-25), risk tolerance (0-15), water suitability (0-10), and land size fit. Users select their region, season, land size, water availability, and risk tolerance, and the system returns ranked recommendations with confidence scores, reasons, and key insights.

### Bloom AI - RAG-Powered Conversational Assistant
A collapsible chat panel powered by the Google Gemini API with multi-model fallback (gemini-2.5-flash, then 2.0-flash, then 2.0-flash-lite). The system prompt is loaded with current MSP rates for eight major crops, seasonal calendars, regional yield benchmarks for seven states, and government scheme details. Responses are sanitised through a pipeline that strips HTML documents, converts markdown to inline formatting, and normalises bullet points. Falls back to a local keyword-based response generator when all API calls fail.

### Farmer Registration and Registry
A registration form that writes farmer data directly to Firebase Firestore. The dashboard reads from the same collection and displays it in a searchable, sortable table with total, active, and filtered counts.

### Scroll-Driven Landing Page Animation
The landing page uses GSAP and ScrollTrigger to play a 300-frame WebP image sequence as the user scrolls, creating a bloom animation. Navigation panels reveal platform details, solutions, technology stack, and contact information with smooth transitions.

### Theme System
Full light and dark mode support across all three pages with CSS custom properties. Theme toggle uses View Transitions API where available for a smooth circular reveal effect originating from the toggle position.

### Custom SVG Icon System
25+ inline SVG icons built from Lucide-style paths, rendered directly in the DOM with no external icon library or font loading. Icons scale with text and inherit the current colour.

---

## How it was built

### The Model
The deep learning core is a MobileNetV2 architecture fine-tuned with transfer learning on a curated dataset of regional crop satellite imagery. Training involved collecting imagery representative of major Indian agricultural zones, augmenting it for rotation, scale, and lighting variance, then training the classification head on top of MobileNetV2's frozen feature extractor before unfreezing selected layers for fine-tuning. The trained model is hosted on Hugging Face so the backend can pull it on cold start without bundling large binaries.

### The Backend
A FastAPI application deployed on Render that downloads the model from Hugging Face on startup and loads the regional analytics dataset. It exposes endpoints for health checks, dashboard statistics (crop distribution, farmer counts, yield averages, market demand with price trends), live feed simulation (random image classification), and direct image prediction. It also computes derived statistics like supply levels, market status flags, and per-crop trends that the frontend and AI assistant both consume.

### The Frontend
A pure static site built with vanilla HTML, CSS, and JavaScript with no build step. The dashboard alone is roughly 2200 lines of JavaScript handling chart rendering, map interaction, real-time data fetching with polling, animated transitions, the crop suggestor algorithm, and the full AI assistant integration. All sensitive configuration (Firebase credentials, backend URL, Gemini API key) is loaded from a gitignored config file.

### The RAG System
Bloom AI is not a generic chatbot. The "retrieval" component is the live data from the backend combined with structured agricultural knowledge baked into the system prompt (MSP rates, yield benchmarks, scheme details). The "generation" is Gemini synthesising that context into natural-language advice. The system prompt enforces strict formatting rules so responses render cleanly in the chat interface.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Deep Learning Model | TensorFlow, MobileNetV2, Transfer Learning |
| Model Hosting | Hugging Face |
| Backend API | FastAPI (Python), deployed on Render |
| Frontend | Vanilla HTML/CSS/JavaScript |
| Charts | Chart.js |
| Maps | Leaflet.js with CartoDB tile layers |
| Animations | GSAP, ScrollTrigger, CSS keyframe animations |
| Database | Firebase Firestore |
| AI Assistant | Google Gemini API (2.5-flash / 2.0-flash / 2.0-flash-lite) |
| Icons | Custom inline SVG (Lucide-style paths) |

---

## Project Structure

```
index.html              Landing page with scroll-driven bloom animation
dashboard.html          Main intelligence dashboard
register.html           Farmer registration form
css/
  styles.css            Landing page styles
  dashboard.css         Dashboard styles and animated weather icons
  register.css          Registration page styles
js/
  script.js             Landing page interactions and GSAP animations
  flower.js             Scroll-triggered 300-frame image sequence player
  dashboard.js          Dashboard logic, charts, map, AI assistant
  register.js           Registration form with Firestore integration
  config.env.js         API keys and configuration (gitignored)
  config.env.template.js  Template for required config structure
assets/
  imageSequence/        300 WebP frames for landing page animation
```

---

## Running Locally

1. Clone the repository.

2. Copy the config template and fill in your keys:
   ```
   cp js/config.env.template.js js/config.env.js
   ```
   Edit `js/config.env.js` with your Firebase config, backend API URL, and Gemini API key.

3. Serve the site with any static file server:
   ```
   npx serve .
   ```
   ES module imports require an HTTP server. Opening `index.html` via `file://` will not work.

4. The backend must be running and accessible at the URL specified in your config.

---

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service status |
| `/health` | GET | Health check with uptime |
| `/dashboard-stats` | GET | Regional crop analytics, market demand, weather data |
| `/simulate-live-feed` | GET | Random satellite image classification |
| `/predict` | POST | Upload an image for crop classification |

Live backend: `https://bloom-w0r1.onrender.com`

---

## Credits

- **Project Lead:** Niranjan Kandpal
- **Institution:** Veer Madho Singh Bhandari Uttarakhand Technical University, Department of Computer Science and Engineering
- **Weather icon animations:** Inspired by a Dribbble concept by Kylor
- **Map data:** Natural Earth via GeoJSON
- **Tile layers:** CartoDB (light and dark variants)
