<script lang="ts">
	import ProgressBar from '$lib/components/new-area/ProgressBar.svelte';
	import MobileIndicator from '$lib/components/new-area/MobileIndicator.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: currentStep = data.currentStepIndex;
	$: steps = data.steps;
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="h1 mb-8 text-center">Create New Automation</h1>

	<ProgressBar {steps} {currentStep} />
	<MobileIndicator {currentStep} totalSteps={steps.length} stepName={steps[currentStep].label} />

	<div class="card variant-soft p-4 md:p-6">
		<slot />
	</div>
</div>
