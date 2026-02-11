import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import CONFIG from './config.js';

const app = initializeApp(CONFIG.firebase);
const db = getFirestore(app);

function svgIcon(name, size = 16) {
	const paths = {
		wheat: '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/>',
		'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
		'trending-down': '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
		target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
		zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
		shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
		'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
		package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
		sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
		trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
		'chart-line': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
		'cloud-sun': '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
		flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
		coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
		droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
		tree: '<path d="M12 22v-7l-2-2"/><path d="M17 8v.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0Z"/><path d="m14 14-2 2"/>',
		building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
		leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s-4.7 9.8-2.7 15.5A7 7 0 0 1 11 20Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
		sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
		grain: '<path d="M2 22 16 8"/><circle cx="17" cy="4" r="2"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>',
		flower: '<circle cx="12" cy="12" r="3"/><path d="M12 2a4.5 4.5 0 0 0 0 9"/><path d="M12 2a4.5 4.5 0 0 1 0 9"/><path d="M22 12a4.5 4.5 0 0 0-9 0"/><path d="M22 12a4.5 4.5 0 0 1-9 0"/><path d="M12 22a4.5 4.5 0 0 0 0-9"/><path d="M12 22a4.5 4.5 0 0 1 0-9"/><path d="M2 12a4.5 4.5 0 0 0 9 0"/><path d="M2 12a4.5 4.5 0 0 1 9 0"/>',
		cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
		corn: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
		circle: '<circle cx="12" cy="12" r="10"/>',
		map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
		clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
		'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
		'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
		hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 13"/>',
	};
	return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
}

const BACKEND_API = CONFIG.backendApi;
let farmersData = [];
const regionData = {
	national: { agricultural: 45.2, forest: 28.5, urban: 18.3, water: 8.0 }
};

let currentRegion = 'national';
let landUseChart, regionalChart, yieldChart, growthChart, priceChart;
let currentSection = 'dashboard';
let liveFeedInterval = null;
let liveFeedRetries = 0;
const MAX_RETRIES = 3;
let isDataLoaded = false;

const PLACEHOLDER_DATA = {
	stats: {
		total_registrations: 4215,
		total_area_hectares: 7240,
		average_yield: 3.6,
		crop_distribution: {
			Wheat: 42,
			Rice: 18,
			Mustard: 16,
			Sugarcane: 12,
			Pulses: 8,
			Others: 4
		}
	},
	live_feed: {
		detected_crop: 'Wheat',
		confidence_score: 0.94,
		location: 'Ludhiana, Punjab',
		timestamp: new Date().toLocaleTimeString()
	},
	weather: {
		temp: 18,
		humidity: 58,
		windSpeed: 8,
		rainfall: 2,
		soilMoisture: 68,
		desc: 'Cool & Clear',
		icon: '🌤️'
	}
};

async function checkSystemHealth() {
	try {
		const response = await fetch(`${BACKEND_API}/health`, {
			method: 'GET',
			timeout: 5000
		});
		
		if (response.ok) {
			updateHealthStatus(true);
			return true;
		} else {
			updateHealthStatus(false);
			return false;
		}
	} catch (error) {
		console.error('Health check failed:', error);
		updateHealthStatus(false);
		return false;
	}
}

function updateHealthStatus(isHealthy) {
	const indicator = document.getElementById('healthStatus');
	if (indicator) {
		if (isHealthy) {
			indicator.classList.add('active');
			indicator.style.backgroundColor = '#22c55e';
		} else {
			indicator.classList.remove('active');
			indicator.style.backgroundColor = '#ef4444';
		}
	}
}

