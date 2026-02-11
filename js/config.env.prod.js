// Production configuration helper
// This file helps detect and configure the correct API endpoints based on the deployment environment

const getConfig = () => {
	const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	
	// Your Vercel domain - UPDATE THIS with your actual deployed URL
	const vercelDomain = 'https://bloom-website.vercel.app'; // Replace with your actual Vercel URL
	
	const baseConfig = {
		firebase: {
			apiKey: "AIzaSyAvH93dkPzxVAJH_-J3HmOTxVmcZBfw5KA",
			authDomain: "theorder-ecb23.firebaseapp.com",
			projectId: "theorder-ecb23",
			storageBucket: "theorder-ecb23.firebasestorage.app",
			messagingSenderId: "903169688021",
			appId: "1:903169688021:web:e56978a6a0bfa8d98ebd5c",
			measurementId: "G-SXCHTP5G7Z"
		},
		backendApi: isDevelopment ? "http://localhost:8000" : "https://bloom-w0r1.onrender.com",
		geminiKey: "AIzaSyCOnO7qNEi_IBDnxN9j4mopw4F99EQQNWo",
		deploymentUrl: window.location.origin,
		isDevelopment: isDevelopment
	};
	
	return baseConfig;
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = getConfig();
}
