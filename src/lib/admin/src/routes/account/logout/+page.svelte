<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import cookie from "js-cookie";
    import Alert from "../../../../../../client/Alert.svelte";

    export let data: PageData;
    let celebrateUrl = "https://www.youtube.com/watch?v=4L_yCwFD6Jo";

    let logoutState = false;

    async function logout() {
        const action = await fetch(document.location.toString(), {
            method: "POST",
            credentials: "include"
        });

        if (action.status == 200) {
            logoutState = true;
        }
        else new Alert({
            target: document.body,
            props: {
                type: "error",
                message: "Weh, Error was caught durning logout action",
                temporaryMs: 10_000 // 10 seconds
            }
        })
    }
</script>

<div>
    <main>
        {#if !logoutState}
            {#if data.loggedIn}
                <h1>Logout</h1>
                <button on:click={logout}>Click to logout</button>
            {:else}
                <h1>You're not login</h1>
                <button on:click={() => goto("/account/signin")}>Go to login page</button>
            {/if}
        {:else}
            <h1>You have been logout</h1>
            <button on:click={() => document.location = celebrateUrl}>Celebrate</button>
        {/if}
    </main>
</div>

<style>
    div {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    main {
        min-width: 400px;
        padding: 5px;
        border: solid 1px black;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
</style>
