<script lang="ts">
    import { page } from "$app/stores";
    import { navigating } from "$app/stores";
    import Muttual from "./Muttual.svelte";
    import Alert from "../../../../../../client/Alert.svelte";
    import { onMount } from "svelte";


    onMount(() => {
        if ($page.url.searchParams.has("not_logged")) {
            new Alert({
                target: document.body,
                props: {
                    type: "info",
                    message: `To perform action on page '${$navigating?.from || "Cannot be obtain"}' you must be firstly logged in!'`,
                    temporaryMs: 30_000 // persit up to 30th second
                }
            })
        }
    })
</script>

<Muttual/>