async function fetchDashboardStats(retryCount = 0) {
	try {
		const response = await fetch(`${BACKEND_API}/dashboard-stats`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		
		const data = await response.json();
		updateDashboardStats(data);
		updateDataFeedStatus(true);
		isDataLoaded = true;
		return data;
	} catch (error) {
		console.error('Dashboard stats error:', error);
		if (retryCount < MAX_RETRIES) {
			console.log(`Retrying dashboard stats (${retryCount + 1}/${MAX_RETRIES})...`);
			setTimeout(() => fetchDashboardStats(retryCount + 1), 2000);
		} else {
			updateDataFeedStatus(false);
		}
	}
}

function updateDashboardStats(data) {
	if (!data) return;
	
	console.log('📊 Dashboard stats received:', data);
	
	// Calculate percentages from crop_distribution raw hectare counts
	const totalArea = data.total_area_hectares || 6550;
	
	if (data.crop_distribution) {
		Object.keys(data.crop_distribution).forEach(crop => {
			const percentage = (data.crop_distribution[crop] / totalArea * 100).toFixed(1);
			console.log(`${crop}: ${percentage}%`);
		});
	}
	
	updateDashboardDisplay(data, totalArea);
}

function updateDashboardDisplay(data, totalArea = 6550) {
	const mainLayout = document.querySelector('.main-layout');
	if (mainLayout) {
		mainLayout.classList.add('data-updating');
		setTimeout(() => mainLayout.classList.remove('data-updating'), 300);
	}

	const totalRegistrations = document.getElementById('totalRegistrations');
	if (totalRegistrations && data.total_registrations) {
		smoothUpdateNumber(totalRegistrations, parseInt(totalRegistrations.textContent.replace(/,/g, '') || 0), data.total_registrations, 'toLocaleString');
	}
	
	if (data.crop_distribution) {
		const dist = data.crop_distribution;
		
		// Convert raw hectares to percentages
		const crops = Object.keys(dist);
		const percentages = Object.values(dist).map(v => ((v / totalArea) * 100).toFixed(1));
		
		if (landUseChart) {
			landUseChart.data.labels = crops;
			landUseChart.data.datasets[0].data = percentages;
			landUseChart.update();
		}
		
		// Calculate aggregated land use categories for the Live AI Model Data table
		const agricultural = ((dist.AnnualCrop || 0) + (dist.PermanentCrop || 0)) / totalArea * 100;
		const forest = (dist.Forest || 0) / totalArea * 100;
		const vegetation = ((dist.Pasture || 0) + (dist.HerbaceousVegetation || 0)) / totalArea * 100;
		const water = ((dist.River || 0) + (dist.SeaLake || 0)) / totalArea * 100;
		
		const apiAgri = document.getElementById('apiAgri');
		const apiForest = document.getElementById('apiForest');
		const apiUrban = document.getElementById('apiUrban');
		const apiWater = document.getElementById('apiWater');
		const apiStatus = document.getElementById('apiStatus');
		
		if (apiAgri) {
			smoothUpdatePercentage(apiAgri, agricultural.toFixed(1));
		}
		if (apiForest) {
			smoothUpdatePercentage(apiForest, forest.toFixed(1));
		}
		if (apiUrban) {
			smoothUpdatePercentage(apiUrban, vegetation.toFixed(1));
		}
		if (apiWater) {
			smoothUpdatePercentage(apiWater, water.toFixed(1));
		}
		if (apiStatus) {
			apiStatus.style.color = '#10b981';
			apiStatus.textContent = '● Live';
		}
		
		regionData[currentRegion] = {
			agricultural: parseFloat(agricultural.toFixed(1)),
			forest: parseFloat(forest.toFixed(1)),
			urban: parseFloat(vegetation.toFixed(1)),
			water: parseFloat(water.toFixed(1))
		};
		
		updateSidebarStats(regionData[currentRegion]);
	}
	
	if (data.market_demand) {
		const supplyEl = document.getElementById('marketSupplyValue');
		const supplyBar = document.getElementById('supplyBar');
		
		// Calculate supply level based on market demand
		const demandLevels = Object.values(data.market_demand);
		const highDemandCount = demandLevels.filter(d => d.demand === 'High').length;
		const supplyLevel = Math.min(95, 60 + (highDemandCount * 15));
		
		if (supplyEl) supplyEl.textContent = `${supplyLevel}%`;
		if (supplyBar) supplyBar.style.width = `${supplyLevel}%`;
		
		const badge = document.getElementById('marketStatus');
		const description = document.getElementById('marketDescription');
		
		if (badge) {
			const status = highDemandCount >= 2 ? 'ACTIVE' : 'STABLE';
			badge.textContent = status;
			badge.className = 'market-status-badge ' + status.toLowerCase();
		}
		if (description) {
			const wheatInfo = data.market_demand.wheat;
			description.textContent = wheatInfo ? 
				`Wheat: ${wheatInfo.demand} demand, ${wheatInfo.price_trend}` : 
				'Market conditions updated';
		}
	}
	
	const now = new Date();
	const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
	const lastUpdateEl = document.getElementById('lastUpdate');
	if (lastUpdateEl) lastUpdateEl.textContent = timeString;
}

function updateDataFeedStatus(isActive) {
	const indicator = document.getElementById('dataStatus');
	if (indicator) {
		if (isActive) {
			indicator.classList.add('active');
			indicator.style.backgroundColor = '#22c55e';
		} else {
			indicator.classList.remove('active');
			indicator.style.backgroundColor = '#ef4444';
		}
	}
}

async function fetchLiveFeed(retryCount = 0) {
	try {
		const response = await fetch(`${BACKEND_API}/simulate-live-feed`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		
		const data = await response.json();
		updateLiveFeed(data);
		liveFeedRetries = 0;
		return data;
	} catch (error) {
		console.error('Live feed error:', error);
		liveFeedRetries++;
		
		if (liveFeedRetries >= MAX_RETRIES) {
			console.log('Live feed connection lost, will retry on next poll');
			showLoadingState();
		}
	}
}

function updateLiveFeed(data) {
	if (!data) return;
	
	const satelliteImage = document.getElementById('satelliteImage');
	const loadingIndicator = document.getElementById('feedLoading');
	
	// Update satellite image (API returns image_url, not satellite_image)
	if (data.image_url) {
		// Prepend backend URL if path is relative
		const imageUrl = data.image_url.startsWith('http') ? 
			data.image_url : 
			`${BACKEND_API}${data.image_url}`;
		satelliteImage.src = imageUrl;
		if (loadingIndicator) {
			loadingIndicator.classList.remove('active');
		}
	}
	
	// Update crop detection (API returns predicted_class, not detected_crop)
	if (data.predicted_class) {
		const detectedCropEl = document.getElementById('detectedCrop');
		if (detectedCropEl) detectedCropEl.textContent = data.predicted_class;
	}
	
	// Update confidence score (API returns confidence 0-100, not confidence_score 0-1)
	if (data.confidence !== undefined) {
		const score = data.confidence.toFixed(1);
		const element = document.getElementById('confidenceScore');
		if (element) {
			element.textContent = `${score}%`;
			
			if (data.confidence > 80) {
				element.style.color = '#22c55e';
			} else if (data.confidence > 60) {
				element.style.color = '#f59e0b';
			} else {
				element.style.color = '#ef4444';
			}
		}
	}
	
	// Update location - use actual_class as a pseudo location since API doesn't provide location
	const feedLocationEl = document.getElementById('feedLocation');
	if (feedLocationEl) {
		feedLocationEl.textContent = data.actual_class ? `Class: ${data.actual_class}` : 'Scanning...';
	}
	
	const now = new Date();
	const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const feedTimestampEl = document.getElementById('feedTimestamp');
	if (feedTimestampEl) feedTimestampEl.textContent = timeString;
}

function showLoadingState() {
	const loadingIndicator = document.getElementById('feedLoading');
	if (loadingIndicator) {
		loadingIndicator.classList.add('active');
	}
}

function startLiveFeedPolling() {
	if (liveFeedInterval) {
		clearInterval(liveFeedInterval);
	}
	
	fetchLiveFeed();
	
	liveFeedInterval = setInterval(() => {
		fetchLiveFeed();
	}, 4000);
}

function stopLiveFeedPolling() {
	if (liveFeedInterval) {
		clearInterval(liveFeedInterval);
		liveFeedInterval = null;
	}
}

async function initializeDashboard() {
	console.log('Initializing real-time dashboard...');
	
	const isHealthy = await checkSystemHealth();
	console.log(`System health: ${isHealthy ? 'OK' : 'ERROR'}`);
	
	await fetchDashboardStats();
	
	startLiveFeedPolling();
	
	setInterval(() => {
		fetchDashboardStats();
	}, 10000);
}

async function fetchLandUseData() {
	const apiStatus = document.getElementById('apiStatus');
	if (apiStatus) {
		apiStatus.style.color = '#f59e0b';
		apiStatus.textContent = '● Fetching...';
	}
	
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);
		
		// Use Render backend API instead of local Flask
		const response = await fetch(`${BACKEND_API}/dashboard-stats`, {
			signal: controller.signal,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		clearTimeout(timeoutId);
		
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		
		const data = await response.json();
		console.log('✅ Land Use Data from Render:', data);
		return data;
	} catch (error) {
		console.error('❌ Render API Error:', error.message);
		if (apiStatus) {
			apiStatus.style.color = '#ef4444';
			if (error.name === 'AbortError') {
				apiStatus.textContent = '● Timeout';
			} else if (error.message.includes('Failed to fetch')) {
				apiStatus.textContent = '● Connecting...';
				console.log('💡 Render server may be starting up (cold start)');
			} else {
				apiStatus.textContent = '● Retry...';
			}
		}
		return null;
	}
}

// Fetch crop type data is now handled via dashboard-stats endpoint
async function fetchCropTypeData() {
	// This is now integrated into fetchDashboardStats
	return null;
}

function updateDashboardWithAPIData(landUseData) {
	if (landUseData && landUseData.distribution_percent) {
		const dist = landUseData.distribution_percent;
		const agricultural = (dist.AnnualCrop || 0) + (dist.PermanentCrop || 0);
		const forest = dist.Forest || 0;
		const urban = (dist.Residential || 0) + (dist.Industrial || 0) + (dist.Highway || 0);
		const water = (dist.River || 0) + (dist.SeaLake || 0);
		
		regionData[currentRegion] = {
			agricultural: parseFloat(agricultural.toFixed(1)),
			forest: parseFloat(forest.toFixed(1)),
			urban: parseFloat(urban.toFixed(1)),
			water: parseFloat(water.toFixed(1))
		};
		
		console.log('📊 API Data:', dist);
		console.log('📊 Calculated:', regionData[currentRegion]);
		
		const apiAgri = document.getElementById('apiAgri');
		const apiForest = document.getElementById('apiForest');
		const apiUrban = document.getElementById('apiUrban');
		const apiWater = document.getElementById('apiWater');
		const apiStatus = document.getElementById('apiStatus');
		
		if (apiAgri) apiAgri.textContent = regionData[currentRegion].agricultural + '%';
		if (apiForest) apiForest.textContent = regionData[currentRegion].forest + '%';
		if (apiUrban) apiUrban.textContent = regionData[currentRegion].urban + '%';
		if (apiWater) apiWater.textContent = regionData[currentRegion].water + '%';
		if (apiStatus) {
			apiStatus.style.color = '#10b981';
			apiStatus.textContent = '● Live';
		}
		
		if (landUseChart) {
			landUseChart.data.datasets[0].data = [
				regionData[currentRegion].agricultural,
				regionData[currentRegion].forest,
				regionData[currentRegion].urban,
				regionData[currentRegion].water
			];
			landUseChart.update('none');
		}
		
		updateSidebarStats(regionData[currentRegion]);
	}
}

function getChartColors() {
	const root = document.documentElement;
	return {
		textColor: getComputedStyle(root).getPropertyValue('--text-color-top').trim(),
		borderColor: getComputedStyle(root).getPropertyValue('--line-color').trim(),
		bgColor: getComputedStyle(root).getPropertyValue('--background-color').trim(),
	};
}

function initChart() {
	const ctx = document.getElementById('landUseChart');
	if (!ctx) return;
	
	const data = regionData[currentRegion];
	const colors = getChartColors();
	
	landUseChart = new Chart(ctx.getContext('2d'), {
		type: 'doughnut',
		data: {
			labels: ['Agricultural', 'Forest', 'Urban', 'Water'],
			datasets: [{
				data: [data.agricultural, data.forest, data.urban, data.water],
				backgroundColor: [
					'rgba(168, 162, 158, 0.8)',
					'rgba(16, 185, 129, 0.8)',
					'rgba(245, 158, 11, 0.8)',
					'rgba(59, 130, 246, 0.8)'
				],
				borderColor: colors.bgColor,
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'bottom',
					labels: {
						color: colors.textColor,
						padding: 15,
						font: { size: 12 }
					}
				}
			}
		}
	});
}

function updateChart(region) {
	currentRegion = region;
	const data = regionData[region];
	const title = document.getElementById('chartTitle');
	const regionName = document.getElementById('currentRegion');
	
	if (!data) return;
	
	const displayName = region.charAt(0).toUpperCase() + region.slice(1);
	if (title) title.innerHTML = `<span>${displayName} Every</span><br /><strong>Hectare</strong> <span>Tracked.</span>`;
	if (regionName) regionName.textContent = displayName;
	
	if (landUseChart) {
		landUseChart.data.datasets[0].data = [data.agricultural, data.forest, data.urban, data.water];
		landUseChart.update('none');
	}
	
	updateSidebarStats(data);
}

function updateSidebarStats(data) {
	const qAgri = document.getElementById('qAgriPercent');
	const qForest = document.getElementById('qForestPercent');
	const qUrban = document.getElementById('qUrbanPercent');
	const qWater = document.getElementById('qWaterPercent');
	
	if (qAgri) qAgri.textContent = data.agricultural + '%';
	if (qForest) qForest.textContent = data.forest + '%';
	if (qUrban) qUrban.textContent = data.urban + '%';
	if (qWater) qWater.textContent = data.water + '%';
	
	const meters = document.querySelectorAll('.quick-stat-meter');
	if (meters[0]) meters[0].value = data.agricultural / 100;
	if (meters[1]) meters[1].value = data.forest / 100;
	if (meters[2]) meters[2].value = data.urban / 100;
	if (meters[3]) meters[3].value = data.water / 100;
}

function loadPlaceholderData() {
	console.log('📦 Loading placeholder data...');
	
	const placeholderStats = PLACEHOLDER_DATA.stats;
	
	if (landUseChart) {
		const crops = Object.keys(placeholderStats.crop_distribution);
		const percentages = Object.values(placeholderStats.crop_distribution);
		
		landUseChart.data.labels = crops;
		landUseChart.data.datasets[0].data = percentages;
		landUseChart.update('none');
	}
	
	updateLiveFeedDisplay(PLACEHOLDER_DATA.live_feed);
	
	const supplyBar = document.getElementById('supplyBar');
	if (supplyBar) {
		supplyBar.style.width = '65%';
		const marketSupplyVal = document.getElementById('marketSupplyValue');
		if (marketSupplyVal) marketSupplyVal.textContent = '65%';
	}
	
	const marketStatus = document.getElementById('marketStatus');
	const marketDesc = document.getElementById('marketDescription');
	if (marketStatus) {
		marketStatus.textContent = 'STABLE';
		marketStatus.className = 'market-status-badge stable';
	}
	if (marketDesc) {
		marketDesc.textContent = 'Normal market conditions with steady demand';
	}
	
	const apiAgri = document.getElementById('apiAgri');
	const apiForest = document.getElementById('apiForest');
	const apiUrban = document.getElementById('apiUrban');
	const apiWater = document.getElementById('apiWater');
	
	if (apiAgri) apiAgri.textContent = '45.2%';
	if (apiForest) apiForest.textContent = '28.5%';
	if (apiUrban) apiUrban.textContent = '18.3%';
	if (apiWater) apiWater.textContent = '8.0%';
	
	updateLastUpdateTime();
	
	console.log('✅ Placeholder data loaded');
}

function updateLiveFeedDisplay(feedData) {
	const detectedCrop = document.getElementById('detectedCrop');
	const confidenceScore = document.getElementById('confidenceScore');
	const feedLocation = document.getElementById('feedLocation');
	const feedTimestamp = document.getElementById('feedTimestamp');
	
	if (detectedCrop) detectedCrop.textContent = feedData.detected_crop || '--';
	if (confidenceScore) {
		const score = (feedData.confidence_score * 100).toFixed(1);
		confidenceScore.textContent = score + '%';
	}
	if (feedLocation) feedLocation.textContent = feedData.location || '--';
	if (feedTimestamp) feedTimestamp.textContent = new Date().toLocaleTimeString();
}

function updateLastUpdateTime() {
	const lastUpdateEl = document.getElementById('lastUpdate');
	if (lastUpdateEl) {
		const now = new Date();
		lastUpdateEl.textContent = now.toLocaleTimeString();
	}
}

function smoothUpdateNumber(element, fromValue, toValue, formatter = null) {
	if (!element || fromValue === toValue) {
		if (element && formatter === 'toLocaleString') {
			element.textContent = toValue.toLocaleString();
		} else if (element) {
			element.textContent = toValue;
		}
		return;
	}

	const duration = 600;
	const startTime = Date.now();
	const difference = toValue - fromValue;

	function animate() {
		const elapsedTime = Date.now() - startTime;
		const progress = Math.min(elapsedTime / duration, 1);
		const currentValue = Math.floor(fromValue + difference * progress);

		if (formatter === 'toLocaleString') {
			element.textContent = currentValue.toLocaleString();
		} else {
			element.textContent = currentValue;
		}

		if (progress < 1) {
			requestAnimationFrame(animate);
		} else {
			element.classList.add('stat-value', 'updated');
			setTimeout(() => element.classList.remove('updated'), 1000);
		}
	}

	animate();
}

function smoothUpdatePercentage(element, targetPercentage) {
	if (!element) return;

	const currentText = element.textContent;
	const startValue = parseFloat(currentText);
	
	if (isNaN(startValue)) {
		element.textContent = targetPercentage + '%';
		return;
	}

	const target = parseFloat(targetPercentage);
	const duration = 500;
	const startTime = Date.now();
	const difference = target - startValue;

	function animate() {
		const elapsedTime = Date.now() - startTime;
		const progress = Math.min(elapsedTime / duration, 1);
		const value = startValue + difference * progress;

		element.textContent = (Math.round(value * 10) / 10) + '%';

		if (progress < 1) {
			requestAnimationFrame(animate);
		}
	}

	animate();
}const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('aside');

if (hamburger) {
	hamburger.addEventListener('click', () => {
		if (window.innerWidth <= 768) {
			sidebar.classList.toggle('show-sidebar');
		}
	});
}

document.addEventListener('click', (e) => {
	if (window.innerWidth <= 768 && 
		!sidebar.contains(e.target) && 
		!hamburger.contains(e.target) &&
		sidebar.classList.contains('show-sidebar')) {
		sidebar.classList.remove('show-sidebar');
	}
});

window.addEventListener('resize', () => {
	if (window.innerWidth > 768) {
		sidebar.classList.remove('show-sidebar');
	}
});

const toggleInput = document.querySelector('.toggle input');
const rootElement = document.documentElement;

const applyTheme = (isDark) => {
	if (isDark) {
		rootElement.classList.remove('light');
	} else {
		rootElement.classList.add('light');
	}
	if (window._leafletTileLayer && window._leafletMap) {
		const tileUrl = isDark
			? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
			: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
		window._leafletTileLayer.setUrl(tileUrl);
	}
};

if (toggleInput) {
	toggleInput.checked = true;
	applyTheme(true);

	toggleInput.addEventListener('input', () => {
		const isDark = toggleInput.checked;
		
		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;
		
		const toggleElement = document.querySelector('.toggle');
		if (toggleElement) {
			const rect = toggleElement.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}
		
		if (!document.startViewTransition) {
			applyTheme(isDark);
			updateAllCharts();
			return;
		}

		const transition = document.startViewTransition(() => {
			applyTheme(isDark);
		});

		transition.ready.then(() => {
			rootElement.style.setProperty('--x', `${x}px`);
			rootElement.style.setProperty('--y', `${y}px`);
			updateAllCharts();
		});
	});
}

function updateAllCharts() {
	const newColors = getChartColors();
	
	if (landUseChart) {
		landUseChart.options.plugins.legend.labels.color = newColors.textColor;
		landUseChart.data.datasets[0].borderColor = newColors.bgColor;
		landUseChart.update();
	}
	
	if (regionalChart) {
		regionalChart.options.plugins.legend.labels.color = newColors.textColor;
		regionalChart.options.scales.y.grid.color = newColors.borderColor;
		regionalChart.options.scales.y.ticks.color = newColors.textColor;
		regionalChart.options.scales.x.grid.color = newColors.borderColor;
		regionalChart.options.scales.x.ticks.color = newColors.textColor;
		regionalChart.update();
	}
	
	if (yieldChart) {
		yieldChart.options.plugins.legend.labels.color = newColors.textColor;
		yieldChart.options.scales.y.grid.color = newColors.borderColor;
		yieldChart.options.scales.y.ticks.color = newColors.textColor;
		yieldChart.options.scales.x.grid.color = newColors.borderColor;
		yieldChart.options.scales.x.ticks.color = newColors.textColor;
		yieldChart.update();
	}
	
	if (growthChart) {
		growthChart.options.plugins.legend.labels.color = newColors.textColor;
		growthChart.options.scales.y.grid.color = newColors.borderColor;
		growthChart.options.scales.y.ticks.color = newColors.textColor;
		growthChart.options.scales.x.grid.color = newColors.borderColor;
		growthChart.options.scales.x.ticks.color = newColors.textColor;
		growthChart.update();
	}
}

const searchBar = document.querySelector('.search-bar');
const searchIcon = document.querySelector('.search-icon');
const headerMiddle = document.querySelector('.header-middle');

function performSearch() {
	const query = searchBar.value.toLowerCase().trim();
	if (!query) return;
	
	if (currentSection === 'registry') {
		const filtered = farmersData.filter(f => 
			f.state.toLowerCase().includes(query) ||
			f.district.toLowerCase().includes(query) ||
			f.village.toLowerCase().includes(query)
		);
		if (filtered.length > 0) {
			renderRegistryTable(filtered);
			searchBar.value = '';
			headerMiddle.classList.remove('search-active');
		} else {
			showSearchError();
		}
	}
}

function showSearchError() {
	headerMiddle.style.boxShadow = '0 0 0 2px #ef4444';
	setTimeout(() => {
		headerMiddle.style.boxShadow = '';
		headerMiddle.classList.remove('search-active');
	}, 500);
}

if (searchBar) {
	searchBar.addEventListener('focus', () => {
		headerMiddle.classList.add('search-active');
	});

	searchBar.addEventListener('blur', () => {
		setTimeout(() => headerMiddle.classList.remove('search-active'), 200);
	});

	searchBar.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') performSearch();
	});
}

