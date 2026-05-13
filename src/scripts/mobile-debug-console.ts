declare global {
	interface Window {
		__mizukiErudaLoaded?: boolean;
	}
}

const params = new URLSearchParams(window.location.search);

if (params.get("debug") === "1" && !window.__mizukiErudaLoaded) {
	window.__mizukiErudaLoaded = true;

	import("eruda")
		.then(({ default: eruda }) => {
			eruda.init();
		})
		.catch((error) => {
			console.error("Failed to load mobile debug console", error);
		});
}

export {};
