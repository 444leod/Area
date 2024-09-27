<script lang="ts">
	import type { User } from "@shared/user.dto";
	const user: User = {
		id: "1",
		name: "zljvnzv",
		email: "zjvzjv",
		password: "zjvzjv",
	};
	console.log(user);
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>hello ca marche j'adore la vie</p>
		<h1 class="h1">
			Bienvenue sur notre AREA !!!
		</h1>
		<p>
			{JSON.stringify(user)}
		</p>
	</div>
</div>
