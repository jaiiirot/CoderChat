<script>
  import { Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatus } from "../store.ts";
  import StepChat from "./StepChat.svelte";
  import StepLoading from "./StepLoading.svelte";
  import StepUpload from "./StepUpload.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
<StepChat />
{:else if $appStatus === APP_STATUS.LOADING}
<StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
<Alert>
  <span class="font-medium">¡ALGO MALO PASO!</span>
  Hay un error en la aplicacion
</Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
<StepUpload />
{:else}
  <Alert>
    <span class="font-medium">¡ACCION NO RECONOCIDA!</span>
    Hay un error en la aplicacion
  </Alert>
{/if}
