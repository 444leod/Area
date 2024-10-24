<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ErrorModal from '$lib/components/ErrorModal.svelte';
	import '../app.postcss';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<Navbar />
<slot />
<ErrorModal />
