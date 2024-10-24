<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/store/authStore';
	import { enhance } from '$app/forms';
	import { Mail, Lock, User, UserPlus } from 'lucide-svelte';
	import { oauthGoogle } from '$lib/modules/oauthGoogle';
	import { goto } from '$app/navigation';
	import { setError } from '$lib/store/errorMessage';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let first_name = '';
	let last_name = '';

	$: if ($page.form?.success) {
		authStore.set(true);
		setTimeout(() => goto('/dashboard'), 1500);
	} else if ($page.form?.error) {
		setError($page.form.error);
	}
</script>

<div class="flex flex-col gap-10 items-center justify-center p-6">
	<div class="card p-8 w-full max-w-md shadow-xl">
		<h2 class="h2 mb-4 text-center">Create an Account</h2>
		<form method="POST" use:enhance class="space-y-4">
			<label class="label">
				<span>First Name</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><User /></div>
					<input
						name="first_name"
						type="text"
						placeholder="John"
						bind:value={first_name}
						required
					/>
				</div>
			</label>
			<label class="label">
				<span>Last Name</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><User /></div>
					<input name="last_name" type="text" placeholder="Doe" bind:value={last_name} required />
				</div>
			</label>
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
						placeholder="Create a strong password"
						bind:value={password}
						required
					/>
				</div>
			</label>
			<label class="label">
				<span>Confirm Password</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Lock /></div>
					<input
						name="confirmPassword"
						type="password"
						placeholder="Confirm your password"
						bind:value={confirmPassword}
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
					<UserPlus class="w-4 h-4 mr-2" />
					Sign Up
				</button>
			</div>
		</form>
		<div class="mt-4 text-center">
			Already have an account? <a href="/login" class="anchor">Log in</a>
		</div>
	</div>
</div>
