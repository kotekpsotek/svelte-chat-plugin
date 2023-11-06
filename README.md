# Svelte-Chat-Plugin
The ***sveltekit*** plugin for **svelte-chat** solution


# Swift description
Plugin for **svelte-chat** which in conjuction with [@svelte-chat/gui](https://github.com/kotekpsotek/svelte-chat-gui) makes remakable chat experiences which at least can handle cases from your online shop etc...
> - This plugin is required to handle communication demanded by frontend solution part which is the [@svelte-chat/gui](https://github.com/kotekpsotek/svelte-chat-gui)
> - Use only with [@svelte-chat/gui](https://github.com/kotekpsotek/svelte-chat-gui) to make full *****svelte-chat*** solution**  

## Prerequisites
1. SvelteKit app,
2. MongoDB configured on port 27017

# Installation (as always - for npm)
```bash
$ npm i @svelte-chat/plugin
```

# You're one step in front of finish line (whole soultion implementation isn't accounted):
***1st:*** Use **svelteChatPlugin** which embedds all source functionalities (with administration included)
```typescript
// vite.config.{js,ts}
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// Import plugin from module
import { svelteChatPlugin } from "@svelte-chat/plugin";

export default defineConfig({
	plugins: [sveltekit(), svelteChatPlugin()]
});
```

## Fine grainded configuration
Fine grained configuartion covers for moment ports configuration for: **basic app communication**, **admin app** and all these ***optionally*** and ***separately***.<br/>
You have to pass config as JSON content for your Device Environment Variable ***SVELTE_CHAT*** <br/><br/>
**Configuration JSON Overlay:**
```JSON
{
    /* Admin app - Where serves app under whose you can manage clien cases */
    "admin_server": {
        "port": 10502
    },
    /* App communcation - so where your client-side will be call, to get and send informations */
    "server": {
        "port": 10501
    }
}
```

**As Device ENV "***SVELTE_CHAT***":**<br/>
Ok, So when we defined what you can configure, to make this work and <u>***end fine-grained configuration***</u> you must pass such short config to device environment varaible ***SVELTE_CHAT***


## Other worth informations
1. Default Admin App port is **10502**,
2. Default App communcation port is **10501** (for this port will be call ***@svelte-chat/gui*** client),
3. It works fully as a vite sveltekit plugin,
4. To store all datas we use **MongoDB** local database on default port **27017**

## Contribution:
**You feel will to help in solution evolution.** Don't be shy and pull issue with demand like: I would like take the participation in evolution because ...[cause]

## License
All what you should know about Copyrights is that all code base is under <u>Apache 2.0</u>

<h3 align="center">Made with ❤️ by <b><a href="https://github.com/kotekpsotek">kotekpsotek</a></b></h3>
