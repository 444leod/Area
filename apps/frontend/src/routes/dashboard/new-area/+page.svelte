<script lang="ts">
	import { writable } from 'svelte/store';
	import { Zap, ArrowRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import MobileIndicator from '$lib/components/MobileIndicator.svelte';
	import AppCard from '$lib/components/AppCard.svelte';
	import AutomationSummary from '$lib/components/AutomationSummary.svelte';
	import TriggerBtn from '$lib/components/TriggerBtn.svelte';

	// Mock data for available apps with triggers and actions
	const apps = [
		{
			id: 1,
			name: 'Gmail',
			icon: '📧',
			triggers: ['New Email', 'Email Marked as Important', 'Email with Attachment'],
			actions: ['Send Email', 'Create Draft', 'Add Label to Email']
		},
		{
			id: 2,
			name: 'Slack',
			icon: '💬',
			triggers: ['New Message', 'Channel Created', 'File Uploaded'],
			actions: ['Send Message', 'Create Channel', 'Upload File']
		},
		{
			id: 3,
			name: 'Trello',
			icon: '📌',
			triggers: ['Card Created', 'Card Moved', 'Due Date Approaching'],
			actions: ['Create Card', 'Move Card', 'Add Comment to Card']
		},
		{
			id: 4,
			name: 'Twitter',
			icon: '🐦',
			triggers: ['New Tweet', 'New Follower', 'Mentioned in Tweet'],
			actions: ['Post Tweet', 'Send Direct Message', 'Like Tweet']
		},
		{
			id: 5,
			name: 'Dropbox',
			icon: '📁',
			triggers: ['New File', 'File Modified', 'File Shared'],
			actions: ['Upload File', 'Create Folder', 'Share File']
		}
	];

	// Steps in the automation creation process
	const steps = [
		'Choose Trigger App',
		'Select Trigger',
		'Choose Action App',
		'Select Action',
		'Set up Details',
		'Test & Review'
	];

	// Store for the current step
	let currentStep = writable(0);

	// Stores for selected apps, triggers, actions, and automation name
	let triggerApp = writable(null);
	let selectedTrigger = writable(null);
	let actionApp = writable(null);
	let selectedAction = writable(null);
	let automationName = writable('');

	function nextStep() {
		currentStep.update((n) => (n < steps.length - 1 ? n + 1 : n));
	}

	function prevStep() {
		currentStep.update((n) => (n > 0 ? n - 1 : n));
	}

	function selectApp(app, type) {
		if (type === 'trigger') {
			triggerApp.set(app);
		} else {
			actionApp.set(app);
		}
		nextStep();
	}

	function selectTriggerOrAction(item, type) {
		if (type === 'trigger') {
			selectedTrigger.set(item);
		} else {
			selectedAction.set(item);
		}
		nextStep();
	}

	function finishSetup() {
		alert('Automation created successfully!');
		currentStep.set(0);
		triggerApp.set(null);
		selectedTrigger.set(null);
		actionApp.set(null);
		selectedAction.set(null);
		automationName.set('');
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="h1 mb-8 text-center">Create New Automation</h1>

	<ProgressBar {steps} currentStep={$currentStep} />
	<MobileIndicator
		currentStep={$currentStep}
		totalSteps={steps.length}
		stepName={steps[$currentStep]}
	/>

	<div class="card variant-soft p-4 md:p-6">
		{#if $currentStep === 0 || $currentStep === 2}
			<h2 class="h2 mb-4 text-center" in:fade>
				Choose {$currentStep === 0 ? 'a Trigger' : 'an Action'} App
			</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each apps as app (app.id)}
					<AppCard
						{app}
						onClick={() => selectApp(app, $currentStep === 0 ? 'trigger' : 'action')}
					/>
				{/each}
			</div>
		{:else if $currentStep === 1 || $currentStep === 3}
			<h2 class="h2 mb-4 text-center" in:fade>
				Select {$currentStep === 1 ? 'Trigger' : 'Action'}
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each $currentStep === 1 ? $triggerApp.triggers : $actionApp.actions as item}
					<TriggerBtn
						{item}
						type={$currentStep === 1 ? 'trigger' : 'action'}
						onClick={() => selectTriggerOrAction(item, $currentStep === 1 ? 'trigger' : 'action')}
					/>
				{/each}
			</div>
		{:else if $currentStep === 4}
			<h2 class="h2 mb-4 text-center">Set up Details</h2>
			<div class="mb-4">
				<label for="automation-name" class="label">Automation Name</label>
				<input
					id="automation-name"
					type="text"
					class="input w-full"
					bind:value={$automationName}
					placeholder="Enter a name for your automation"
				/>
			</div>
			<div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
				<div class="mb-4 md:mb-0">
					<p class="font-semibold">Trigger: {$triggerApp?.name} - {$selectedTrigger}</p>
					<p class="text-surface-600 text-sm">When this happens...</p>
				</div>
				<ArrowRight class="hidden md:block" />
				<div class="mt-4 md:mt-0">
					<p class="font-semibold">Action: {$actionApp?.name} - {$selectedAction}</p>
					<p class="text-surface-600 text-sm">Do this...</p>
				</div>
			</div>
			<button class="btn variant-filled-primary w-full" on:click={nextStep}>Continue</button>
		{:else if $currentStep === 5}
			<h2 class="h2 mb-4 text-center">Test & Review</h2>
			<AutomationSummary
				name={$automationName}
				triggerApp={$triggerApp?.name}
				triggerAction={$selectedTrigger}
				actionApp={$actionApp?.name}
				selectedAction={$selectedAction}
			/>
			<button class="btn variant-filled-primary w-full" on:click={finishSetup}>
				<Zap class="w-4 h-4 mr-2" />
				Activate Automation
			</button>
		{/if}
	</div>
	<!-- Navigation buttons -->
	<div class="flex justify-between mt-8">
		<button class="btn variant-soft" on:click={prevStep} disabled={$currentStep === 0}>
			Back
		</button>
		{#if $currentStep < steps.length - 1 && $currentStep !== 1 && $currentStep !== 3}
			<button class="btn variant-filled-primary" on:click={nextStep}>Next</button>
		{/if}
	</div>
</div>
