<script lang="ts">
	export let currentStep: number;
	export let totalSteps: number;
	export let stepName: string;
</script>

<div class="md:hidden mb-4 text-center">
	<p class="font-semibold">Step {currentStep + 1} of {totalSteps}</p>
	<p class="text-sm">{stepName}</p>
</div>
