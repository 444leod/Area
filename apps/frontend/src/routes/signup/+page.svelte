<script lang="ts">
	import { enhance } from '$app/forms';
	import { Mail, Lock, User, UserPlus } from 'lucide-svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = '';
	let password = '';
	let confirmPassword = '';
	let first_name = '';
	let last_name = '';
</script>

<div class="flex items-center justify-center p-6">
	<div class="card p-8 w-full max-w-md shadow-xl">
		<h2 class="h2 mb-4 text-center">Create an Account</h2>

		<form method="POST" use:enhance class="space-y-4">
			{#if form?.error}
				<div class="alert variant-filled-error">{form.error}</div>
			{/if}

			<label class="label">
				<span>Fist Name</span>
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

			<button type="submit" class="btn variant-filled-primary w-full">
				<UserPlus class="w-4 h-4 mr-2" />
				Sign Up
			</button>
		</form>

		<div class="divider my-4">OR</div>

		<a href="{import.meta.env.VITE_API_URL}/auth/google">
			<button class="btn variant-soft w-full">
				<img src="/google-logo.png" alt="Google" class="w-5 h-5 mr-2" />
				Continue with Google
			</button>
		</a>

		<div class="mt-4 text-center">
			Already have an account? <a href="/login" class="anchor">Log in</a>
		</div>
	</div>
</div>
