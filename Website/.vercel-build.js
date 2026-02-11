const fs = require('fs');
const path = require('path');

// Read template file
let configContent = fs.readFileSync(path.join(__dirname, 'js', 'config.template.js'), 'utf8');

// Replace all placeholders with environment variables
const replacements = {
	'__VITE_FIREBASE_API_KEY__': process.env.VITE_FIREBASE_API_KEY,
	'__VITE_FIREBASE_AUTH_DOMAIN__': process.env.VITE_FIREBASE_AUTH_DOMAIN,
	'__VITE_FIREBASE_PROJECT_ID__': process.env.VITE_FIREBASE_PROJECT_ID,
	'__VITE_FIREBASE_STORAGE_BUCKET__': process.env.VITE_FIREBASE_STORAGE_BUCKET,
	'__VITE_FIREBASE_MESSAGING_SENDER_ID__': process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	'__VITE_FIREBASE_APP_ID__': process.env.VITE_FIREBASE_APP_ID,
	'__VITE_FIREBASE_MEASUREMENT_ID__': process.env.VITE_FIREBASE_MEASUREMENT_ID,
	'__VITE_BACKEND_API__': process.env.VITE_BACKEND_API,
	'__VITE_GEMINI_API_KEY__': process.env.VITE_GEMINI_API_KEY
};

for (const [placeholder, value] of Object.entries(replacements)) {
	if (!value) {
		console.error(`Missing environment variable for ${placeholder}`);
		process.exit(1);
	}
	configContent = configContent.replace(placeholder, value);
}

// Write the config.js file
fs.writeFileSync(path.join(__dirname, 'js', 'config.js'), configContent);

console.log('Build complete: js/config.js generated from template with environment variables.');
