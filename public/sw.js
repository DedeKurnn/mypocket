self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open("my-cache").then((cache) => {
			return cache.addAll([
				"/",
				"/index.html",
				"/styles.css",
				// Add more files to precache
			]);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});

// When the service worker is activated, clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => {
						return (
							cacheName.startsWith("my-cache-") &&
							cacheName !== "my-cache"
						);
					})
					.map((cacheName) => {
						return caches.delete(cacheName);
					})
			);
		})
	);
});