if (searchIcon) {
	searchIcon.addEventListener('click', performSearch);
}

function switchSection(section) {
	currentSection = section;
	
	document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
	
	const sectionElement = document.getElementById(`${section}-section`);
	if (sectionElement) {
		sectionElement.classList.add('active');
		// Re-trigger animations by forcing reflow
		sectionElement.style.animation = 'none';
		void sectionElement.offsetHeight;
		sectionElement.style.animation = '';
	}
	
	const headerTitle = document.querySelector('header h2');
	switch(section) {
		case 'dashboard':
			headerTitle.textContent = 'Dashboard';
			if (searchBar) searchBar.placeholder = 'Search regions...';
			break;
		case 'regional':
			headerTitle.textContent = 'Regional Analysis';
			if (searchBar) searchBar.placeholder = 'Search regions...';
			// Always try to init — chart canvas may need re-rendering
			setTimeout(() => {
				if (!regionalChart) {
					initRegionalChart();
				} else {
					regionalChart.resize();
				}
			}, 50);
			break;
		case 'analytics':
			headerTitle.textContent = 'Analytics';
			if (searchBar) searchBar.placeholder = 'Search analytics...';
			setTimeout(() => {
				if (!yieldChart || !growthChart) {
					initAnalyticsCharts();
				} else {
					yieldChart.resize();
					growthChart.resize();
				}
			}, 50);
			break;
		case 'registry':
			headerTitle.textContent = 'Farmer Registry';
			if (searchBar) searchBar.placeholder = 'Search farmers...';
			loadFarmersData();
			break;
	}
}

document.querySelectorAll('.sidebar-links[data-section]').forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		const section = link.dataset.section;
		
		document.querySelectorAll('.sidebar-links').forEach(l => l.classList.remove('active-link'));
		link.classList.add('active-link');
		
		switchSection(section);
	});
});

function initRegionalChart() {
	const ctx = document.getElementById('regionalChart');
	if (!ctx) return;
	
	const colors = getChartColors();
	regionalChart = new Chart(ctx.getContext('2d'), {
		type: 'bar',
		data: {
			labels: ['Punjab', 'Haryana', 'UP', 'Rajasthan'],
			datasets: [{
				label: 'Farmers (thousands)',
				data: [12.8, 8.9, 15.2, 6.8],
				backgroundColor: 'rgba(168, 162, 158, 0.8)',
				borderColor: colors.textColor,
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					labels: { color: colors.textColor }
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: { color: colors.borderColor },
					ticks: { color: colors.textColor }
				},
				x: {
					grid: { color: colors.borderColor },
					ticks: { color: colors.textColor }
				}
			}
		}
	});
}

