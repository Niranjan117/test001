document.addEventListener('DOMContentLoaded', () => {
	const toggleInput = document.querySelector('.toggle input');
	const rootElement = document.documentElement;

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

	toggleInput.addEventListener('input', (event) => {
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
			console.warn("View Transition API not supported. Falling back.");
			applyTheme(isDark);
			return;
		}

		const transition = document.startViewTransition(() => {
			applyTheme(isDark);
		});

		transition.ready.then(() => {
			rootElement.style.setProperty('--x', `${x}px`);
			rootElement.style.setProperty('--y', `${y}px`);
		}).catch(error => {
			console.error("Error during View Transition setup:", error);
		});

		transition.finished.then(() => {
			console.log("Transition finished.");
		}).catch(error => {
			console.error("Error during View Transition finish:", error);
		});
	});

	// Panel Navigation
	const navButtons = document.querySelectorAll('.nav-btn');
	const panelOverlays = document.querySelectorAll('.panel-overlay');
	const closeButtons = document.querySelectorAll('.close-btn');
	const shinyButton = document.querySelector('.shiny-cta');
	const arrow = document.querySelector('.arrow');

	navButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const section = button.getAttribute('data-section');
			const overlay = document.getElementById(`${section}-overlay`);
			if (overlay) {
				overlay.classList.add('active');
				document.body.style.overflow = 'hidden';
			}
		});
	});

	const closePanel = (overlay) => {
		if (overlay) {
			overlay.classList.remove('active');
			document.body.style.overflow = 'auto';
		}
	};

	closeButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const overlay = btn.closest('.panel-overlay');
			closePanel(overlay);
		});
	});

	panelOverlays.forEach(overlay => {
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				closePanel(overlay);
			}
		});
	});

	window.addEventListener('scroll', () => {
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrolled = window.scrollY;
		if (scrolled >= scrollHeight * 0.95) {
			shinyButton.classList.add('visible');
		} else {
			shinyButton.classList.remove('visible');
		}
		if (scrolled > 50) {
			arrow.classList.add('hidden');
		} else {
			arrow.classList.remove('hidden');
		}
	});
});
