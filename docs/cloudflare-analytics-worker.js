const HOSTNAME = "yuulog.org";
const START_AT = "2026-05-09T00:00:00Z";
const TIME_ZONE = "Europe/Berlin";

const QUERY = `
query Analytics(
	$zoneTag: string!,
	$active: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
	$today: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
	$yesterday: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!,
	$daily: ZoneHttpRequests1dGroupsFilter_InputObject!
) {
	viewer {
		zones(filter: { zoneTag: $zoneTag }) {
			active: httpRequestsAdaptiveGroups(limit: 1, filter: $active) {
				count
				sum { visits }
			}
			today: httpRequestsAdaptiveGroups(limit: 1, filter: $today) {
				count
				sum { visits edgeResponseBytes }
			}
			yesterday: httpRequestsAdaptiveGroups(limit: 1, filter: $yesterday) {
				count
			}
			days: httpRequests1dGroups(limit: 100, filter: $daily) {
				dimensions { date }
				sum { requests pageViews }
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

function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			"Cache-Control": "public, max-age=60",
			"Content-Type": "application/json; charset=utf-8",
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

function filter(start, end) {
	return {
		datetime_geq: start.toISOString(),
		datetime_leq: end.toISOString(),
		requestSource: "eyeball",
		clientRequestHTTPHost: HOSTNAME,
	};
}

function first(groups) {
	return groups?.[0] ?? {};
}

function count(groups) {
	return Number(first(groups).count ?? 0);
}

function visits(groups) {
	return Number(first(groups).sum?.visits ?? 0);
}

function summarize(zone, weekPaths, dates) {
	const cacheTotal = zone.cache.reduce((sum, item) => sum + item.count, 0);
	const cacheHits = zone.cache
		.filter((item) =>
			["hit", "revalidated", "stale", "updating"].includes(
				item.dimensions.cacheStatus,
			),
		)
		.reduce((sum, item) => sum + item.count, 0);

	const monthlyRequests = zone.days
		.filter((item) => item.dimensions.date >= dates.monthStart)
		.reduce((sum, item) => sum + item.sum.requests, 0);
	const monthlyPageViews = zone.days
		.filter((item) => item.dimensions.date >= dates.monthStart)
		.reduce((sum, item) => sum + item.sum.pageViews, 0);
	const totalRequests = zone.days.reduce(
		(sum, item) => sum + item.sum.requests,
		0,
	);
	const totalPageViews = zone.days.reduce(
		(sum, item) => sum + item.sum.pageViews,
		0,
	);
	const todayPageViews =
		zone.days.find((item) => item.dimensions.date === dates.today)?.sum
			.pageViews ?? 0;
	const yesterdayPageViews =
		zone.days.find((item) => item.dimensions.date === dates.yesterday)?.sum
			.pageViews ?? 0;

	return {
		ok: true,
		source: "cloudflare-graphql-analytics",
		active: visits(zone.active),
		todayVisitors: visits(zone.today),
		todayViews: todayPageViews,
		yesterdayViews: yesterdayPageViews,
		monthViews: monthlyPageViews,
		totalViews: totalPageViews,
		todayVisits: visits(zone.today),
		todayRequests: count(zone.today),
		yesterdayRequests: count(zone.yesterday),
		monthRequests: monthlyRequests,
		popularPosts7d: weekPaths,
		countries: zone.countries.map((item) => ({
			country: item.dimensions.clientCountryName,
			requests: item.count,
		})),
		bandwidthBytes: Number(first(zone.today).sum?.edgeResponseBytes ?? 0),
		cacheHitRate: cacheTotal > 0 ? cacheHits / cacheTotal : null,
		botRequestRatio: null,
		botRequestRatioUnavailableReason:
			"botManagementDecision requires a Cloudflare Bot Management plan",
		updatedAt: new Date().toISOString(),
	};
}

async function fetchAnalytics(env) {
	const now = new Date();
	const { year, month, day } = berlinDateParts(now);
	const todayStart = berlinMidnightUtc(year, month, day);
	const yesterdayStart = berlinMidnightUtc(year, month, day - 1);
	const dailyToday = now.toISOString().slice(0, 10);
	const dailyYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
		.toISOString()
		.slice(0, 10);
	const dailyMonthStart = `${now.getUTCFullYear()}-${String(
		now.getUTCMonth() + 1,
	).padStart(2, "0")}-01`;

	const headers = {
		Authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_TOKEN}`,
		"Content-Type": "application/json",
	};
	const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
		method: "POST",
		headers,
		body: JSON.stringify({
			query: QUERY,
			variables: {
				zoneTag: env.CLOUDFLARE_ZONE_ID,
				active: filter(new Date(now.getTime() - 5 * 60 * 1000), now),
				today: filter(todayStart, now),
				yesterday: filter(
					yesterdayStart,
					new Date(todayStart.getTime() - 1),
				),
				daily: {
					date_geq: START_AT.slice(0, 10),
					date_leq: now.toISOString().slice(0, 10),
				},
			},
		}),
	});
	const body = await response.json();
	if (!response.ok || body.errors?.length) {
		throw new Error(body.errors?.[0]?.message || `Cloudflare API ${response.status}`);
	}
	const pathRanges = Array.from({ length: 7 }, (_, index) => {
		const end = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
		const start = new Date(end.getTime() - 24 * 60 * 60 * 1000 + 1);
		return filter(start, end);
	});
	const pathResponses = await Promise.all(
		pathRanges.map(async (pathFilter) => {
			const pathResponse = await fetch(
				"https://api.cloudflare.com/client/v4/graphql",
				{
					method: "POST",
					headers,
					body: JSON.stringify({
						query: PATH_QUERY,
						variables: {
							zoneTag: env.CLOUDFLARE_ZONE_ID,
							filter: pathFilter,
						},
					}),
				},
			);
			const pathBody = await pathResponse.json();
			if (!pathResponse.ok || pathBody.errors?.length) {
				throw new Error(
					pathBody.errors?.[0]?.message ||
						`Cloudflare API ${pathResponse.status}`,
				);
			}
			return pathBody.data.viewer.zones[0].paths;
		}),
	);
	const postCounts = new Map();
	pathResponses.flat().forEach((item) => {
		const path = item.dimensions.clientRequestPath;
		if (!path.startsWith("/posts/")) return;
		postCounts.set(path, (postCounts.get(path) ?? 0) + item.count);
	});
	const weekPaths = Array.from(postCounts, ([path, requests]) => ({
		path,
		requests,
	}))
		.sort((a, b) => b.requests - a.requests)
		.slice(0, 7);

	return summarize(
		body.data.viewer.zones[0],
		weekPaths,
		{
			today: dailyToday,
			yesterday: dailyYesterday,
			monthStart: dailyMonthStart,
		},
	);
}

export default {
	async fetch(request, env) {
		if (request.method === "OPTIONS") return json(null, 204);
		if (request.method !== "GET") return json({ ok: false }, 405);
		try {
			return json(await fetchAnalytics(env));
		} catch (error) {
			console.error(error);
			return json(
				{
					ok: false,
					error: "Cloudflare Analytics is temporarily unavailable",
					updatedAt: new Date().toISOString(),
				},
				502,
			);
		}
	},
};