function initAnalyticsCharts() {
	const colors = getChartColors();
	
	const yieldCtx = document.getElementById('yieldChart');
	if (yieldCtx) {
		yieldChart = new Chart(yieldCtx.getContext('2d'), {
			type: 'line',
			data: {
				labels: ['Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26'],
				datasets: [{
					label: 'Avg Yield (tons/hectare)',
					data: [2.8, 3.0, 3.2, 3.4, 3.5, 3.6],
					borderColor: '#10b981',
					backgroundColor: 'rgba(16, 185, 129, 0.1)',
					tension: 0.4,
					fill: true
				}, {
					label: 'National Target',
					data: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
					borderColor: 'rgba(239, 68, 68, 0.5)',
					borderDash: [6, 4],
					pointRadius: 0,
					fill: false
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { labels: { color: colors.textColor } }
				},
				scales: {
					y: {
						beginAtZero: false,
						min: 2,
						grid: { color: colors.borderColor },
						ticks: { color: colors.textColor }
					},
					x: {
						grid: { color: colors.borderColor },
						ticks: { color: colors.textColor }
					}
				}
			}
		});
	}
	
	const growthCtx = document.getElementById('growthChart');
	if (growthCtx) {
		growthChart = new Chart(growthCtx.getContext('2d'), {
			type: 'line',
			data: {
				labels: ['Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26'],
				datasets: [{
					label: 'New Registrations',
					data: [520, 640, 780, 850, 960, 465],
					borderColor: '#3b82f6',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					tension: 0.4,
					fill: true
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { labels: { color: colors.textColor } }
				},
				scales: {
					y: {
						beginAtZero: true,
						grid: { color: colors.borderColor },
						ticks: { color: colors.textColor }
					},
					x: {
						grid: { color: colors.borderColor },
						ticks: { color: colors.textColor }
					}
				}
			}
		});
	}
}

async function loadFarmersData() {
	const loading = document.getElementById('registryLoading');
	const table = document.getElementById('registryTable');
	const noData = document.getElementById('noData');
	
	if (!loading || !table || !noData) return;
	
	try {
		loading.style.display = 'block';
		table.style.display = 'none';
		noData.style.display = 'none';
		
		const q = query(collection(db, 'farmers'), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		
		farmersData = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			farmersData.push({
				id: doc.id,
				country: data.country || 'India',
				state: data.state || data.country || 'India',
				district: data.district || '--',
				village: data.village || '--',
				createdAt: data.createdAt
			});
		});
		
		loading.style.display = 'none';
		
		if (farmersData.length === 0) {
			noData.style.display = 'block';
		} else {
			table.classList.add('loaded');
			table.style.display = 'table';
			renderRegistryTable(farmersData);
			populateFilters();
		}
		
		const totalReg = document.getElementById('totalRegistrations');
		if (totalReg) totalReg.textContent = farmersData.length.toLocaleString();
		
	} catch (error) {
		console.error('Error loading farmers:', error);
		if (loading) loading.style.display = 'none';
		if (noData) {
			noData.style.display = 'block';
			const msg = noData.querySelector('p');
			if (msg) msg.textContent = 'Error loading data. Please refresh.';
		}
	}
}

function renderRegistryTable(data) {
	const tbody = document.getElementById('registryTableBody');
	const registryTotal = document.getElementById('registryTotal');
	const registryFiltered = document.getElementById('registryFiltered');
	
	if (!tbody) return;
	
	tbody.innerHTML = '';
	
	data.forEach((farmer, index) => {
		const row = document.createElement('tr');
		const date = farmer.createdAt ? new Date(farmer.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
		const country = farmer.country || 'India';
		const countryDisplay = country.charAt(0).toUpperCase() + country.slice(1);
		
		row.innerHTML = `
			<td>${index + 1}</td>
			<td>${countryDisplay}</td>
			<td>${farmer.state !== farmer.country ? farmer.state : '--'}</td>
			<td>${farmer.district !== '--' ? farmer.district : (farmer.village !== '--' ? farmer.village : 'Registered')}</td>
			<td>${date}</td>
		`;
		
		tbody.appendChild(row);
	});
	
	if (registryTotal) registryTotal.textContent = farmersData.length;
	if (registryFiltered) registryFiltered.textContent = data.length;
}

function populateFilters() {
	const stateFilter = document.getElementById('stateFilter');
	const districtFilter = document.getElementById('districtFilter');
	
	if (!stateFilter || !districtFilter) return;
	
	const states = [...new Set(farmersData.map(f => f.state))].sort();
	const districts = [...new Set(farmersData.map(f => f.district))].sort();
	
	states.forEach(state => {
		const option = document.createElement('option');
		option.value = state;
		option.textContent = state;
		stateFilter.appendChild(option);
	});
	
	districts.forEach(district => {
		const option = document.createElement('option');
		option.value = district;
		option.textContent = district;
		districtFilter.appendChild(option);
	});
	
	stateFilter.addEventListener('change', applyFilters);
	districtFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
	const stateFilter = document.getElementById('stateFilter').value;
	const districtFilter = document.getElementById('districtFilter').value;
	
	let filtered = farmersData;
	
	if (stateFilter !== 'all') {
		filtered = filtered.filter(f => f.state === stateFilter);
	}
	
	if (districtFilter !== 'all') {
		filtered = filtered.filter(f => f.district === districtFilter);
	}
	
	renderRegistryTable(filtered);
}


setInterval(() => {
	if (currentSection === 'registry' && farmersData.length > 0) {
		loadFarmersData();
	}
}, 30000);

document.addEventListener('DOMContentLoaded', async () => {
	console.log('🚀 Dashboard initializing...');
	
	console.log('📊 Loading placeholder data...');
	initChart();
	loadPlaceholderData();
	loadFarmersData();
	updateSidebarStats(regionData.national);
	initWeatherWidget();
	initPriceChart();
	initInteractiveMap();
	
	console.log('📡 Fetching live data from Render server...');
	initializeDashboard();
	
	const regionRows = document.querySelectorAll('.region-row');
	regionRows.forEach((row, index) => {
		if (index >= 3) {
			row.classList.add('hidden');
		}
		row.addEventListener('click', () => {
			const region = row.dataset.region;
			if (currentSection === 'dashboard') {
				updateChart(region);
			}
		});
	});
	
	const seeAllBtn = document.querySelector('.recent-transactions a');
	if (seeAllBtn) {
		seeAllBtn.addEventListener('click', (e) => {
			e.preventDefault();
			regionRows.forEach(row => {
				row.classList.remove('hidden');
			});
			seeAllBtn.style.display = 'none';
		});
	}
	
	const regionSelector = document.querySelector('.region-selector');
	if (regionSelector) {
		regionSelector.addEventListener('click', async () => {
			console.log('🔄 Fetching new data from Render...');
			await fetchDashboardStats();
		});
	}
	
	initCropSuggestor();
	initBloomAI();
	
	// Auto-refresh is handled by initializeDashboard() which polls every 10 seconds
	console.log('✅ Dashboard ready! Connected to Render backend.');
});

function initWeatherWidget() {
	// February 2026 weather — North India Rabi season
	const weatherData = {
		temp: 18,
		desc: 'Cool & Clear',
		humidity: 58,
		windSpeed: 8,
		rainfall: 2,
		soilMoisture: 68,
		icon: '🌤️'
	};

	updateWeather(weatherData);
	generateForecast();
}

function updateWeather(data) {
	document.getElementById('currentTemp').textContent = data.temp + '°C';
	document.getElementById('weatherDesc').textContent = data.desc;
	document.getElementById('humidity').textContent = data.humidity + '%';
	document.getElementById('windSpeed').textContent = data.windSpeed + ' km/h';
	document.getElementById('rainfall').textContent = data.rainfall + ' mm';
	document.getElementById('soilMoisture').textContent = data.soilMoisture + '%';
	document.getElementById('tempIcon').textContent = data.icon;
}

function generateForecast() {
	// February 2026 realistic forecast for North India
	const forecastDays = [
		{ day: 'Mon 2', temp: 19, icon: 'sun-shower' },
		{ day: 'Tue 3', temp: 17, icon: 'cloudy' },
		{ day: 'Wed 4', temp: 15, icon: 'rainy' },
		{ day: 'Thu 5', temp: 14, icon: 'cloudy' },
		{ day: 'Fri 6', temp: 16, icon: 'sun-shower' },
		{ day: 'Sat 7', temp: 20, icon: 'sunny' },
		{ day: 'Sun 8', temp: 21, icon: 'sunny' }
	];

	// Exact animated icon HTML from reference
	function getWeatherIconHTML(type) {
		const icons = {
			'sunny': '<div class="sun"><div class="rays"></div></div>',
			'sun-shower': '<div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div>',
			'cloudy': '<div class="cloud"></div><div class="cloud"></div>',
			'rainy': '<div class="cloud"></div><div class="rain"></div>',
			'thunder-storm': '<div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div>',
			'flurries': '<div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div>'
		};
		return `<div class="forecast-icon-wrap"><div class="forecast-icon ${type}">${icons[type] || icons['sunny']}</div></div>`;
	}

	const forecastContainer = document.getElementById('forecastContainer');
	if (forecastContainer) {
		forecastContainer.innerHTML = forecastDays.map((item, index) => `
			<div class="forecast-item">
				<span class="day">${item.day.slice(0, 3)}</span>
				<span class="icon">${getWeatherIconHTML(item.icon)}</span>
				<span class="temp">${item.temp}°C</span>
			</div>
		`).join('');
	}
}

function initPriceChart() {
	const ctx = document.getElementById('priceChart');
	if (!ctx) return;

	const priceData = {
		labels: ['Jan 27', 'Jan 29', 'Jan 31', 'Feb 2', 'Feb 4', 'Feb 6', 'Feb 8'],
		wheat: [2350, 2365, 2380, 2395, 2410, 2425, 2445],
		rice: [2320, 2330, 2340, 2355, 2365, 2380, 2390],
		sugarcane: [340, 342, 345, 348, 350, 352, 355],
		cotton: [6800, 6825, 6850, 6880, 6910, 6950, 6980],
		maize: [2150, 2170, 2185, 2200, 2220, 2240, 2260],
		pulses: [5800, 5840, 5880, 5920, 5960, 6010, 6050]
	};

	if (priceChart) {
		priceChart.destroy();
	}

	priceChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: priceData.labels,
			datasets: [{
				label: 'Price Trend',
				data: priceData.wheat,
				borderColor: '#4CAF50',
				backgroundColor: 'rgba(76, 175, 80, 0.1)',
				borderWidth: 3,
				tension: 0.4,
				fill: true,
				pointRadius: 4,
				pointBackgroundColor: '#4CAF50',
				pointBorderColor: '#fff',
				pointBorderWidth: 2
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					padding: 12,
					titleColor: '#fff',
					bodyColor: '#fff',
					borderColor: '#4CAF50',
					borderWidth: 1,
					callbacks: {
						label: function(context) {
							return '₹' + context.parsed.y + '/unit';
						}
					}
				}
			},
			scales: {
				y: {
					beginAtZero: false,
					ticks: {
						callback: function(value) {
							return '₹' + value;
						},
						color: '#999'
					},
					grid: {
						color: 'rgba(100, 100, 100, 0.1)'
					}
				},
				x: {
					ticks: {
						color: '#999'
					},
					grid: {
						display: false
					}
				}
			}
		}
	});

	const cropSelect = document.getElementById('cropSelect');
	const regionSelect = document.getElementById('regionSelect');

	if (cropSelect) {
		cropSelect.addEventListener('change', () => {
			const selectedCrop = cropSelect.value;
			if (selectedCrop && priceData[selectedCrop]) {
				updatePriceChart(selectedCrop, priceData[selectedCrop], priceData.labels);
				updatePricePrediction(selectedCrop);
			}
		});
	}

	if (regionSelect) {
		regionSelect.addEventListener('change', () => {
			updatePriceFactors(regionSelect.value);
		});
	}
}

function updatePriceChart(cropName, prices, labels) {
	if (priceChart && priceChart.data) {
		priceChart.data.datasets[0].data = prices;
		priceChart.data.datasets[0].label = cropName.charAt(0).toUpperCase() + cropName.slice(1) + ' Price';
		priceChart.update();

		const currentPrice = prices[prices.length - 2];
		const predictedPrice = prices[prices.length - 1];
		const trend = predictedPrice > currentPrice ? '+' : '';
		const percentage = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1);

		document.getElementById('currentPrice').textContent = '₹' + currentPrice + '/unit';
		document.getElementById('predictedPrice').textContent = '₹' + predictedPrice + '/unit';
		document.getElementById('trendBadge').textContent = trend + percentage + '%';
	}
}

