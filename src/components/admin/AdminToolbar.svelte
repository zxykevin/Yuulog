<script lang="ts">
	import type { CommentStatus } from "./StatusBadge.svelte";

	export type FilterStatus = CommentStatus | "";

	export let token = "";
	export let query = "";
	export let activeStatus: FilterStatus = "";
	export let counts: Record<"all" | CommentStatus, number> = {
		all: 0,
		pending: 0,
		approved: 0,
		spam: 0,
		deleted: 0,
	};
	export let onSaveToken: (value: string) => void;
	export let onFilterChange: (value: FilterStatus) => void;
	export let onSearchChange: (value: string) => void;

	const filters: Array<{ label: string; value: FilterStatus }> = [
		{ label: "全部", value: "" },
		{ label: "pending", value: "pending" },
		{ label: "approved", value: "approved" },
		{ label: "spam", value: "spam" },
		{ label: "deleted", value: "deleted" },
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		onSaveToken(token.trim());
	}
</script>

<section class="toolbar-shell">
	<form class="token-form" on:submit={submit}>
		<label for="admin-token">ADMIN_TOKEN</label>
		<div class="token-row">
			<input
				id="admin-token"
				type="password"
				autocomplete="off"
				bind:value={token}
				placeholder="输入 ADMIN_TOKEN"
			/>
			<button type="submit">保存</button>
		</div>
	</form>

	<label class="search-field">
		<span>搜索</span>
		<input
			type="search"
			value={query}
			placeholder="作者、内容或页面路径"
			on:input={(event) =>
				onSearchChange((event.currentTarget as HTMLInputElement).value)}
		/>
	</label>

	<div class="filter-row" role="tablist" aria-label="评论状态筛选">
		{#each filters as filter}
			<button
				type="button"
				class:is-active={activeStatus === filter.value}
				on:click={() => onFilterChange(filter.value)}
			>
				{filter.label}
				<span>{filter.value ? counts[filter.value] : counts.all}</span>
			</button>
		{/each}
	</div>
</section>

<style>
	.toolbar-shell {
		position: sticky;
		top: 1rem;
		z-index: 20;
		display: grid;
		gap: 1rem;
		border: 1px solid rgb(59 130 246 / 0.14);
		border-radius: 1rem;
		background: rgb(239 246 255 / 0.92);
		padding: 1rem;
		box-shadow: 0 18px 40px rgb(37 99 235 / 0.1);
		backdrop-filter: blur(14px);
	}
	.token-form,
	.search-field {
		display: grid;
		gap: 0.45rem;
	}
	label,
	.search-field span {
		font-size: 0.78rem;
		font-weight: 700;
		color: color-mix(in oklab, currentColor 60%, transparent);
	}
	.token-row {
		display: flex;
		gap: 0.65rem;
	}
	input {
		min-width: 0;
		width: 100%;
		border: 1px solid rgb(59 130 246 / 0.16);
		border-radius: 0.85rem;
		background: rgb(255 255 255 / 0.9);
		padding: 0.75rem 0.85rem;
		color: inherit;
	}
	:global(:root.dark) .toolbar-shell {
		border-color: rgb(255 255 255 / 0.1);
		background: rgb(15 23 42 / 0.78);
		box-shadow: 0 18px 40px rgb(0 0 0 / 0.22);
	}
	:global(:root.dark) input {
		border-color: rgb(255 255 255 / 0.12);
		background: rgb(15 23 42 / 0.72);
	}
	.token-row button,
	.filter-row button {
		border-radius: 0.85rem;
		font-weight: 700;
		transition:
			transform 0.15s ease,
			background-color 0.15s ease,
			border-color 0.15s ease;
	}
	.token-row button {
		background: var(--primary);
		padding: 0.7rem 1rem;
		color: white;
	}
	.token-row button:hover,
	.filter-row button:hover {
		transform: translateY(-1px);
	}
	.filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}
	.filter-row button {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		border: 1px solid color-mix(in oklab, var(--primary) 28%, transparent);
		background: color-mix(in oklab, var(--primary) 10%, transparent);
		padding: 0.6rem 0.75rem;
		color: inherit;
	}
	.filter-row button span {
		border-radius: 999px;
		background: rgb(255 255 255 / 0.14);
		padding: 0.15rem 0.45rem;
		font-size: 0.72rem;
	}
	.filter-row button.is-active {
		border-color: transparent;
		background: var(--primary);
		color: white;
	}
	@media (min-width: 900px) {
		.toolbar-shell {
			grid-template-columns: minmax(17rem, 1fr) minmax(16rem, 0.9fr);
			align-items: end;
		}
		.filter-row {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 640px) {
		.toolbar-shell {
			top: 0.5rem;
		}
		.token-row {
			flex-direction: column;
		}
		.token-row button {
			width: 100%;
		}
	}
</style>
