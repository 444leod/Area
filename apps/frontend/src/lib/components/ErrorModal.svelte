<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { errorMessage, clearError } from '$lib/store/errorMessage';
	import { AlertTriangle, X } from 'lucide-svelte';

	function handleClose() {
		clearError();
	}
</script>

{#if $errorMessage}
	<div
		class="fixed inset-0 bg-surface-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		on:click={handleClose}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="bg-gradient-to-br from-error-900 to-error-700 p-6 rounded-xl shadow-2xl max-w-md w-full border border-error-500"
			on:click|stopPropagation
			in:fly={{ y: -50, duration: 400, easing: elasticOut }}
			out:scale={{ duration: 200, easing: elasticOut }}
		>
			<div class="flex items-start justify-between mb-4">
				<div class="flex items-center">
					<AlertTriangle class="w-8 h-8 text-error-300 mr-3" />
					<h3 class="h2 text-error-100">Error</h3>
				</div>
				<button
					on:click={handleClose}
					class="text-error-300 hover:text-error-100 transition-colors duration-200"
				>
					<X class="w-6 h-6 hover:scale-110 transition-all" />
				</button>
			</div>
			<p class="text-error-200 text-lg">{@html $errorMessage}</p>
			<div class="mt-6 flex justify-end">
				<button
					on:click={handleClose}
					class="btn variant-filled-surface hover:variant-ghost-error transition-all duration-200"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<svelte:window on:keydown={(e) => e.key === 'Escape' && handleClose()} />

<style lang="postcss">
	.backdrop-blur-sm {
		backdrop-filter: blur(4px);
	}

	:global(.error-modal-shake) {
		animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}

	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}
		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}
		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}
		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
</style>
