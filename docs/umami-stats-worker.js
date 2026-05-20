const ORIGIN = "https://yuulog.org";
const START_AT = Date.parse("2026-05-11T00:00:00.000Z");
const TIME_ZONE = "Europe/Berlin";

const berlinFormatter = new Intl.DateTimeFormat("en-CA", {
	timeZone: TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
});

function json(body, init = {}) {
	const h = new Headers(init.headers);
	h.set("Access-Control-Allow-Origin", ORIGIN);
	h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
	h.set("Access-Control-Allow-Headers", "Content-Type");
	h.set("Cache-Control", "public, max-age=60");
	h.set("Content-Type", "application/json; charset=utf-8");
	const responseBody = init.status === 204 ? null : JSON.stringify(body);
	return new Response(responseBody, { ...init, headers: h });
}

function fail() {
	return json({
		ok: false,
		online: null,
		todayVisitors: null,
		todayViews: null,
		yesterdayViews: null,
		monthViews: null,
		totalViews: null,
		totalVisitors: null,
		views: null,
		visitors: null,
		updatedAt: new Date().toISOString(),
	});
}

function normalizePath(path) {
	if (!path) return "/";
	return path.startsWith("/") ? path : `/${path}`;
}

function num(value) {
	const n = Number(value?.value ?? value);
	return Number.isFinite(n) ? n : null;
}

function berlinParts(date) {
	const parts = Object.fromEntries(
		berlinFormatter
			.formatToParts(date)
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, Number(part.value)]),
	);
	if (parts.hour === 24) parts.hour = 0;
	return parts;
}

function berlinLocalToUtcMs(year, month, day) {
	let utc = Date.UTC(year, month - 1, day);

	for (let i = 0; i < 2; i += 1) {
		const parts = berlinParts(new Date(utc));
		const asUtc = Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day,
			parts.hour,
			parts.minute,
			parts.second,
		);
		utc -= asUtc - Date.UTC(year, month - 1, day);
	}

	return utc;
}

function berlinRanges(now = new Date()) {
	const { year, month, day } = berlinParts(now);
	const todayStart = berlinLocalToUtcMs(year, month, day);
	const tomorrowStart = berlinLocalToUtcMs(year, month, day + 1);
	const yesterdayStart = berlinLocalToUtcMs(year, month, day - 1);
	const monthStart = berlinLocalToUtcMs(year, month, 1);
	const nowAt = now.getTime();

	return {
		today: [todayStart, Math.min(nowAt, tomorrowStart - 1)],
		yesterday: [yesterdayStart, todayStart - 1],
		month: [monthStart, nowAt],
		total: [START_AT, nowAt],
	};
}

function apiBase(env) {
	return env.UMAMI_API_URL.replace(/\/$/, "").replace(/\/v1$/, "");
}

function umamiUrl(env, endpoint) {
	return new URL(
		`${apiBase(env)}/v1/websites/${env.UMAMI_WEBSITE_ID}/${endpoint}`,
	);
}

function umamiHeaders(env) {
	return {
		Accept: "application/json",
		"x-umami-api-key": env.UMAMI_API_KEY,
	};
}

async function fetchJson(url, env) {
	const res = await fetch(url, { headers: umamiHeaders(env) });
	if (!res.ok) throw new Error("Umami request failed");
	return res.json();
}

async function stats(env, { startAt, endAt, path }) {
	const url = umamiUrl(env, "stats");

	url.searchParams.set("startAt", String(startAt));
	url.searchParams.set("endAt", String(endAt));
	if (path !== "/") url.searchParams.set("path", path);

	const data = await fetchJson(url, env);
	return {
		views: num(data.pageviews ?? data.views),
		visitors: num(data.visitors),
	};
}

async function statValue(env, options, key) {
	try {
		return (await stats(env, options))[key] ?? null;
	} catch {
		return null;
	}
}

async function active(env) {
	try {
		const url = umamiUrl(env, "active");
		const data = await fetchJson(url, env);
		return num(data.visitors ?? data.active ?? data.value ?? data);
	} catch {
		return null;
	}
}

async function summary(env, path) {
	const ranges = berlinRanges();
	const [
		online,
		todayVisitors,
		todayViews,
		yesterdayViews,
		monthViews,
		total,
	] = await Promise.all([
		active(env),
		statValue(
			env,
			{ startAt: ranges.today[0], endAt: ranges.today[1], path },
			"visitors",
		),
		statValue(
			env,
			{ startAt: ranges.today[0], endAt: ranges.today[1], path },
			"views",
		),
		statValue(
			env,
			{ startAt: ranges.yesterday[0], endAt: ranges.yesterday[1], path },
			"views",
		),
		statValue(
			env,
			{ startAt: ranges.month[0], endAt: ranges.month[1], path },
			"views",
		),
		stats(env, {
			startAt: ranges.total[0],
			endAt: ranges.total[1],
			path,
		}).catch(() => ({ views: null, visitors: null })),
	]);

	return {
		ok: true,
		online,
		todayVisitors,
		todayViews,
		yesterdayViews,
		monthViews,
		totalViews: total.views ?? null,
		totalVisitors: total.visitors ?? null,
		views: total.views ?? null,
		visitors: total.visitors ?? null,
		updatedAt: new Date().toISOString(),
	};
}

export default {
	async fetch(request, env) {
		if (request.method === "OPTIONS") return json(null, { status: 204 });
		if (request.method !== "GET") return fail();

		try {
			const reqUrl = new URL(request.url);
			const path = normalizePath(reqUrl.searchParams.get("path"));
			return json(await summary(env, path));
		} catch {
			return fail();
		}
	},
};