function updatePricePrediction(crop) {
	const riskLevels = {
		wheat: 'Low',
		rice: 'Low',
		sugarcane: 'Medium',
		cotton: 'High',
		maize: 'Medium',
		pulses: 'Medium'
	};
	
	document.getElementById('marketRisk').textContent = riskLevels[crop] || 'Medium';
	document.getElementById('priceCardTitle').textContent = crop.charAt(0).toUpperCase() + crop.slice(1) + ' Price Trend';
}

function updatePriceFactors(region) {
	// Simulate factor updates based on region
	const factors = {
		'punjab': { supply: 75, demand: 85, weather: 65, seasonal: 90, global: 60, regional: 88 },
		'haryana': { supply: 70, demand: 80, weather: 55, seasonal: 85, global: 58, regional: 82 },
		'uttar-pradesh': { supply: 65, demand: 75, weather: 45, seasonal: 80, global: 52, regional: 76 },
		'rajasthan': { supply: 60, demand: 70, weather: 35, seasonal: 75, global: 50, regional: 70 },
		'maharashtra': { supply: 68, demand: 78, weather: 50, seasonal: 82, global: 55, regional: 78 }
	};

	const regionFactors = factors[region] || factors['punjab'];

	Object.keys(regionFactors).forEach(key => {
		const element = document.getElementById(key + 'Factor');
		const valueElement = document.getElementById(key + 'Value');
		const value = regionFactors[key];
		
		if (element) {
			element.style.width = value + '%';
		}
		if (valueElement) {
			valueElement.textContent = value + '%';
		}
	});
}

const CROP_DATABASE = {
	wheat: {
		name: 'Wheat', emoji: svgIcon('wheat', 28), variety: 'HD-2967, PBW-343',
		seasons: ['rabi'],
		regions: ['punjab', 'haryana', 'uttar-pradesh', 'rajasthan'],
		basePrice: 2275, priceGrowth: 5.2, demand: 'High',
		yieldPerAcre: '18-20 quintals', investmentPerAcre: 18000,
		returnPerAcre: 45500, riskLevel: 'Low', waterNeed: 'Medium',
		soilType: 'Loamy, Clay Loam', growthDuration: '120-150 days',
		msp: 2275
	},
	rice: {
		name: 'Rice', emoji: svgIcon('grain', 28), variety: 'Pusa Basmati 1121, PR-126',
		seasons: ['kharif'],
		regions: ['punjab', 'haryana', 'uttar-pradesh'],
		basePrice: 2203, priceGrowth: 4.8, demand: 'High',
		yieldPerAcre: '22-28 quintals', investmentPerAcre: 22000,
		returnPerAcre: 62000, riskLevel: 'Low', waterNeed: 'High',
		soilType: 'Clay, Alluvial', growthDuration: '90-120 days',
		msp: 2203
	},
	sugarcane: {
		name: 'Sugarcane', emoji: svgIcon('sprout', 28), variety: 'Co-0238, CoS-767',
		seasons: ['kharif', 'zaid'],
		regions: ['uttar-pradesh', 'maharashtra', 'haryana'],
		basePrice: 315, priceGrowth: 3.5, demand: 'Medium',
		yieldPerAcre: '350-400 quintals', investmentPerAcre: 35000,
		returnPerAcre: 120000, riskLevel: 'Medium', waterNeed: 'High',
		soilType: 'Loamy, Deep alluvial', growthDuration: '10-12 months',
		msp: 315
	},
	cotton: {
		name: 'Cotton', emoji: svgIcon('cloud', 28), variety: 'Bt Cotton, MCU-5',
		seasons: ['kharif'],
		regions: ['maharashtra', 'rajasthan', 'haryana', 'punjab'],
		basePrice: 6620, priceGrowth: 7.1, demand: 'High',
		yieldPerAcre: '8-12 quintals', investmentPerAcre: 25000,
		returnPerAcre: 72000, riskLevel: 'Medium', waterNeed: 'Medium',
		soilType: 'Black Cotton Soil', growthDuration: '150-180 days',
		msp: 6620
	},
	maize: {
		name: 'Maize', emoji: svgIcon('corn', 28), variety: 'HQPM-1, DHM-117',
		seasons: ['kharif', 'rabi'],
		regions: ['rajasthan', 'uttar-pradesh', 'maharashtra', 'haryana'],
		basePrice: 2090, priceGrowth: 6.3, demand: 'Medium',
		yieldPerAcre: '25-30 quintals', investmentPerAcre: 15000,
		returnPerAcre: 55000, riskLevel: 'Low', waterNeed: 'Medium',
		soilType: 'Sandy Loam', growthDuration: '80-110 days',
		msp: 2090
	},
	pulses: {
		name: 'Pulses', emoji: svgIcon('circle', 28), variety: 'Moong, Masoor, Chana',
		seasons: ['rabi', 'kharif'],
		regions: ['rajasthan', 'uttar-pradesh', 'maharashtra'],
		basePrice: 5650, priceGrowth: 8.2, demand: 'High',
		yieldPerAcre: '6-8 quintals', investmentPerAcre: 12000,
		returnPerAcre: 42000, riskLevel: 'Low', waterNeed: 'Low',
		soilType: 'Sandy Loam, Light Soil', growthDuration: '60-90 days',
		msp: 5650
	},
	mustard: {
		name: 'Mustard', emoji: svgIcon('flower', 28), variety: 'Pusa Bold, RH-749',
		seasons: ['rabi'],
		regions: ['rajasthan', 'haryana', 'uttar-pradesh', 'punjab'],
		basePrice: 5650, priceGrowth: 6.8, demand: 'High',
		yieldPerAcre: '7-9 quintals', investmentPerAcre: 10000,
		returnPerAcre: 48000, riskLevel: 'Low', waterNeed: 'Low',
		soilType: 'Loamy, Sandy Loam', growthDuration: '110-140 days',
		msp: 5650
	},
	soybean: {
		name: 'Soybean', emoji: svgIcon('leaf', 28), variety: 'JS-335, JS-9560',
		seasons: ['kharif'],
		regions: ['maharashtra', 'rajasthan'],
		basePrice: 4600, priceGrowth: 5.5, demand: 'Medium',
		yieldPerAcre: '8-12 quintals', investmentPerAcre: 14000,
		returnPerAcre: 46000, riskLevel: 'Medium', waterNeed: 'Medium',
		soilType: 'Black, Clay Loam', growthDuration: '90-100 days',
		msp: 4600
	}
};

const MARKET_TRENDS = {
	wheat: { trend: 'rising', change: +5.2, outlook: 'Strong demand from flour mills and exports' },
	rice: { trend: 'stable', change: +2.1, outlook: 'Steady domestic demand, good export opportunities' },
	sugarcane: { trend: 'stable', change: +1.8, outlook: 'Sugar mills offering stable prices' },
	cotton: { trend: 'rising', change: +7.1, outlook: 'Global textile demand surge, prices expected to rise' },
	maize: { trend: 'rising', change: +6.3, outlook: 'Animal feed industry growth driving demand up' },
	pulses: { trend: 'rising', change: +8.2, outlook: 'Government push for pulse production, high MSP hikes' },
	mustard: { trend: 'rising', change: +6.8, outlook: 'Edible oil import reduction policy boosting demand' },
	soybean: { trend: 'rising', change: +5.5, outlook: 'Growing health food market, oil demand rising' }
};

function generateCropSuggestions() {
	const region = document.getElementById('suggestorRegion')?.value || 'punjab';
	const season = document.getElementById('suggestorSeason')?.value || 'rabi';
	const landSize = document.getElementById('suggestorLand')?.value || 'medium';

	const scored = Object.entries(CROP_DATABASE)
		.filter(([_, crop]) => crop.seasons.includes(season) && crop.regions.includes(region))
		.map(([key, crop]) => {
			let score = 0;
			const reasons = [];

			// Price trend score (0-30)
			const trend = MARKET_TRENDS[key];
			if (trend) {
				if (trend.trend === 'rising') {
					score += 25 + Math.min(trend.change, 10);
					reasons.push({ icon: svgIcon('trending-up', 14), text: `Price rising ${trend.change}% — ${trend.outlook}` });
				} else if (trend.trend === 'stable') {
					score += 15;
					reasons.push({ icon: svgIcon('arrow-right', 14), text: `Stable market — ${trend.outlook}` });
				} else {
					score += 5;
					reasons.push({ icon: svgIcon('trending-down', 14), text: `Declining trend — consider diversification` });
				}
			}

			// Demand score (0-20)
			if (crop.demand === 'High') {
				score += 20;
				reasons.push({ icon: svgIcon('flame', 14), text: 'High market demand — quick sales expected' });
			} else if (crop.demand === 'Medium') {
				score += 12;
				reasons.push({ icon: svgIcon('bar-chart', 14), text: 'Moderate demand — steady market' });
			} else {
				score += 5;
			}

			// ROI score (0-25)
			const roi = ((crop.returnPerAcre - crop.investmentPerAcre) / crop.investmentPerAcre * 100);
			score += Math.min(roi / 10, 25);
			reasons.push({ icon: svgIcon('coins', 14), text: `ROI: ${roi.toFixed(0)}% — ₹${(crop.returnPerAcre / 1000).toFixed(0)}K return/acre` });

			// Risk adjustment (0-15)
			if (crop.riskLevel === 'Low') {
				score += 15;
				reasons.push({ icon: svgIcon('shield', 14), text: 'Low risk — safe investment with MSP support' });
			} else if (crop.riskLevel === 'Medium') {
				score += 8;
			}

			// Water suitability (0-10)
			if (crop.waterNeed === 'Low') {
				score += 10;
				if (region === 'rajasthan') reasons.push({ icon: svgIcon('droplet', 14), text: 'Low water need — ideal for your region' });
			} else if (crop.waterNeed === 'Medium') {
				score += 7;
			} else {
				score += (region === 'punjab' || region === 'uttar-pradesh') ? 6 : 2;
			}

			// Land size adjustment
			if (landSize === 'small' && crop.investmentPerAcre <= 18000) score += 5;
			if (landSize === 'large' && crop.returnPerAcre >= 60000) score += 5;

			return { key, crop, score, reasons, trend, roi };
		})
		.sort((a, b) => b.score - a.score);

	renderCropSuggestions(scored);
	renderTrendInsights(scored, region, season);
	updateSuggestorSummary(scored);
}

