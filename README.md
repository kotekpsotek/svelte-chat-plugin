# Svelte-Chat-Plugin
The ***sveltekit*** plugin for **svelte-chat** solution

# Swift description
Plugin for **svelte-chat** which in conjuction with [@svelte-chat/gui](https://github.com/kotekpsotek/svelte-chat-gui) makes remakable chat experiences which at least can handle cases from your online shop etc... [**full documentation**](https://kotekpsotek.github.io/svelte-chat-docs/)
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

## **How to run app correctly?**
Always will be correct for bash CLI (beyond powershell and cmd):
1. Developement mode
```bash
$ ORIGIN="admin_server.port" npm run dev
```
2. In production as node app (after transiple sveltekit to node.js handler by use @sveltejs/adapter-node):
```bash
$ ORIGIN="admin_server.port" node .
```
* Be aware:
    * **ORIGIN="admin_server.port"** - where is determined ***"admin_server.port"*** gives location where your **admin_server** exists. E.g: 
        * Default value should always be **10502** -> in space when you didn't configured <u>**Fine grainded configuration**</u> *admin_server.port* number,
        * When you change <u>**Fine grainded configuration**</u> *admin_server.port* number you should put that value here
        > This isn't my idea but determined via how transpiled to node.js sveltekit app works. Please don't be angry on me 😍!
        
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
