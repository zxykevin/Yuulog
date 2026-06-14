const HOSTNAME = "yuulog.org";
const START_DATE = "2026-05-09";
const TIME_ZONE = "Europe/Berlin";
const GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";

const CACHE_KEYS = {
	summary: "analytics:summary",
	details: "analytics:details",
	base: "analytics:base",
};
const SUMMARY_MAX_AGE = 5 * 60;
const DETAILS_MAX_AGE = 60 * 60;
const BASE_MAX_AGE = 5 * 60;
const CACHE_RETENTION = 7 * 24 * 60 * 60;

const SUMMARY_QUERY = `
query Summary(
	$zoneTag: string!,
	$active: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
	$today: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
) {
	viewer {
		zones(filter: { zoneTag: $zoneTag }) {
			active: httpRequestsAdaptiveGroups(limit: 1, filter: $active) {
				sum { visits }
			}
			today: httpRequestsAdaptiveGroups(limit: 1, filter: $today) {
				sum { visits }
			}
		}
	}
}`;

const BASE_QUERY = `
query Base($zoneTag: string!, $daily: ZoneHttpRequests1dGroupsFilter_InputObject!) {
	viewer {
		zones(filter: { zoneTag: $zoneTag }) {
			days: httpRequests1dGroups(limit: 100, filter: $daily) {
				dimensions { date }
				sum { requests pageViews }
			}
		}
	}
}`;

const DETAILS_QUERY = `
query Details(
	$zoneTag: string!,
	$today: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
	$yesterday: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
) {
	viewer {
		zones(filter: { zoneTag: $zoneTag }) {
			today: httpRequestsAdaptiveGroups(limit: 1, filter: $today) {
				count
				sum { edgeResponseBytes }
			}
			yesterday: httpRequestsAdaptiveGroups(limit: 1, filter: $yesterday) {
				count
			}
			countries: httpRequestsAdaptiveGroups(
				limit: 30,
				filter: $today,
				orderBy: [count_DESC]
			) {
				count
				dimensions { clientCountryName }
			}
			cache: httpRequestsAdaptiveGroups(
				limit: 20,
				filter: $today,
				orderBy: [count_DESC]
			) {
				count
				dimensions { cacheStatus }
			}
		}
	}
}`;

const PATH_QUERY = `
query Paths(
	$zoneTag: string!,
	$filter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!
) {
	viewer {
		zones(filter: { zoneTag: $zoneTag }) {
			paths: httpRequestsAdaptiveGroups(
				limit: 200,
				filter: $filter,
				orderBy: [count_DESC]
			) {
				count
				dimensions { clientRequestPath }
			}
		}
	}
}`;

function corsOrigin(request) {
	const origin = request.headers.get("Origin");
	if (
		origin === "https://yuulog.org" ||
		origin === "http://127.0.0.1:4321" ||
		origin === "http://localhost:4321"
	) {
		return origin;
	}
	return "https://yuulog.org";
}

function json(request, body, status = 200) {
	return new Response(status === 204 ? null : JSON.stringify(body), {
		status,
		headers: {
			"Access-Control-Allow-Origin": corsOrigin(request),
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			"Cache-Control": "public, max-age=60, stale-while-revalidate=300",
			"Content-Type": "application/json; charset=utf-8",
			Vary: "Origin",
		},
	});
}

function berlinDateParts(date) {
	return Object.fromEntries(
		new Intl.DateTimeFormat("en-CA", {
			timeZone: TIME_ZONE,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
			.formatToParts(date)
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, Number(part.value)]),
	);
}

function berlinMidnightUtc(year, month, day) {
	let utc = Date.UTC(year, month - 1, day);
	for (let i = 0; i < 2; i += 1) {
		const parts = Object.fromEntries(
			new Intl.DateTimeFormat("en-CA", {
				timeZone: TIME_ZONE,
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			})
				.formatToParts(new Date(utc))
				.filter((part) => part.type !== "literal")
				.map((part) => [part.type, Number(part.value)]),
		);
		if (parts.hour === 24) parts.hour = 0;
		const localAsUtc = Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day,
			parts.hour,
			parts.minute,
			parts.second,
		);
		utc -= localAsUtc - Date.UTC(year, month - 1, day);
	}
	return new Date(utc);
}