function renderCropSuggestions(suggestions) {
	const container = document.getElementById('cropSuggestions');
	if (!container) return;

	const rankLabels = ['#1 BEST PICK', '#2 STRONG', '#3 GOOD', 'VIABLE'];
	const rankClasses = ['gold', 'silver', 'bronze', 'normal'];

	container.innerHTML = suggestions.slice(0, 4).map((s, i) => `
		<div class="crop-suggest-card shine rank-${i + 1}" style="animation-delay: ${i * 0.1}s">
			<div class="crop-card-header">
				<div class="crop-card-title">
					<span class="crop-emoji">${s.crop.emoji}</span>
					<div>
						<span class="crop-name">${s.crop.name}</span>
						<span class="crop-variety">${s.crop.variety}</span>
					</div>
				</div>
				<span class="crop-rank ${rankClasses[i]}">${rankLabels[i]}</span>
			</div>
			<div class="crop-metrics">
				<div class="crop-metric">
					<span class="metric-label">Expected Return</span>
					<span class="metric-value">₹${(s.crop.returnPerAcre / 1000).toFixed(0)}K/acre</span>
				</div>
				<div class="crop-metric">
					<span class="metric-label">Price Trend</span>
					<span class="metric-value" style="color: ${s.trend?.change > 0 ? '#22c55e' : '#ef4444'}">
						${s.trend?.change > 0 ? '↑' : '↓'} ${Math.abs(s.trend?.change || 0)}%
					</span>
				</div>
				<div class="crop-metric">
					<span class="metric-label">Investment</span>
					<span class="metric-value">₹${(s.crop.investmentPerAcre / 1000).toFixed(0)}K/acre</span>
				</div>
				<div class="crop-metric">
					<span class="metric-label">Risk Level</span>
					<span class="metric-value" style="color: ${s.crop.riskLevel === 'Low' ? '#22c55e' : s.crop.riskLevel === 'Medium' ? '#f59e0b' : '#ef4444'}">
						${s.crop.riskLevel}
					</span>
				</div>
			</div>
			<div class="crop-reasons">
				${s.reasons.slice(0, 3).map(r => `
					<div class="crop-reason">
						<span class="reason-icon">${r.icon}</span>
						<span>${r.text}</span>
					</div>
				`).join('')}
			</div>
			<div class="crop-confidence-bar">
				<div class="crop-confidence-fill" style="width: ${Math.min(s.score, 100)}%"></div>
			</div>
		</div>
	`).join('');
}

function renderTrendInsights(suggestions, region, season) {
	const container = document.getElementById('insightsGrid');
	if (!container) return;

	const regionNames = {
		'punjab': 'Punjab', 'haryana': 'Haryana', 'uttar-pradesh': 'Uttar Pradesh',
		'rajasthan': 'Rajasthan', 'maharashtra': 'Maharashtra'
	};
	const seasonNames = { 'kharif': 'Kharif', 'rabi': 'Rabi', 'zaid': 'Zaid' };

	const topCrop = suggestions[0];
	const risingCrops = suggestions.filter(s => s.trend?.trend === 'rising');
	const avgRoi = suggestions.reduce((sum, s) => sum + s.roi, 0) / suggestions.length;

	const insights = [
		{
			icon: svgIcon('trophy', 20),
			title: `${topCrop?.crop.name} leads in ${regionNames[region]}`,
			desc: `Highest composite score for ${seasonNames[season]} season with ${topCrop?.crop.demand} demand and ${topCrop?.crop.riskLevel} risk.`,
			tag: 'positive', tagText: 'Top Pick'
		},
		{
			icon: svgIcon('trending-up', 20),
			title: `${risingCrops.length} crops with rising prices`,
			desc: `${risingCrops.map(c => c.crop.name).join(', ')} showing upward price trends this season.`,
			tag: risingCrops.length >= 3 ? 'positive' : 'neutral', tagText: `${risingCrops.length} Rising`
		},
		{
			icon: svgIcon('chart-line', 20),
			title: `Average ROI: ${avgRoi.toFixed(0)}%`,
			desc: `Expected return on investment across suggested crops for the selected region and season.`,
			tag: avgRoi > 150 ? 'positive' : 'neutral', tagText: avgRoi > 150 ? 'Strong' : 'Moderate'
		},
		{
			icon: svgIcon('cloud-sun', 20),
			title: 'Weather-Adjusted Picks',
			desc: `Recommendations account for ${regionNames[region]}'s climate — water availability, soil type, and seasonal patterns.`,
			tag: 'neutral', tagText: 'Analyzed'
		}
	];

	container.innerHTML = insights.map(i => `
		<div class="insight-item">
			<div class="insight-icon">${i.icon}</div>
			<div class="insight-content">
				<span class="insight-title">${i.title}</span>
				<span class="insight-desc">${i.desc}</span>
				<span class="insight-tag ${i.tag}">${i.tagText}</span>
			</div>
		</div>
	`).join('');
}

function updateSuggestorSummary(suggestions) {
	const top = suggestions[0];
	if (!top) return;

	const bestPick = document.getElementById('bestPick');
	const expectedReturn = document.getElementById('expectedReturn');
	const overallTrend = document.getElementById('overallTrend');
	const overallRisk = document.getElementById('overallRisk');

	if (bestPick) bestPick.textContent = top.crop.name;
	if (expectedReturn) expectedReturn.textContent = `₹${(top.crop.returnPerAcre / 1000).toFixed(0)}K/acre`;

	if (overallTrend) {
		const risingCount = suggestions.filter(s => s.trend?.trend === 'rising').length;
		const trendText = risingCount >= 3 ? 'Bullish' : risingCount >= 1 ? 'Positive' : 'Neutral';
		overallTrend.textContent = trendText;
		overallTrend.className = 'summary-value ' + (risingCount >= 2 ? 'trend-up' : 'trend-down');
	}

	if (overallRisk) {
		const lowRiskCount = suggestions.filter(s => s.crop.riskLevel === 'Low').length;
		const riskText = lowRiskCount >= 3 ? 'Low' : lowRiskCount >= 1 ? 'Medium' : 'High';
		overallRisk.textContent = riskText;
		overallRisk.className = 'summary-value risk-' + riskText.toLowerCase();
	}
}

function initCropSuggestor() {
	const btn = document.getElementById('generateSuggestions');
	const regionSelect = document.getElementById('suggestorRegion');
	const seasonSelect = document.getElementById('suggestorSeason');
	const landSelect = document.getElementById('suggestorLand');

	if (btn) btn.addEventListener('click', generateCropSuggestions);
	if (regionSelect) regionSelect.addEventListener('change', generateCropSuggestions);
	if (seasonSelect) seasonSelect.addEventListener('change', generateCropSuggestions);
	if (landSelect) landSelect.addEventListener('change', generateCropSuggestions);

	generateCropSuggestions();
}

