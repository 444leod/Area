<script lang="ts">
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Zap, ArrowRight, CheckCircle } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import ProgressBar from '$lib/components/new-area/ProgressBar.svelte';
	import MobileIndicator from '$lib/components/new-area/MobileIndicator.svelte';
	import AppCard from '$lib/components/new-area/AppCard.svelte';
	import AutomationSummary from '$lib/components/new-area/AutomationSummary.svelte';
	import TriggerBtn from '$lib/components/new-area/TriggerBtn.svelte';

	export let data: PageData;

	// Available apps with triggers and actions
	const apps = [
		{
			id: 1,
			name: 'Example App',
			icon: '🔧',
			triggers: ['EXAMPLE_ACTION'],
			actions: []
		},
		{
			id: 2,
			name: 'Email App',
			icon: '📧',
			triggers: [],
			actions: ['SEND_EMAIL']
		},
		{
			id: 3,
			name: 'Timer App',
			icon: '⏲️',
			triggers: ['EACH_X_SECONDS'],
			actions: []
		},
		{
			id: 4,
			name: 'YouTube App',
			icon: '▶️',
			triggers: ['ON_YOUTUBE_VIDEO_POSTED'],
			actions: []
		},
		{
			id: 5,
			name: 'Google Tasks',
			icon: '✅',
			triggers: [],
			actions: ['CREATE_GOOGLE_TASK']
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

	// Stores for selected apps, triggers, actions, and automation details
	let triggerApp = writable(null);
	let selectedTrigger = writable(null);
	let actionApp = writable(null);
	let selectedAction = writable(null);
	let automationName = writable('');
	let actionDetails = writable({});
	let reactionDetails = writable({});

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
			if (item === 'EACH_X_SECONDS') {
				actionDetails.set({ type: item, seconds: 60 });
			} else if (item === 'ON_YOUTUBE_VIDEO_POSTED') {
				actionDetails.set({ type: item, user_id: '' });
			} else {
				actionDetails.set({ type: item, exampleField: '' });
			}
		} else {
			selectedAction.set(item);
			if (item === 'SEND_EMAIL') {
				reactionDetails.set({ type: item, to: '', subject: '', body: '' });
			} else if (item === 'CREATE_GOOGLE_TASK') {
				reactionDetails.set({ type: item, content: { title: '', body: '' } });
			} else {
				reactionDetails.set({ type: item });
			}
		}
		nextStep();
	}

	let formMessage = '';
	let showSuccessAnimation = false;

	function handleCreateAreaResult(result) {
		if (result.type === 'success') {
			showSuccessAnimation = true;
			formMessage = 'Automation created successfully!';
			setTimeout(() => {
				goto('/dashboard');
			}, 2000); // Redirect after 2 seconds
		} else {
			formMessage = `Failed to create automation: ${result.data?.message || 'Unknown error'}`;
		}
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
		{#if showSuccessAnimation}
			<div class="flex flex-col items-center justify-center h-64" in:fly={{ y: 50, duration: 500 }}>
				<CheckCircle class="w-24 h-24 text-success mb-4" />
				<h2 class="h2 text-center text-success">Automation Created Successfully!</h2>
				<p class="mt-2">Redirecting to Dashboard...</p>
			</div>
		{:else if $currentStep === 0 || $currentStep === 2}
			<h2 class="h2 mb-4 text-center" in:fade>
				Choose {$currentStep === 0 ? 'a Trigger' : 'an Action'} App
			</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each apps.filter( (app) => ($currentStep === 0 ? app.triggers.length > 0 : app.actions.length > 0) ) as app (app.id)}
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
			{#if $selectedTrigger === 'EXAMPLE_ACTION'}
				<div class="mb-4">
					<label for="example-field" class="label">Example Field</label>
					<input
						id="example-field"
						type="text"
						class="input w-full"
						bind:value={$actionDetails.exampleField}
						placeholder="Enter example field value"
					/>
				</div>
			{:else if $selectedTrigger === 'EACH_X_SECONDS'}
				<div class="mb-4">
					<label for="seconds" class="label">Interval (seconds)</label>
					<input
						id="seconds"
						type="number"
						class="input w-full"
						bind:value={$actionDetails.seconds}
						placeholder="Enter interval in seconds"
						min="1"
					/>
				</div>
			{:else if $selectedTrigger === 'ON_YOUTUBE_VIDEO_POSTED'}
				<div class="mb-4">
					<label for="user-id" class="label">YouTube User ID</label>
					<input
						id="user-id"
						type="text"
						class="input w-full"
						bind:value={$actionDetails.user_id}
						placeholder="Enter YouTube User ID"
					/>
				</div>
			{/if}
			{#if $selectedAction === 'SEND_EMAIL'}
				<div class="mb-4">
					<label for="email-to" class="label">To</label>
					<input
						id="email-to"
						type="email"
						class="input w-full"
						bind:value={$reactionDetails.to}
						placeholder="Enter recipient email"
					/>
				</div>
				<div class="mb-4">
					<label for="email-subject" class="label">Subject</label>
					<input
						id="email-subject"
						type="text"
						class="input w-full"
						bind:value={$reactionDetails.subject}
						placeholder="Enter email subject"
					/>
				</div>
				<div class="mb-4">
					<label for="email-body" class="label">Body</label>
					<textarea
						id="email-body"
						class="textarea w-full"
						bind:value={$reactionDetails.body}
						placeholder="Enter email body"
						rows="4"
					></textarea>
				</div>
			{:else if $selectedAction === 'CREATE_GOOGLE_TASK'}
				<div class="mb-4">
					<label for="task-title" class="label">Task Title</label>
					<input
						id="task-title"
						type="text"
						class="input w-full"
						bind:value={$reactionDetails.content.title}
						placeholder="Enter task title"
					/>
				</div>
				<div class="mb-4">
					<label for="task-body" class="label">Task Description</label>
					<textarea
						id="task-body"
						class="textarea w-full"
						bind:value={$reactionDetails.content.body}
						placeholder="Enter task description"
						rows="4"
					></textarea>
				</div>
			{/if}
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
			<form
				method="POST"
				action="?/createArea"
				use:enhance={() => {
					return async ({ result }) => {
						handleCreateAreaResult(result);
					};
				}}
			>
				<input type="hidden" name="actionDetails" value={JSON.stringify($actionDetails)} />
				<input type="hidden" name="reactionDetails" value={JSON.stringify($reactionDetails)} />
				<button type="submit" class="btn variant-filled-primary w-full">
					<Zap class="w-4 h-4 mr-2" />
					Activate Automation
				</button>
			</form>
			{#if formMessage}
				<p class="mt-4 text-center" class:text-error={formMessage.includes('Failed')}>
					{formMessage}
				</p>
			{/if}
		{/if}
	</div>

	<!-- Navigation buttons -->
	<div class="flex justify-between mt-8">
		<button
			class="btn variant-soft"
			on:click={prevStep}
			disabled={$currentStep === 0 || showSuccessAnimation}
		>
			Back
		</button>
		{#if $currentStep < steps.length - 1 && $currentStep !== 1 && $currentStep !== 3}
			<button class="btn variant-filled-primary" on:click={nextStep} disabled={showSuccessAnimation}
				>Next</button
			>
		{/if}
	</div>
</div>