function dateContext(now = new Date()) {
	const { year, month, day } = berlinDateParts(now);
	const todayStart = berlinMidnightUtc(year, month, day);
	const yesterdayStart = berlinMidnightUtc(year, month, day - 1);
	const yesterdayParts = berlinDateParts(new Date(todayStart.getTime() - 1));
	return {
		now,
		todayStart,
		yesterdayStart,
		today: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
		yesterday: `${yesterdayParts.year}-${String(yesterdayParts.month).padStart(2, "0")}-${String(yesterdayParts.day).padStart(2, "0")}`,
		monthStart: `${year}-${String(month).padStart(2, "0")}-01`,
	};
}

function adaptiveFilter(start, end) {
	return {
		datetime_geq: start.toISOString(),
		datetime_leq: end.toISOString(),
		requestSource: "eyeball",
		clientRequestHTTPHost: HOSTNAME,
	};
}

async function graphql(env, query, variables) {
	if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
		throw new Error("CF_API_TOKEN and CF_ZONE_ID must be configured");
	}
	const response = await fetch(GRAPHQL_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.CF_API_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, variables }),
	});
	const body = await response.json();
	if (!response.ok || body.errors?.length) {
		throw new Error(body.errors?.[0]?.message || `Cloudflare API ${response.status}`);
	}
	return body.data.viewer.zones[0];
}

async function readCache(env, key) {
	const cached = await env.ANALYTICS_KV.get(key, "json");
	if (!cached?.updatedAt || !cached?.data) return null;
	return {
		data: cached.data,
		updatedAt: cached.updatedAt,
		age: Math.max(0, Math.floor((Date.now() - Date.parse(cached.updatedAt)) / 1000)),
	};
}

async function writeCache(env, key, data) {
	const updatedAt = new Date().toISOString();
	await env.ANALYTICS_KV.put(
		key,
		JSON.stringify({ data, updatedAt }),
		{ expirationTtl: CACHE_RETENTION },
	);
	return { data, updatedAt, age: 0 };
}

async function cachedResult(env, ctx, key, maxAge, refresh) {
	const cached = await readCache(env, key);
	if (!cached) return withCacheMeta(await refresh(), false);
	const stale = cached.age > maxAge;
	if (stale) {
		ctx.waitUntil(refresh().catch((error) => console.error(`Refresh ${key} failed`, error)));
	}
	return withCacheMeta(cached, stale);
}

function withCacheMeta(entry, stale) {
	return {
		...entry.data,
		updatedAt: entry.updatedAt,
		stale,
		cacheAgeSeconds: entry.age,
	};
}

async function getBase(env) {
	const cached = await readCache(env, CACHE_KEYS.base);
	if (cached && cached.age <= BASE_MAX_AGE) return cached.data;
	const dates = dateContext();
	const zone = await graphql(env, BASE_QUERY, {
		zoneTag: env.CF_ZONE_ID,
		daily: { date_geq: START_DATE, date_leq: dates.today },
	});
	const data = { days: zone.days };
	await writeCache(env, CACHE_KEYS.base, data);
	return data;
}

function sumDays(days, field, from) {
	return days
		.filter((item) => !from || item.dimensions.date >= from)
		.reduce((sum, item) => sum + Number(item.sum[field] ?? 0), 0);
}

async function refreshSummary(env) {
	const dates = dateContext();
	const [zone, base] = await Promise.all([
		graphql(env, SUMMARY_QUERY, {
			zoneTag: env.CF_ZONE_ID,
			active: adaptiveFilter(new Date(dates.now.getTime() - 5 * 60 * 1000), dates.now),
			today: adaptiveFilter(dates.todayStart, dates.now),
		}),
		getBase(env),
	]);
	const todayVisits = Number(zone.today?.[0]?.sum?.visits ?? 0);
	const summary = {
		ok: true,
		source: "cloudflare-graphql-analytics",
		active: Number(zone.active?.[0]?.sum?.visits ?? 0),
		todayVisitors: todayVisits,
		todayViews: sumDays(base.days, "pageViews", dates.today),
		yesterdayViews: Number(
			base.days.find((item) => item.dimensions.date === dates.yesterday)?.sum.pageViews ?? 0,
		),
		monthViews: sumDays(base.days, "pageViews", dates.monthStart),
		totalViews: sumDays(base.days, "pageViews"),
		todayVisits,
	};
	return writeCache(env, CACHE_KEYS.summary, summary);
}

