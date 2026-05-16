<script lang="ts">
	import AdminToolbar, { type FilterStatus } from "./AdminToolbar.svelte";
	import CommentCard, { type AdminComment } from "./CommentCard.svelte";
	import type { CommentStatus } from "./StatusBadge.svelte";

	export let apiBaseUrl: string;

	type AdminCommentsResponse = {
		ok: boolean;
		comments?: AdminComment[];
		message?: string;
	};

	type StatusUpdateResponse = {
		ok: boolean;
		status?: CommentStatus;
		message?: string;
	};

	type Toast = {
		id: number;
		message: string;
		tone: "success" | "error";
	};

	const STORAGE_KEY = "mizuki-admin-comments-token";
	let token = "";
	let query = "";
	let activeStatus: FilterStatus = "";
	let comments: AdminComment[] = [];
	let loading = true;
	let busyById: Record<string, CommentStatus | null> = {};
	let toasts: Toast[] = [];
	let nextToastId = 1;

	$: counts = comments.reduce(
		(acc, comment) => {
			acc.all += 1;
			acc[comment.status] += 1;
			return acc;
		},
		{
			all: 0,
			pending: 0,
			approved: 0,
			spam: 0,
			deleted: 0,
		} as Record<"all" | CommentStatus, number>,
	);

	$: normalizedQuery = query.trim().toLowerCase();
	$: visibleComments = comments.filter((comment) => {
		const matchesStatus = !activeStatus || comment.status === activeStatus;
		const matchesQuery =
			!normalizedQuery ||
			[comment.nickname, comment.content, comment.pagePath]
				.join("\n")
				.toLowerCase()
				.includes(normalizedQuery);
		return matchesStatus && matchesQuery;
	});
	$: commentMap = new Map(comments.map((comment) => [comment.id, comment]));

	function showToast(message: string, tone: Toast["tone"]) {
		const id = nextToastId++;
		toasts = [...toasts, { id, message, tone }];
		window.setTimeout(() => {
			toasts = toasts.filter((toast) => toast.id !== id);
		}, 2600);
	}

	function saveToken(value: string) {
		token = value;
		window.localStorage.setItem(STORAGE_KEY, value);
		showToast(value ? "Token 已保存" : "Token 已清空", "success");
		void loadComments();
	}

	function setFilter(value: FilterStatus) {
		activeStatus = value;
	}

	async function loadComments() {
		token = token || window.localStorage.getItem(STORAGE_KEY) || "";
		if (!token) {
			comments = [];
			loading = false;
			return;
		}

		loading = true;
		try {
			const response = await fetch(`${apiBaseUrl}/api/admin/comments`, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = (await response.json()) as AdminCommentsResponse;
			if (!response.ok || !data.ok || !Array.isArray(data.comments)) {
				throw new Error(data.message || "评论加载失败");
			}
			comments = data.comments;
		} catch (error) {
			showToast(error instanceof Error ? error.message : "评论加载失败", "error");
		} finally {
			loading = false;
		}
	}

	function statusMessage(status: CommentStatus) {
		switch (status) {
			case "approved":
				return "评论已通过";
			case "pending":
				return "评论已设为待审核";
			case "spam":
				return "已标记为垃圾评论";
			case "deleted":
				return "评论已删除";
		}
	}

	async function updateStatus(comment: AdminComment, status: CommentStatus) {
		if (!token || busyById[comment.id]) return;

		const previousStatus = comment.status;
		busyById = { ...busyById, [comment.id]: status };
		comments = comments.map((item) =>
			item.id === comment.id ? { ...item, status } : item,
		);

		try {
			const response = await fetch(
				`${apiBaseUrl}/api/admin/comments/${encodeURIComponent(comment.id)}/status`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status }),
				},
			);
			const data = (await response.json()) as StatusUpdateResponse;
			if (!response.ok || !data.ok) {
				throw new Error(data.message || "状态更新失败");
			}
			showToast(statusMessage(status), "success");
		} catch (error) {
			comments = comments.map((item) =>
				item.id === comment.id ? { ...item, status: previousStatus } : item,
			);
			showToast(error instanceof Error ? error.message : "状态更新失败", "error");
		} finally {
			busyById = { ...busyById, [comment.id]: null };
		}
	}

	$: if (typeof window !== "undefined" && !token && loading) {
		token = window.localStorage.getItem(STORAGE_KEY) || "";
		void loadComments();
	}
