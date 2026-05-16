<script lang="ts">
	import StatusBadge, { type CommentStatus } from "./StatusBadge.svelte";

	export type AdminComment = {
		id: string;
		pagePath: string;
		parentId: string | null;
		nickname: string;
		email: string | null;
		emailHash: string | null;
		website: string | null;
		content: string;
		status: CommentStatus;
		createdAt: string;
		updatedAt: string;
	};

	export let comment: AdminComment;
	export let replyTargetName: string | null = null;
	export let busyStatus: CommentStatus | null = null;
	export let onStatusChange: (comment: AdminComment, status: CommentStatus) => void;

	const actions: Array<{
		label: string;
		status: CommentStatus;
		className: string;
	}> = [
		{ label: "通过", status: "approved", className: "approved" },
		{ label: "待审核", status: "pending", className: "pending" },
		{ label: "垃圾", status: "spam", className: "spam" },
		{ label: "删除", status: "deleted", className: "deleted" },
	];

	function formatLocalTime(value: string) {
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleString(undefined, {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				});
	}
</script>

<article class:reply-card={comment.parentId} class="comment-card">
	<header class="card-header">
		<div>
			<h2>{comment.nickname}</h2>
			<p>{comment.parentId ? `回复 @${replyTargetName ?? "未知用户"}` : "顶级评论"}</p>
		</div>
		<StatusBadge status={comment.status} />
	</header>

	<div class="meta-grid">
		<div>
			<span>发布时间</span>
			<strong>{formatLocalTime(comment.createdAt)}</strong>
		</div>
		<div>
			<span>页面路径</span>
			<strong>{comment.pagePath}</strong>
		</div>
	</div>

	<p class="comment-content">{comment.content}</p>

	<footer class="card-footer">
		<div class="relation">
			<span>{comment.parentId ? "回复关系" : "评论层级"}</span>
			<strong>{comment.parentId ? `回复 @${replyTargetName ?? "未知用户"}` : "顶级评论"}</strong>
		</div>
		<div class="action-row">
			{#each actions as action}
				<button
					type="button"
					class={action.className}
					disabled={comment.status === action.status || busyStatus !== null}
					aria-busy={busyStatus === action.status}
					on:click={() => onStatusChange(comment, action.status)}
				>
					{busyStatus === action.status ? "处理中..." : action.label}
				</button>
			{/each}
		</div>
	</footer>
</article>

<style>
	.comment-card {
		display: grid;
		gap: 1rem;
		border: 1px solid rgb(59 130 246 / 0.16);
		border-radius: 1rem;
		background: rgb(219 234 254 / 0.9);
		padding: 1rem;
		box-shadow: 0 18px 36px rgb(37 99 235 / 0.1);
		backdrop-filter: blur(14px);
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}
	.comment-card:hover {
		transform: translateY(-2px);
		border-color: rgb(37 99 235 / 0.24);
		box-shadow: 0 22px 42px rgb(37 99 235 / 0.16);
	}
	.reply-card {
		margin-left: 1rem;
		border-left: 4px solid color-mix(in oklab, var(--primary) 72%, white);
	}
	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}
	h2 {
		font-size: 1rem;
		font-weight: 700;
		overflow-wrap: anywhere;
	}
	.card-header p {
		margin-top: 0.2rem;
		font-size: 0.8rem;
		color: color-mix(in oklab, currentColor 62%, transparent);
	}
	.meta-grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.meta-grid div,
	.relation {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}
	.meta-grid span,
	.relation span {
		font-size: 0.76rem;
		color: color-mix(in oklab, currentColor 58%, transparent);
	}
	.meta-grid strong,
	.relation strong {
		font-size: 0.9rem;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.comment-content {
		border-radius: 0.9rem;
		background: rgb(239 246 255 / 0.96);
		padding: 0.9rem;
		line-height: 1.75;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.card-footer {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}
	.action-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.55rem;
	}
	button {
		border: 1px solid transparent;
		border-radius: 0.8rem;
		padding: 0.58rem 0.75rem;
		font-weight: 700;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease,
			background-color 0.15s ease;
	}
	button:hover:not(:disabled) {
		transform: translateY(-1px);
	}
	button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
	.approved {
		background: rgb(22 163 74);
		color: white;
	}
	.pending {
		background: rgb(202 138 4);
		color: white;
	}
	.spam {
		background: rgb(220 38 38);
		color: white;
	}
	.deleted {
		background: rgb(55 65 81);
		color: white;
	}
	.approved:hover:not(:disabled) {
		background: rgb(21 128 61);
	}
	.pending:hover:not(:disabled) {
		background: rgb(161 98 7);
	}
	.spam:hover:not(:disabled) {
		background: rgb(185 28 28);
	}
	.deleted:hover:not(:disabled) {
		background: rgb(31 41 55);
	}
	:global(:root.dark) .comment-card {
		border-color: rgb(255 255 255 / 0.1);
		background: rgb(15 23 42 / 0.8);
		box-shadow: 0 18px 36px rgb(0 0 0 / 0.24);
	}
	:global(:root.dark) .comment-card:hover {
		border-color: rgb(255 255 255 / 0.16);
		box-shadow: 0 22px 42px rgb(0 0 0 / 0.28);
	}
	:global(:root.dark) .comment-content {
		background: rgb(2 6 23 / 0.5);
	}
	:global(:root.dark) .approved {
		background: rgb(22 163 74);
		color: white;
	}
	:global(:root.dark) .pending {
		background: rgb(202 138 4);
		color: white;
	}
	:global(:root.dark) .spam {
		background: rgb(220 38 38);
		color: white;
	}
	:global(:root.dark) .deleted {
		background: rgb(75 85 99);
		color: white;
	}
	@media (max-width: 700px) {
		.reply-card {
			margin-left: 0.4rem;
		}
		.meta-grid {
			grid-template-columns: 1fr;
		}
		.card-footer {
			align-items: stretch;
			flex-direction: column;
		}
		.action-row {
			justify-content: flex-start;
		}
	}
</style>
