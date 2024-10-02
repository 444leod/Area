<script lang="ts">
	import { enhance } from '$app/forms';
	import { Mail, Lock, LogIn } from 'lucide-svelte';
	import { page } from '$app/stores';

	let email = '';
	let password = '';

	function handleGoogleLogin() {
		// Handle Google login
		console.log('Google login clicked');
	}
</script>

<div class="flex items-center justify-center p-6">
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
			<button type="submit" class="btn variant-filled-primary w-full">
				<LogIn class="w-4 h-4 mr-2" />
				Log In
			</button>
			{#if $page.form?.incorrect}
				<p class="text-error-500">Email or password is incorrect</p>
			{/if}
			{#if $page.form?.error}
				<p class="text-error-500">{$page.form.error}</p>
			{/if}
		</form>
		<div class="divider my-4">OR</div>
		<button on:click={handleGoogleLogin} class="btn variant-soft w-full">
			<img src="/google-logo.png" alt="Google" class="w-5 h-5 mr-2" />
			Continue with Google
		</button>
		<div class="mt-4 text-center">
			<a href="/forgot-password" class="anchor">Forgot password?</a>
		</div>
		<div class="mt-2 text-center">
			Don't have an account? <a href="/signup" class="anchor">Sign up</a>
		</div>
	</div>
</div>