function initInteractiveMap() {
	const mapEl = document.getElementById('indiaMap');
	if (!mapEl || typeof L === 'undefined') return;

	// India state-wise agricultural production data (2024-25 estimates, million tonnes)
	const stateAgriData = {
		'Uttar Pradesh': { production: 62.5, farmers: 23400000, crop: 'Sugarcane, Wheat, Rice', yield: 3.5, area: '17.1M ha' },
		'Punjab': { production: 33.8, farmers: 1090000, crop: 'Wheat, Rice, Cotton', yield: 4.8, area: '7.8M ha' },
		'Madhya Pradesh': { production: 30.2, farmers: 8500000, crop: 'Soybean, Wheat, Chickpea', yield: 2.4, area: '15.2M ha' },
		'Haryana': { production: 19.7, farmers: 1600000, crop: 'Wheat, Rice, Mustard', yield: 4.2, area: '6.4M ha' },
		'Rajasthan': { production: 18.4, farmers: 7800000, crop: 'Bajra, Mustard, Pulses', yield: 1.6, area: '21.1M ha' },
		'West Bengal': { production: 32.1, farmers: 7100000, crop: 'Rice, Jute, Potato', yield: 3.1, area: '7.1M ha' },
		'Maharashtra': { production: 24.6, farmers: 13500000, crop: 'Sugarcane, Cotton, Soybean', yield: 1.8, area: '17.4M ha' },
		'Andhra Pradesh': { production: 32.4, farmers: 12000000, crop: 'Rice, Chili, Cotton, Maize', yield: 3.1, area: '13.3M ha' },
		'Tamil Nadu': { production: 14.8, farmers: 5100000, crop: 'Rice, Sugarcane, Banana', yield: 3.5, area: '5.6M ha' },
		'Karnataka': { production: 15.6, farmers: 7800000, crop: 'Ragi, Rice, Sugarcane', yield: 2.0, area: '10.3M ha' },
		'Gujarat': { production: 16.9, farmers: 5400000, crop: 'Cotton, Groundnut, Castor', yield: 2.5, area: '9.8M ha' },
		'Bihar': { production: 16.3, farmers: 8000000, crop: 'Rice, Wheat, Maize', yield: 2.8, area: '7.0M ha' },
		'Telangana': { production: 13.2, farmers: 5800000, crop: 'Rice, Cotton, Maize', yield: 2.9, area: '5.8M ha' },
		'Odisha': { production: 11.5, farmers: 4600000, crop: 'Rice, Pulses, Oilseeds', yield: 2.0, area: '5.1M ha' },
		'Assam': { production: 8.3, farmers: 2700000, crop: 'Rice, Tea, Jute', yield: 2.5, area: '3.4M ha' },
		'Chhattisgarh': { production: 9.8, farmers: 3700000, crop: 'Rice, Maize, Soybean', yield: 1.9, area: '5.8M ha' },
		'Jharkhand': { production: 5.4, farmers: 2400000, crop: 'Rice, Maize, Pulses', yield: 1.7, area: '2.1M ha' },
		'Kerala': { production: 4.2, farmers: 2900000, crop: 'Coconut, Rubber, Rice', yield: 2.9, area: '2.7M ha' },
		'Uttarakhand': { production: 2.8, farmers: 860000, crop: 'Rice, Wheat, Sugarcane', yield: 2.4, area: '0.8M ha' },
		'Himachal Pradesh': { production: 1.7, farmers: 930000, crop: 'Apple, Wheat, Maize', yield: 1.9, area: '0.5M ha' },
		'Jammu and Kashmir': { production: 2.1, farmers: 1400000, crop: 'Apple, Rice, Saffron', yield: 2.2, area: '0.8M ha' },
		'Goa': { production: 0.4, farmers: 60000, crop: 'Rice, Cashew, Coconut', yield: 2.6, area: '0.1M ha' },
		'Tripura': { production: 1.2, farmers: 540000, crop: 'Rice, Rubber, Tea', yield: 2.5, area: '0.3M ha' },
		'Meghalaya': { production: 0.8, farmers: 320000, crop: 'Rice, Potato, Ginger', yield: 1.8, area: '0.3M ha' },
		'Manipur': { production: 0.6, farmers: 280000, crop: 'Rice, Fruits, Vegetables', yield: 2.1, area: '0.2M ha' },
		'Nagaland': { production: 0.5, farmers: 240000, crop: 'Rice, Maize, Pulses', yield: 1.6, area: '0.2M ha' },
		'Mizoram': { production: 0.3, farmers: 120000, crop: 'Rice, Maize, Sugarcane', yield: 1.8, area: '0.1M ha' },
		'Arunachal Pradesh': { production: 0.4, farmers: 170000, crop: 'Rice, Maize, Millet', yield: 1.5, area: '0.2M ha' },
		'Sikkim': { production: 0.2, farmers: 66000, crop: 'Cardamom, Rice, Maize', yield: 1.9, area: '0.1M ha' },
		'NCT of Delhi': { production: 0.1, farmers: 20000, crop: 'Vegetables, Floriculture', yield: 3.0, area: '0.02M ha' },
		'Chandigarh': { production: 0.01, farmers: 500, crop: 'Vegetables', yield: 2.5, area: '0.001M ha' },
		'Puducherry': { production: 0.08, farmers: 15000, crop: 'Rice, Sugarcane', yield: 3.2, area: '0.02M ha' },
		'Dadra and Nagar Haveli and Daman and Diu': { production: 0.06, farmers: 12000, crop: 'Rice, Pulses', yield: 1.8, area: '0.02M ha' },
		'Lakshadweep': { production: 0.01, farmers: 2500, crop: 'Coconut', yield: 1.2, area: '0.003M ha' },
		'Andaman and Nicobar Islands': { production: 0.05, farmers: 8000, crop: 'Coconut, Rice', yield: 2.0, area: '0.01M ha' },
		'Ladakh': { production: 0.03, farmers: 15000, crop: 'Barley, Apricot, Wheat', yield: 0.8, area: '0.01M ha' }
	};

	// Name mapping from GeoJSON NAME_1 → our data keys
	const nameMap = {
		'Orissa': 'Odisha',
		'Uttaranchal': 'Uttarakhand',
		'Delhi': 'NCT of Delhi',
		'Andaman and Nicobar': 'Andaman and Nicobar Islands',
		'Daman and Diu': 'Dadra and Nagar Haveli and Daman and Diu',
		'Dadra and Nagar Haveli': 'Dadra and Nagar Haveli and Daman and Diu'
	};

	function getColor(production) {
		return production > 25 ? '#b30000' :
			   production > 15 ? '#e34a33' :
			   production > 8  ? '#fc8d59' :
			   production > 3  ? '#fdcc8a' :
			                     '#fef0d9';
	}

	const map = L.map('indiaMap', {
		center: [22.5, 82],
		zoom: 5,
		minZoom: 4,
		maxZoom: 7,
		scrollWheelZoom: true,
		zoomControl: true
	});

	const isDarkNow = !rootElement.classList.contains('light');
	const tileUrl = isDarkNow
		? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
		: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
	const tileLayer = L.tileLayer(tileUrl, {
		attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
		subdomains: 'abcd',
		maxZoom: 10
	}).addTo(map);
	window._leafletTileLayer = tileLayer;
	window._leafletMap = map;

	fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson')
		.then(res => res.json())
		.then(geoData => {
			let selectedLayer = null;

			function style(feature) {
				const rawName = feature.properties.NAME_1 || feature.properties.name || '';
				const stateName = nameMap[rawName] || rawName;
				const data = stateAgriData[stateName];
				const production = data ? data.production : 0.5;
				return {
					fillColor: getColor(production),
					weight: 1,
					opacity: 0.8,
					color: 'rgba(255, 255, 255, 0.25)',
					fillOpacity: 0.85
				};
			}

			function highlightFeature(e) {
				const layer = e.target;
				if (layer !== selectedLayer) {
					layer.setStyle({ weight: 2.5, color: '#22c55e', fillOpacity: 0.95 });
					layer.bringToFront();
					if (selectedLayer) selectedLayer.bringToFront();
				}
			}

			function resetHighlight(e) {
				const layer = e.target;
				if (layer !== selectedLayer) {
					geojsonLayer.resetStyle(layer);
				}
			}

			function onEachFeature(feature, layer) {
				const rawName = feature.properties.NAME_1 || feature.properties.name || 'Unknown';
				const stateName = nameMap[rawName] || rawName;
				const data = stateAgriData[stateName];

				layer.bindTooltip(stateName, {
					permanent: false,
					direction: 'center',
					className: 'state-tooltip'
				});

				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: function (e) {
						if (selectedLayer) {
							geojsonLayer.resetStyle(selectedLayer);
						}
						selectedLayer = layer;
						layer.setStyle({ weight: 3, color: '#10b981', fillOpacity: 0.95 });
						layer.bringToFront();
						map.fitBounds(layer.getBounds(), { padding: [30, 30] });

						const info = document.getElementById('mapRegionInfo');
						if (info && data) {
							info.innerHTML = `
								<div class="info-item"><span class="label">State:</span><span class="value">${stateName}</span></div>
								<div class="info-item"><span class="label">Production:</span><span class="value">${data.production}M tonnes</span></div>
								<div class="info-item"><span class="label">Farmers:</span><span class="value">${(data.farmers / 1e6).toFixed(1)}M</span></div>
								<div class="info-item"><span class="label">Cultivated Area:</span><span class="value">${data.area}</span></div>
								<div class="info-item"><span class="label">Major Crops:</span><span class="value">${data.crop}</span></div>
								<div class="info-item"><span class="label">Avg Yield:</span><span class="value">${data.yield} t/ha</span></div>
							`;
						} else if (info) {
							info.innerHTML = `
								<div class="info-item"><span class="label">State:</span><span class="value">${stateName}</span></div>
								<div class="info-item"><span class="label">Data:</span><span class="value">Limited data available</span></div>
							`;
						}
					}
				});
			}

			const geojsonLayer = L.geoJSON(geoData, { style, onEachFeature }).addTo(map);
			map.fitBounds(geojsonLayer.getBounds());
		})
		.catch(err => {
			console.error('Failed to load India GeoJSON:', err);
			mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-light);">Map loading failed. Check internet connection.</div>';
		});

	// Fix Leaflet rendering when section becomes visible
	setTimeout(() => map.invalidateSize(), 300);
	const observer = new MutationObserver(() => {
		if (mapEl.offsetParent !== null) {
			map.invalidateSize();
		}
	});
	observer.observe(mapEl.closest('.content-section') || document.body, { attributes: true, subtree: true });
}

window.addEventListener('beforeunload', () => {
	stopLiveFeedPolling();
});

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const BLOOM_SYSTEM_PROMPT = `You are Bloom AI, an expert agricultural intelligence assistant built into the Kisan Raksha dashboard for Indian farmers.

YOUR KNOWLEDGE BASE:
- MSP 2025-26: Wheat ₹2,275/q, Rice ₹2,320/q, Cotton ₹7,121/q, Mustard ₹5,650/q, Chana ₹5,650/q, Sugarcane ₹340/q, Maize ₹2,090/q, Soybean ₹4,892/q
- Seasons: Kharif (Jun-Oct), Rabi (Nov-Mar), Zaid (Mar-Jun). Current: Rabi, February 2026
- Regions: Punjab (Wheat-Rice, 4.8t/ha), Haryana (Wheat-Mustard, 4.2t/ha), UP (Sugarcane-Wheat, 3.5t/ha), Rajasthan (Bajra-Pulses, 1.6t/ha), Maharashtra (Cotton-Sugarcane, 1.8t/ha), MP (Soybean-Wheat, 2.4t/ha), West Bengal (Rice-Jute, 3.1t/ha)
- Government schemes: PM-KISAN (₹6000/year), PM Fasal Bima Yojana, Soil Health Card, e-NAM, KCC
- Practices: crop rotation, drip irrigation (saves 40-60% water), SRI method, integrated pest management, organic certification (NPOP)

RESPONSE RULES:
1. Give DETAILED, comprehensive answers with specific numbers, prices, percentages, and actionable steps
2. ONLY use these inline HTML tags: <strong>, <em>, <br>. DO NOT use <html>, <head>, <body>, <style>, <h1>-<h6>, <div>, <p>, <ul>, <li>, <table> or any block-level HTML. NO CSS. NO full HTML documents.
3. Use <br> for line breaks and <br><br> for paragraph spacing
4. Use bullet character • as bullet points. NEVER use emojis. Keep formatting clean and professional.
5. For crop queries: mention MSP, expected yield, investment cost, ROI, best varieties, sowing window
6. For market queries: mention current price trends, demand drivers, export potential
7. Be thorough — give 200-300 words with real data points
8. Always end with a practical tip or next step the farmer can take
9. Structure with • bullet points and <strong> section headers, separated by <br>`;

