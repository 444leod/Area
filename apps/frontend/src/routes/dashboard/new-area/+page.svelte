<script>
  import { writable } from 'svelte/store';
  import { Zap, ArrowRight, Check, X } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

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
  const steps = ['Choose Trigger App', 'Select Trigger', 'Choose Action App', 'Select Action', 'Set up Details', 'Test & Review'];

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
  <h1 class="h1 mb-8">Create New Automation</h1>

  <!-- Progress bar -->
  <div class="flex mb-8">
    {#each steps as step, i}
      <div
        class="flex-1 {i !== steps.length - 1 ? 'border-b-2' : ''} pb-2 {$currentStep >= i
          ? 'border-primary-500'
          : 'border-surface-300'}"
      >
        <p class="font-semibold {$currentStep >= i ? 'text-primary-500' : 'text-surface-500'}">
          {step}
        </p>
      </div>
    {/each}
  </div>

  <div class="card variant-soft p-6">
    {#if $currentStep === 0 || $currentStep === 2}
      <h2 class="h2 mb-4" in:fade>Choose {$currentStep === 0 ? 'a Trigger' : 'an Action'} App</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each apps as app (app.id)}
          <div
            in:fly="{{ y: 50, duration: 300, delay: app.id * 50 }}"
            class="card variant-soft-hover cursor-pointer transition-all duration-200 hover:scale-105"
            on:click={() => selectApp(app, $currentStep === 0 ? 'trigger' : 'action')}
          >
            <header class="card-header flex justify-center items-center h-24">
              <span class="text-4xl">{app.icon}</span>
            </header>
            <section class="p-4 text-center">
              <h3>{app.name}</h3>
            </section>
          </div>
        {/each}
      </div>
    {:else if $currentStep === 1 || $currentStep === 3}
      <h2 class="h2 mb-4" in:fade>Select {$currentStep === 1 ? 'Trigger' : 'Action'}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each $currentStep === 1 ? $triggerApp.triggers : $actionApp.actions as item}
          <button
            class="btn variant-soft flex items-center justify-start p-4 h-auto"
            on:click={() => selectTriggerOrAction(item, $currentStep === 1 ? 'trigger' : 'action')}
          >
            <span class="text-2xl mr-4">{$currentStep === 1 ? '🔔' : '🎬'}</span>
            <span>{item}</span>
          </button>
        {/each}
      </div>
    {:else if $currentStep === 4}
      <h2 class="h2 mb-4">Set up Details</h2>
      <div class="mb-4">
        <label for="automation-name" class="label">Automation Name</label>
        <input
          id="automation-name"
          type="text"
          class="input"
          bind:value={$automationName}
          placeholder="Enter a name for your automation"
        />
      </div>
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div class="mb-4 md:mb-0">
          <p class="font-semibold">Trigger: {$triggerApp?.name} - {$selectedTrigger}</p>
          <p class="text-surface-600">When this happens...</p>
        </div>
        <ArrowRight class="hidden md:block" />
        <div>
          <p class="font-semibold">Action: {$actionApp?.name} - {$selectedAction}</p>
          <p class="text-surface-600">Do this...</p>
        </div>
      </div>
      <button class="btn variant-filled-primary w-full" on:click={nextStep}>Continue</button>
    {:else if $currentStep === 5}
      <h2 class="h2 mb-4">Test & Review</h2>
      <div class="mb-4">
        <h3 class="h3">Automation Summary</h3>
        <p><strong>Name:</strong> {$automationName}</p>
        <p><strong>Trigger:</strong> {$triggerApp?.name} - {$selectedTrigger}</p>
        <p><strong>Action:</strong> {$actionApp?.name} - {$selectedAction}</p>
      </div>
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