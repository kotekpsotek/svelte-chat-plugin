<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    const dt = $page.data;

    if (browser) {
        if ($page.form?.action && $page.form.success) {
            alert($page.form.action == "signup" ? "You have made administrator account!" : "You have been logged-in as administrator");
            if ($page.form.action == "signin") {
                goto("/panel");
            }
        }
        else if ($page.form?.action) {
            alert($page.form.action == "signup" ? "You cannot make administrator account from some reason!" : "You pass incorrect signin datas");
        }
    }

    function stopPaste(ev: Event) {
        ev.preventDefault();
    }

    type ActionTypes = "signin" | "signup";

    let name = "";
    let email = "";
    let password: string = "";
    let passwordCheck = ""

    function submitReceived(ac: ActionTypes) {
        return (ev: Event) => {
            // Prevent from send form to server only in specific cases
            switch (ac) {
                case "signup":
                    if (!(email || password && password == passwordCheck || name.length)) {
                        ev.preventDefault();
                        alert("You must confirm your account verification by passthrought required datas to form fields: 'email', 'password', 'password correcteness check'");
                    }
                break;

                case "signin":
                    if (!email || !password) {
                        ev.preventDefault();
                        alert("To pass your login datas you must confirm your occurance in dataset by pass email and password in correct fields for this");
                    }
                break;
            }
        };
    }
</script>

<div>
    <form action="?/{dt.for}" method="POST" on:submit={submitReceived(dt.for)}>
        <h1>{dt.for == "signin" ? "Signin" : "Signup"}</h1>
        {#if dt.for == "signin"}
            <input name="email" type="email" placeholder="Email" bind:value={email} on:paste={stopPaste}>
            <input name="password" type="password" placeholder="Password" bind:value={password} on:paste={stopPaste}>
        {:else if dt.for == "signup"}
            <input name="name" type="text" placeholder="Name" bind:value={name}/>
            <input name="email" type="email" placeholder="Email" bind:value={email}/>
            <input name="password" type="password" placeholder="Password" bind:value={password} on:paste={stopPaste}>
            <input type="password" placeholder="Password Check" bind:value={passwordCheck} on:paste={stopPaste}/>
        {/if}
        <button type="submit">Submit</button>
    </form>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 450px;
        padding: 10px;
        border: solid 1px black;
        border-radius: 5px;
    }
</style>
