const ORIGIN = "https://yuulog.org";
const START_AT = Date.parse("2026-05-11T00:00:00.000Z");

function json(body, init = {}) {
	const h = new Headers(init.headers);
	h.set("Access-Control-Allow-Origin", ORIGIN);
	h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
	h.set("Access-Control-Allow-Headers", "Content-Type");
	h.set("Cache-Control", "public, max-age=300");
	h.set("Content-Type", "application/json; charset=utf-8");
	return new Response(JSON.stringify(body), { ...init, headers: h });
}

function fail() {
	return json({ ok: false, views: null, visitors: null });
}

function normalizePath(path) {
	if (!path) return "/";
	return path.startsWith("/") ? path : `/${path}`;
}

function num(value) {
	return Number(value?.value ?? value);
}

export default {
	async fetch(request, env) {
		if (request.method === "OPTIONS") return json(null, { status: 204 });
		if (request.method !== "GET") return fail();

		try {
			const reqUrl = new URL(request.url);
			const apiBase = env.UMAMI_API_URL.replace(/\/$/, "").replace(/\/v1$/, "");
			const path = normalizePath(reqUrl.searchParams.get("path"));
			const url = new URL(
				`${apiBase}/v1/websites/${env.UMAMI_WEBSITE_ID}/stats`,
			);

			url.searchParams.set(
				"startAt",
				reqUrl.searchParams.get("startAt") || String(START_AT),
			);
			url.searchParams.set("endAt", String(Date.now()));

			if (path !== "/") {
				url.searchParams.set("path", path);
			}

			const res = await fetch(url, {
				headers: {
					Accept: "application/json",
					"x-umami-api-key": env.UMAMI_API_KEY,
				},
			});
			if (!res.ok) return fail();

			const stats = await res.json();
			const views = num(stats.pageviews ?? stats.views);
			const visitors = num(stats.visitors);

			if (!Number.isFinite(views) || !Number.isFinite(visitors)) {
				return fail();
			}

			return json({ ok: true, views, visitors });
		} catch {
			return fail();
		}
	},
};
