<script lang="ts">
	export let steps: string[];
	export let currentStep: number;
</script>

<div class="hidden md:flex mb-8">
	{#each steps as step, i}
		<div
			class="flex-1 {i !== steps.length - 1 ? 'border-b-2' : ''} pb-2 {currentStep >= i
				? 'border-primary-500'
				: 'border-surface-300'}"
		>
			<p
				class="font-semibold text-sm lg:text-base {currentStep >= i
					? 'text-primary-500'
					: 'text-surface-500'}"
			>
				{step}
			</p>
		</div>
	{/each}
</div>
