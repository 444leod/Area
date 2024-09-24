<script lang="ts">
    import { enhance } from '$app/forms';

    let to = '';
    let subject = '';
    let body = '';

    async function sendEmail(event: Event) {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3000/areas', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ to, subject, body }),
			});

			if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('Response data:', data);

			if (data.webhook_id) {
			alert(`Email sent successfully! Webhook ID: ${data.webhook_id}`);
			to = '';
			subject = '';
			body = '';
			} else {
			alert('Email sent, but no webhook ID received.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Failed to send email. Please try again.');
		}
	}
</script>

<div class="container mx-auto p-10 space-y-4">
    <h1 class="h1 text-center">AREA</h1>
    <div class="card card-hover p-8">
        <h2 class="h2">Send Email when you open a PR on your github</h2>
        <form class="space-y-4" on:submit={sendEmail}>
            <label class="label">
                <span>To:</span>
                <input class="input" type="email" name="to" bind:value={to} placeholder="recipient@example.com" required />
            </label>
            <label class="label">
                <span>Subject:</span>
                <input class="input" type="text" name="subject" bind:value={subject} placeholder="Enter subject" required />
            </label>
            <label class="label">
                <span>Body:</span>
                <input class="input" name="body" bind:value={body} placeholder="Enter email content" required />
            </label>
            <button class="btn btn-xl variant-filled-primary" type="submit">Send Email</button>
        </form>
    </div>
</div>