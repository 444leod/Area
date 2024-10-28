<script lang="ts">
	export let steps: string[];
	export let currentStep: number;
</script>

<div class="hidden md:flex ">
	{#each steps as step, i}
		<div
			class="flex-1"
		>
			<p
				class="font-semibold text-sm lg:text-base {currentStep >= i
					? 'text-primary-600-300-token'
					: 'text-secondary-800-100-token'}"
			>
				{step.label}
			</p>
		</div>
	{/each}
</div>
