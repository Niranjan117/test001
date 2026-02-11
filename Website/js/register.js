import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import CONFIG from './config.js';

const app = initializeApp(CONFIG.firebase);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
	const toggleInput = document.querySelector('.toggle input');
	const rootElement = document.documentElement;
	const form = document.getElementById('farmerForm');

	const applyTheme = (isDark) => {
		if (isDark) {
			rootElement.classList.add('dark');
		} else {
			rootElement.classList.remove('dark');
		}
	};

	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	toggleInput.checked = prefersDark;
	applyTheme(prefersDark);

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
			return;
		}

		const transition = document.startViewTransition(() => {
			applyTheme(isDark);
		});

		transition.ready.then(() => {
			rootElement.style.setProperty('--x', `${x}px`);
			rootElement.style.setProperty('--y', `${y}px`);
		});
	});

	const countryButtons = document.querySelectorAll('.country-option');
	const countryInput = document.getElementById('country');
	const selectedCountrySpan = document.querySelector('.selected-country');
	const countryDetails = document.querySelector('.morphing-disclosure details');

	countryButtons.forEach(button => {
		button.addEventListener('click', () => {
			const value = button.dataset.value;
			const text = button.textContent;

			countryInput.value = value;

			selectedCountrySpan.textContent = text;

			countryButtons.forEach(btn => btn.classList.remove('selected'));

			button.classList.add('selected');

			countryDetails.open = false;

			if (value === 'india') {
				form.style.display = 'block';
			}
		});
	});

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		
		const formData = {
			country: document.getElementById('country').value,
			createdAt: serverTimestamp()
		};

		const loading = document.getElementById('loading');
		loading.classList.add('active');

		try {
			await addDoc(collection(db, 'farmers'), formData);
			setTimeout(() => {
				window.location.href = 'dashboard.html';
			}, 2000);
		} catch (error) {
			loading.classList.remove('active');
			alert('Registration failed: ' + error.message);
		}
	});
});
