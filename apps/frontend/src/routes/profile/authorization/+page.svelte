<script lang="ts">

import {oauthJira} from "$lib/modules/oauthJira";
</script>

<button on:click={oauthJira} class="btn variant-soft w-full">
    <img src="/google-logo.png" alt="Google" class="w-5 h-5 mr-2" />
    Continue with Jira
</button>