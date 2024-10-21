<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/store/authStore';
	import { enhance } from '$app/forms';
	import { Mail, Lock, LogIn } from 'lucide-svelte';
	import { oauthGoogle } from "$lib/modules/oauthGoogle";
	import { goto } from '$app/navigation';
	import { setError } from "$lib/store/errorMessage";

	let email = '';
	let password = '';
	$: if ($page.form?.success) {
		authStore.set(true);
		setTimeout(() => goto('/dashboard'), 500);
	} else if ($page.form?.incorrect || $page.form?.error) {
		setError($page.form.error || 'Incorrect email or password');
	}
</script>

<div class="flex flex-col gap-10 items-center justify-center p-6">
	<div class="card p-8 w-full max-w-md shadow-xl">
		<h2 class="h2 mb-4 text-center">Welcome Back!</h2>
		<form method="POST" use:enhance class="space-y-4">
			<label class="label">
				<span>Email</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Mail /></div>
					<input
							name="email"
							type="email"
							placeholder="your@email.com"
							bind:value={email}
							required
					/>
				</div>
			</label>
			<label class="label">
				<span>Password</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Lock /></div>
					<input
							name="password"
							type="password"
							placeholder="password"
							bind:value={password}
							required
					/>
				</div>
			</label>
			<div class="flex flex-row items-center justify-center gap-4">
				<button on:click={oauthGoogle} class="btn variant-soft w-full">
					<img src="/google-logo.png" alt="Google" class="w-5 h-5 mr-2" />
					Continue with Google
				</button>
				<button type="submit" class="btn variant-filled-primary w-full">
					<LogIn class="w-4 h-4 mr-2" />
					Log In
				</button>
			</div>
		</form>
	</div>
</div>