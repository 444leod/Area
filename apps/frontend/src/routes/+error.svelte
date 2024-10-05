<script>
    export let status;
    export let message = "Something went wrong. Please try again.";
  </script>

  <div class="flex flex-col items-center justify-center gap-5 bg-error-100-800-token">
    <h1 class="error-status h1"> 404 not found: {status}</h1>
    <p>{message}, this is a test</p>
    <p>Please check your connection or try again later.</p>
  </div>