function buildRequestBody(userMessage) {
	return JSON.stringify({
		system_instruction: {
			parts: [{ text: BLOOM_SYSTEM_PROMPT }]
		},
		contents: [{
			role: 'user',
			parts: [{ text: userMessage }]
		}],
		generationConfig: {
			temperature: 0.7,
			maxOutputTokens: 1500,
			topP: 0.9,
			thinkingConfig: { thinkingBudget: 0 }
		},
		safetySettings: [
			{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
			{ category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
			{ category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
			{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
		]
	});
}

function parseGeminiResponse(data) {
	const parts = data?.candidates?.[0]?.content?.parts;
	if (!parts || parts.length === 0) return null;

	// Skip any "thought" parts from 2.5 models, grab the text part
	const textPart = parts.find(p => p.text !== undefined && !p.thought);
	let text = textPart?.text || parts[parts.length - 1]?.text;
	if (!text) return null;

	// Strip any full HTML document wrapper if the model returned one
	text = text.replace(/<!DOCTYPE[^>]*>/gi, '')
		.replace(/<\/?html[^>]*>/gi, '')
		.replace(/<\/?head[^>]*>[\s\S]*?<\/head>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<\/?body[^>]*>/gi, '')
		.replace(/<\/?div[^>]*>/gi, '')
		.replace(/<\/?p[^>]*>/gi, '<br>')
		.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '<br><strong>$1</strong><br>')
		.replace(/<\/?ul[^>]*>/gi, '')
		.replace(/<\/?ol[^>]*>/gi, '')
		.replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1<br>')
		.replace(/<\/?table[^>]*>/gi, '')
		.replace(/<\/?t[rdh][^>]*>/gi, ' ');

	text = text
		.replace(/^###\s*(.+)$/gm, '<strong>$1</strong>')
		.replace(/^##\s*(.+)$/gm, '<strong>$1</strong>')
		.replace(/^#\s*(.+)$/gm, '<strong>$1</strong>')
		.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
		.replace(/^\*\s+/gm, '• ')
		.replace(/-\s{1,3}/gm, '• ')
		.replace(/\n{3,}/g, '\n\n')
		.replace(/\n/g, '<br>');

	text = text.replace(/(<br>\s*){3,}/g, '<br><br>').trim();
	if (text.startsWith('<br>')) text = text.substring(4);

	return text;
}

async function callGeminiAPI(userMessage) {
	const key = CONFIG.geminiKey;
	const body = buildRequestBody(userMessage);

	for (const model of GEMINI_MODELS) {
		const url = `${GEMINI_BASE}/${model}:generateContent?key=${key}`;

		// Try up to 2 attempts per model (initial + 1 retry for rate limit)
		for (let attempt = 0; attempt < 2; attempt++) {
			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body
				});

				if (response.ok) {
					const data = await response.json();
					const result = parseGeminiResponse(data);
					if (result) return result;
				}

				if (response.status === 429 && attempt === 0) {
					// Rate limited — wait and retry once
					const errData = await response.json().catch(() => ({}));
					const retryMatch = errData?.error?.details?.find(d => d.retryDelay);
					const waitSec = retryMatch ? Math.min(parseInt(retryMatch.retryDelay) || 5, 30) : 5;
					console.warn(`Gemini ${model} rate limited, retrying in ${waitSec}s...`);
					await new Promise(r => setTimeout(r, waitSec * 1000));
					continue;
				}

				// Non-retryable error on this model — try next model
				console.warn(`Gemini ${model} returned ${response.status}, trying next model...`);
				break;

			} catch (err) {
				console.error(`Gemini ${model} network error:`, err);
				break;
			}
		}
	}

	return null;
}

function initBloomAI() {
	const input = document.getElementById('bloomAiInput');
	const sendBtn = document.getElementById('bloomSendBtn');
	const clearBtn = document.getElementById('aiClearBtn');
	const chatArea = document.getElementById('bloomChatArea');

	if (!input || !sendBtn || !chatArea) return;

	async function sendMessage() {
		const text = input.value.trim();
		if (!text) return;

		appendMessage(text, 'user');
		input.value = '';
		input.disabled = true;
		sendBtn.disabled = true;

		const typingEl = showTyping();

		const aiResponse = await callGeminiAPI(text);

		typingEl.remove();
		if (aiResponse) {
			appendMessage(aiResponse, 'ai');
		} else {
			const fallback = generateLocalResponse(text);
			appendMessage(fallback + '<br><br><em style="opacity:0.6;font-size:0.85em;">⚠️ AI service temporarily unavailable — showing cached response</em>', 'ai');
		}

		input.disabled = false;
		sendBtn.disabled = false;
		input.focus();
	}

	sendBtn.addEventListener('click', sendMessage);
	input.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') sendMessage();
	});

	document.querySelectorAll('.ai-suggest-chip').forEach(chip => {
		chip.addEventListener('click', () => {
			input.value = chip.dataset.query;
			sendMessage();
		});
	});

	if (clearBtn) {
		clearBtn.addEventListener('click', () => {
			const messages = chatArea.querySelectorAll('.ai-message:not(.ai-welcome)');
			messages.forEach(m => m.remove());
		});
	}
}

function appendMessage(text, type) {
	const chatArea = document.getElementById('bloomChatArea');
	if (!chatArea) return;

	const msg = document.createElement('div');
	msg.className = `ai-message ${type === 'user' ? 'user-message' : ''}`;

	const avatarSvg = type === 'user'
		? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
		: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5L12 13l-2.5-1.5C8 10.5 7 9 7 7a5 5 0 0 1 5-5z"/><path d="M12 13v9"/></svg>';

	msg.innerHTML = `
		<div class="ai-avatar">${avatarSvg}</div>
		<div class="ai-bubble"><p>${text}</p></div>
	`;

	chatArea.appendChild(msg);
	chatArea.scrollTop = chatArea.scrollHeight;
}

function showTyping() {
	const chatArea = document.getElementById('bloomChatArea');
	const typing = document.createElement('div');
	typing.className = 'ai-message';
	typing.innerHTML = `
		<div class="ai-avatar">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5L12 13l-2.5-1.5C8 10.5 7 9 7 7a5 5 0 0 1 5-5z"/><path d="M12 13v9"/></svg>
		</div>
		<div class="ai-bubble">
			<div class="ai-typing"><span></span><span></span><span></span></div>
		</div>
	`;
	chatArea.appendChild(typing);
	chatArea.scrollTop = chatArea.scrollHeight;
	return typing;
}

function generateLocalResponse(query) {
	const q = query.toLowerCase();

	if (q.includes('crop') && (q.includes('grow') || q.includes('suggest') || q.includes('best') || q.includes('season'))) {
		const region = q.includes('punjab') ? 'Punjab' : q.includes('haryana') ? 'Haryana' : q.includes('rajasthan') ? 'Rajasthan' : q.includes('maharashtra') ? 'Maharashtra' : q.includes('uttar pradesh') || q.includes('up') ? 'Uttar Pradesh' : 'your region';
		return `Based on current market trends for <strong>${region}</strong>:<br><br>
		🌾 <strong>Wheat</strong> — MSP ₹2,275/quintal, prices rising +5.2%. Low risk, stable demand.<br>
		🫘 <strong>Pulses</strong> — Prices surging +8.2%, government push for production. High returns.<br>
		🌻 <strong>Mustard</strong> — Strong demand due to edible oil import reduction policy. +6.8% growth.<br><br>
		💡 <em>Use the Crop Suggestor below for personalized recommendations based on your region, season & land size.</em>`;
	}

	if (q.includes('market') || q.includes('price') || q.includes('trend')) {
		const crop = q.includes('wheat') ? 'Wheat' : q.includes('rice') ? 'Rice' : q.includes('cotton') ? 'Cotton' : q.includes('pulse') ? 'Pulses' : null;
		if (crop) {
			const trends = { Wheat: { change: '+5.2%', msp: '₹2,275', outlook: 'Strong flour mill demand + export' }, Rice: { change: '+2.1%', msp: '₹2,203', outlook: 'Steady domestic + Basmati exports' }, Cotton: { change: '+7.1%', msp: '₹6,620', outlook: 'Global textile demand surge' }, Pulses: { change: '+8.2%', msp: '₹5,650', outlook: 'Gov policy support + high MSP hikes' } };
			const t = trends[crop];
			return `📊 <strong>${crop} Market Analysis:</strong><br><br>Price Trend: <strong>${t.change}</strong> | MSP: <strong>${t.msp}/quintal</strong><br>Outlook: ${t.outlook}<br><br>📈 Check the <strong>Market Price Prediction</strong> section for detailed 7-day forecasts.`;
		}
		return `📈 <strong>Current Market Summary:</strong><br><br>• Pulses: <strong>+8.2%</strong> — highest growth<br>• Cotton: <strong>+7.1%</strong> — textile demand surge<br>• Mustard: <strong>+6.8%</strong> — oil import reduction<br>• Maize: <strong>+6.3%</strong> — animal feed demand<br>• Wheat: <strong>+5.2%</strong> — steady exports<br><br>Overall market sentiment: <strong style="color:#22c55e">Bullish</strong>`;
	}

	if (q.includes('weather') || q.includes('rain') || q.includes('climate') || q.includes('temperature')) {
		return `🌦️ <strong>Weather Impact Analysis:</strong><br><br>Current: <strong>28°C, Partly Cloudy</strong> | Humidity: 65% | Soil Moisture: 72%<br><br>
		• Good conditions for Rabi crops (wheat, mustard, chickpea)<br>
		• Adequate soil moisture — no irrigation stress<br>
		• 7-day forecast shows mild weather — ideal for crop growth<br><br>
		⚠️ <em>Monitor for late frost in northern regions during Feb.</em>`;
	}

	if (q.includes('region') || q.includes('punjab') || q.includes('haryana') || q.includes('rajasthan') || q.includes('maharashtra') || q.includes('uttar pradesh')) {
		return `🗺️ <strong>Regional Agricultural Overview:</strong><br><br>
		🏆 <strong>Punjab</strong> — 12,847 farmers | Wheat-Rice belt | Yield: 4.2 t/ha<br>
		📊 <strong>UP</strong> — 15,234 farmers | Sugarcane-Wheat | Yield: 3.5 t/ha<br>
		🌾 <strong>Haryana</strong> — 8,923 farmers | Basmati Rice hub | Yield: 3.8 t/ha<br>
		🏜️ <strong>Rajasthan</strong> — 6,789 farmers | Bajra-Pulses | Yield: 2.8 t/ha<br>
		🍊 <strong>Maharashtra</strong> — 9,456 farmers | Cotton-Orange | Yield: 3.1 t/ha<br><br>
		Check <strong>Regional Analysis</strong> in the sidebar for detailed data.`;
	}

	if (q.includes('yield') || q.includes('improve') || q.includes('tips') || q.includes('practice')) {
		return `📋 <strong>Top Farming Practices for Better Yield:</strong><br><br>
		1. 🔄 <strong>Crop Rotation</strong> — Alternate wheat-pulses for soil nitrogen<br>
		2. 💧 <strong>Drip Irrigation</strong> — Save 40-60% water, boost yield 20-30%<br>
		3. 🧪 <strong>Soil Testing</strong> — Test every season, optimize fertilizer use<br>
		4. 🌱 <strong>Quality Seeds</strong> — Use certified varieties (HD-2967, Pusa 1121)<br>
		5. 📅 <strong>Timing</strong> — Follow recommended sowing windows for your region<br><br>
		<em>Avg. yield improvement: <strong>15-25%</strong> with these practices.</em>`;
	}

	return `Thanks for your question! I can help with:<br><br>
	🌾 <strong>Crop suggestions</strong> — what to grow based on trends<br>
	📈 <strong>Market analysis</strong> — prices, demand, forecasts<br>
	🌦️ <strong>Weather impact</strong> — climate effects on farming<br>
	🗺️ <strong>Regional data</strong> — state-wise agricultural insights<br>
	📋 <strong>Farming tips</strong> — best practices for higher yield<br><br>
	<em>Try asking: "What crop should I grow this season?" or "Show me wheat market trends"</em><br><br>
	🔮 <em>Full RAG-powered responses coming soon with verified agricultural knowledge base!</em>`;
}
