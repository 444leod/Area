<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { areaStore } from '$lib/store/areaStore';
	import { getIconForApp } from '$lib/utils/getIconName';
	import { enhance } from '$app/forms';
	import { setError } from '$lib/store/errorMessage';

	onMount(() => {
		if (
			!$areaStore.triggerApp ||
			!$areaStore.selectedTrigger ||
			!$areaStore.actionApp ||
			!$areaStore.selectedAction ||
			!$areaStore.actionDetails ||
			!$areaStore.reactionDetails
		) {
			goto('/dashboard/new-area/configure');
		}
	});

	let isSubmitting = false;
	let showSuccessAnimation = false;

	function formatParams(params: Record<string, any>): string {
		return Object.entries(params)
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ');
	}

	async function handleCreateAreaResult(result: { type: string; data?: { message: string } }) {
		if (result.type === 'success') {
			showSuccessAnimation = true;
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} else {
			setError(`Failed to create automation: ${result.data?.message || 'Unknown error'}`);
		}
	}
</script>

<div class="space-y-6" in:fade>
	<div class="card variant-soft-primary p-6">
		<h2 class="h2 mb-4 flex items-center gap-2">
			<Icon icon="mdi:check-circle" class="w-8 h-8" />
			Ready to Activate Your Automation
		</h2>
		<p class="text-lg opacity-90">{$areaStore.automationName}</p>
	</div>

	<!-- Workflow Summary -->
	<div class="card variant-ghost p-6">
		<div class="flex flex-col gap-6">
			<!-- Trigger Section -->
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-full variant-filled-surface flex items-center justify-center"
					>
						<Icon icon={getIconForApp($areaStore.triggerApp?.name || '')} class="w-6 h-6" />
					</div>
					<div>
						<h3 class="h3">{$areaStore.triggerApp?.name}</h3>
						<p class="text-base opacity-90">{$areaStore.selectedTrigger?.name}</p>
					</div>
				</div>

				{#if Object.keys($areaStore.actionDetails?.params || {}).length > 0}
					<div class="pl-16">
						<div class="card variant-ghost-surface p-4">
							<h4 class="font-semibold mb-2">Trigger Configuration</h4>
							<div class="space-y-2">
								{#each Object.entries($areaStore.actionDetails?.params || {}) as [key, value]}
									<div class="flex justify-between text-sm">
										<span class="opacity-75">{key}:</span>
										<span class="font-mono">{value}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Arrow -->
			<div class="flex justify-center">
				<Icon icon="mdi:arrow-down-bold" class="w-8 h-8 opacity-50" />
			</div>

			<!-- Action Section -->
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-full variant-filled-surface flex items-center justify-center"
					>
						<Icon icon={getIconForApp($areaStore.actionApp?.name || '')} class="w-6 h-6" />
					</div>
					<div>
						<h3 class="h3">{$areaStore.actionApp?.name}</h3>
						<p class="text-base opacity-90">{$areaStore.selectedAction?.name}</p>
					</div>
				</div>

				{#if Object.keys($areaStore.reactionDetails?.params || {}).length > 0}
					<div class="pl-16">
						<div class="card variant-ghost-surface p-4">
							<h4 class="font-semibold mb-2">Action Configuration</h4>
							<div class="space-y-2">
								{#each Object.entries($areaStore.reactionDetails?.params || {}) as [key, value]}
									<div class="flex justify-between text-sm">
										<span class="opacity-75">{key}:</span>
										<span class="font-mono">{value}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<form
		method="POST"
		action="?/createArea"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				handleCreateAreaResult(result);
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="actionDetails" value={JSON.stringify($areaStore.actionDetails)} />
		<input
			type="hidden"
			name="reactionDetails"
			value={JSON.stringify($areaStore.reactionDetails)}
		/>
		<input type="hidden" name="areaName" value={$areaStore.automationName} />

		<!-- Information Card -->
		<div class="card variant-ghost p-4">
			<div class="flex items-start gap-4">
				<Icon icon="mdi:information" class="w-6 h-6 text-primary-500 flex-shrink-0" />
				<div class="space-y-2">
					<h4 class="font-semibold">How this automation works:</h4>
					<p class="text-sm">
						When <span class="text-primary-500">{$areaStore.triggerApp?.name}</span>
						{$areaStore.selectedTrigger?.description?.toLowerCase() || ''},
						<span class="text-secondary-500">{$areaStore.actionApp?.name}</span> will {$areaStore.selectedAction?.description?.toLowerCase() ||
							''}.
					</p>
					<p class="text-sm opacity-75">
						You can monitor and manage your automation from your dashboard after activation.
					</p>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex justify-between">
			<a href="/dashboard/new-area/configure" class="btn variant-soft">
				<Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
				Back to Configuration
			</a>
			<button
				type="submit"
				class="btn variant-filled-primary"
				class:variant-filled-surface={isSubmitting}
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<Icon icon="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
					Creating...
				{:else}
					<Icon icon="mdi:flash" class="w-4 h-4 mr-2" />
					Activate Automation
				{/if}
			</button>
		</div>
	</form>

	{#if showSuccessAnimation}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" transition:fade>
			<div class="card variant-filled-primary p-8 text-center" in:fade>
				<Icon icon="mdi:check-circle" class="w-16 h-16 mx-auto mb-4" />
				<h3 class="h3 mb-2">Automation Created!</h3>
				<p>Redirecting to dashboard...</p>
			</div>
		</div>
	{/if}
</div>