async function popularPosts(env, dates) {
	const ranges = Array.from({ length: 7 }, (_, index) => {
		const end = new Date(dates.now.getTime() - index * 24 * 60 * 60 * 1000);
		return adaptiveFilter(new Date(end.getTime() - 24 * 60 * 60 * 1000 + 1), end);
	});
	const zones = await Promise.all(
		ranges.map((range) =>
			graphql(env, PATH_QUERY, { zoneTag: env.CF_ZONE_ID, filter: range }),
		),
	);
	const counts = new Map();
	zones.flatMap((zone) => zone.paths).forEach((item) => {
		const path = item.dimensions.clientRequestPath;
		if (path.startsWith("/posts/")) counts.set(path, (counts.get(path) ?? 0) + item.count);
	});
	return Array.from(counts, ([path, requests]) => ({ path, requests }))
		.sort((a, b) => b.requests - a.requests)
		.slice(0, 7);
}

async function refreshDetails(env) {
	const dates = dateContext();
	const [zone, base, posts] = await Promise.all([
		graphql(env, DETAILS_QUERY, {
			zoneTag: env.CF_ZONE_ID,
			today: adaptiveFilter(dates.todayStart, dates.now),
			yesterday: adaptiveFilter(
				dates.yesterdayStart,
				new Date(dates.todayStart.getTime() - 1),
			),
		}),
		getBase(env),
		popularPosts(env, dates),
	]);
	const cacheTotal = zone.cache.reduce((sum, item) => sum + item.count, 0);
	const cacheHits = zone.cache
		.filter((item) => ["hit", "revalidated", "stale", "updating"].includes(item.dimensions.cacheStatus))
		.reduce((sum, item) => sum + item.count, 0);
	const details = {
		ok: true,
		source: "cloudflare-graphql-analytics",
		todayRequests: Number(zone.today?.[0]?.count ?? 0),
		yesterdayRequests: Number(zone.yesterday?.[0]?.count ?? 0),
		monthRequests: sumDays(base.days, "requests", dates.monthStart),
		popularPosts7d: posts,
		countries: zone.countries.map((item) => ({
			country: item.dimensions.clientCountryName,
			requests: item.count,
		})),
		bandwidthBytes: Number(zone.today?.[0]?.sum?.edgeResponseBytes ?? 0),
		cacheHitRate: cacheTotal > 0 ? cacheHits / cacheTotal : null,
		botRequestRatio: null,
		botRequestRatioUnavailableReason: "Unavailable on Cloudflare Free plan",
	};
	return writeCache(env, CACHE_KEYS.details, details);
}

async function summary(env, ctx) {
	return cachedResult(env, ctx, CACHE_KEYS.summary, SUMMARY_MAX_AGE, () => refreshSummary(env));
}

async function details(env, ctx) {
	return cachedResult(env, ctx, CACHE_KEYS.details, DETAILS_MAX_AGE, () => refreshDetails(env));
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === "OPTIONS") return json(request, null, 204);
		if (request.method !== "GET") return json(request, { ok: false }, 405);
		try {
			const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
			if (path === "/api/analytics/summary") return json(request, await summary(env, ctx));
			if (path === "/api/analytics/details") return json(request, await details(env, ctx));
			if (path === "/" || path === "/api/analytics") {
				// Compatibility endpoint. New clients should request summary/details separately.
				const [summaryData, detailsData] = await Promise.all([summary(env, ctx), details(env, ctx)]);
				return json(request, {
					...summaryData,
					...detailsData,
					stale: summaryData.stale || detailsData.stale,
					cacheAgeSeconds: Math.max(summaryData.cacheAgeSeconds, detailsData.cacheAgeSeconds),
				});
			}
			return json(request, { ok: false, error: "Not found" }, 404);
		} catch (error) {
			console.error(error);
			return json(request, {
				ok: false,
				error: "Cloudflare Analytics is temporarily unavailable",
				updatedAt: new Date().toISOString(),
			}, 502);
		}
	},
};
