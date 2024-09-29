<script lang="ts">
	export let name: string;
	export let triggerApp: string;
	export let triggerAction: string;
	export let actionApp: string;
	export let selectedAction: string;
</script>

<div class="mb-4">
	<h3 class="h3">Automation Summary</h3>
	<p><strong>Name:</strong> {name}</p>
	<p><strong>Trigger:</strong> {triggerApp} - {triggerAction}</p>
	<p><strong>Action:</strong> {actionApp} - {selectedAction}</p>
</div>
