// Language switcher with smart page matching and localStorage persistence
(function() {
	'use strict';

	const LANG_KEY = 'preferredLanguage';
	const languages = ['en', 'se', 'ro'];

	// Get stored language preference
	function getStoredLanguage() {
		try {
			return localStorage.getItem(LANG_KEY) || 'en';
		} catch (e) {
			return 'en';
		}
	}

	// Store language preference
	function storeLanguage(lang) {
		try {
			localStorage.setItem(LANG_KEY, lang);
		} catch (e) {
			// localStorage not available
		}
	}

	// Get current page info
	function getCurrentPageInfo() {
		const currentLang = document.documentElement.getAttribute('data-current-lang') || 'en';
		const currentPath = document.documentElement.getAttribute('data-current-path') || '/';
		return { currentLang, currentPath };
	}

	// Try to find the equivalent page in the target language
	function getTargetUrl(targetLang) {
		const { currentLang, currentPath } = getCurrentPageInfo();

		// If we're already on this language, just return current path
		if (currentLang === targetLang) {
			return currentPath;
		}

		// Try to replace the language in the path
		const langPattern = new RegExp(`^/(${languages.join('|')})/`);

		// Check if path starts with a language code
		if (langPattern.test(currentPath)) {
			// Replace the language code
			return currentPath.replace(langPattern, `/${targetLang}/`);
		}

		// If no language in path, or root path, go to language home
		return `/${targetLang}/`;
	}

	// Update home link based on stored preference
	function updateHomeLink() {
		const homeLink = document.getElementById('home-link');
		if (homeLink) {
			const preferredLang = getStoredLanguage();
			homeLink.href = `/${preferredLang}/`;
		}
	}

	// Check if a URL exists (simplified - just try to navigate)
	async function checkUrlExists(url) {
		try {
			const response = await fetch(url, { method: 'HEAD' });
			return response.ok;
		} catch (e) {
			return false;
		}
	}

	// Handle language switch
	async function switchLanguage(e) {
		e.preventDefault();
		const targetLang = e.currentTarget.getAttribute('data-lang');

		if (!targetLang || !languages.includes(targetLang)) {
			return;
		}

		// Store preference
		storeLanguage(targetLang);

		// Get target URL
		const targetUrl = getTargetUrl(targetLang);

		// Try to check if URL exists (best effort)
		// Note: This might not work due to CORS, but we'll navigate anyway
		const exists = await checkUrlExists(targetUrl);

		if (!exists && targetUrl !== `/${targetLang}/`) {
			// If the specific page doesn't exist, try the language home
			window.location.href = `/${targetLang}/`;
		} else {
			// Navigate to target URL
			window.location.href = targetUrl;
		}
	}

	// Initialize
	function init() {
		// Update home link on page load
		updateHomeLink();

		// Add event listeners to language switcher links
		document.querySelectorAll('.lang-switch').forEach(link => {
			link.addEventListener('click', switchLanguage);
		});

		// Update active state based on current language
		const { currentLang } = getCurrentPageInfo();
		document.querySelectorAll('.lang-switch').forEach(link => {
			if (link.getAttribute('data-lang') === currentLang) {
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
		});

		// Store current language as preference
		const { currentLang: pageLang } = getCurrentPageInfo();
		if (languages.includes(pageLang)) {
			storeLanguage(pageLang);
		}
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