</script>

<section class="admin-page">
	<header class="page-heading">
		<p>Admin</p>
		<h1>评论审核</h1>
	</header>

	<AdminToolbar
		{token}
		{query}
		{activeStatus}
		{counts}
		onSaveToken={saveToken}
		onFilterChange={setFilter}
		onSearchChange={(value) => (query = value)}
	/>

	<div class="toast-stack" aria-live="polite">
		{#each toasts as toast (toast.id)}
			<div class={`toast toast-${toast.tone}`}>{toast.message}</div>
		{/each}
	</div>

	{#if loading}
		<div class="skeleton-grid">
			{#each Array(4) as _}
				<div class="skeleton-card"></div>
			{/each}
		</div>
	{:else if !token}
		<div class="empty-state">请先输入 ADMIN_TOKEN</div>
	{:else if visibleComments.length === 0}
		<div class="empty-state">暂无匹配评论</div>
	{:else}
		<div class="comment-grid">
			{#each visibleComments as comment (comment.id)}
				<CommentCard
					{comment}
					replyTargetName={comment.parentId
						? commentMap.get(comment.parentId)?.nickname ?? null
						: null}
					busyStatus={busyById[comment.id] ?? null}
					onStatusChange={updateStatus}
				/>
			{/each}
		</div>
	{/if}
</section>

<style>
	.admin-page {
		display: grid;
		gap: 1rem;
	}
	.page-heading p {
		margin-bottom: 0.2rem;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		color: color-mix(in oklab, currentColor 56%, transparent);
	}
	.page-heading h1 {
		font-size: clamp(1.35rem, 2vw, 1.8rem);
		font-weight: 700;
		letter-spacing: 0;
	}
	.comment-grid,
	.skeleton-grid {
		display: grid;
		gap: 1rem;
	}
	.empty-state,
	.skeleton-card {
		border: 1px solid rgb(59 130 246 / 0.14);
		border-radius: 1rem;
		background: rgb(239 246 255 / 0.92);
		padding: 1rem;
		backdrop-filter: blur(14px);
	}
	.skeleton-card {
		min-height: 12rem;
		background:
			linear-gradient(90deg, transparent, rgb(148 163 184 / 0.18), transparent),
			rgb(239 246 255 / 0.92);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite linear;
	}
	.toast-stack {
		position: fixed;
		top: 5.5rem;
		right: 1rem;
		z-index: 60;
		display: grid;
		gap: 0.5rem;
	}
	.toast {
		border-radius: 0.85rem;
		padding: 0.75rem 0.9rem;
		box-shadow: 0 16px 30px rgb(0 0 0 / 0.16);
		backdrop-filter: blur(18px);
	}
	.toast-success {
		background: rgb(220 252 231 / 0.96);
		color: rgb(21 128 61);
	}
	.toast-error {
		background: rgb(254 226 226 / 0.96);
		color: rgb(185 28 28);
	}
	:global(:root.dark) .empty-state,
	:global(:root.dark) .skeleton-card {
		border-color: rgb(255 255 255 / 0.1);
		background: rgb(15 23 42 / 0.8);
	}
	:global(:root.dark) .skeleton-card {
		background:
			linear-gradient(90deg, transparent, rgb(255 255 255 / 0.08), transparent),
			rgb(15 23 42 / 0.8);
	}
	:global(:root.dark) .toast-success {
		background: rgb(34 197 94 / 0.18);
		color: rgb(134 239 172);
	}
	:global(:root.dark) .toast-error {
		background: rgb(239 68 68 / 0.18);
		color: rgb(252 165 165);
	}
	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
	@media (max-width: 640px) {
		.toast-stack {
			top: auto;
			right: 0.5rem;
			bottom: 0.5rem;
			left: 0.5rem;
		}
	}
</style>
