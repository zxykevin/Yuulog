<script lang="ts">
	export type CommentStatus = "pending" | "approved" | "spam" | "deleted";

	export let status: CommentStatus;

	const labels: Record<CommentStatus, string> = {
		approved: "approved",
		pending: "pending",
		spam: "spam",
		deleted: "deleted",
	};
</script>

<span class={`status-badge status-${status}`}>{labels[status]}</span>

<style>
	.status-badge {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 0.25rem 0.55rem;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
	}
	.status-approved {
		background: rgb(220 252 231);
		color: rgb(21 128 61);
	}
	.status-pending {
		background: rgb(254 249 195);
		color: rgb(161 98 7);
	}
	.status-spam {
		background: rgb(254 226 226);
		color: rgb(185 28 28);
	}
	.status-deleted {
		background: rgb(243 244 246);
		color: rgb(75 85 99);
	}
	:global(:root.dark) .status-approved {
		background: rgb(34 197 94 / 0.18);
		color: rgb(134 239 172);
	}
	:global(:root.dark) .status-pending {
		background: rgb(234 179 8 / 0.18);
		color: rgb(253 224 71);
	}
	:global(:root.dark) .status-spam {
		background: rgb(239 68 68 / 0.18);
		color: rgb(252 165 165);
	}
	:global(:root.dark) .status-deleted {
		background: rgb(107 114 128 / 0.22);
		color: rgb(209 213 219);
	}
</style>
