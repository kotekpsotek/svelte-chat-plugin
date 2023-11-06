# **SvelteKIT** Routing Admin Panel Application side
This app snippest is for handling admin stuffs into **svelte-chat** module like: 
1. Manage Messages, 
2. Respond for messages 
etc..

## How to use
Whole this one is prepared for co-operation with node.js and in this case ***express.js** by **@sveltejs/adapter-node** which bundle application to shape acceptable by node.js.

To build App:
```bash
$ npm run build
```

To deploy in Express.js:
```js
    const app = require("express")();
    const svelteSnippest = require("./build/handler.js"); // Import handler.js from build directory (location where application was built for node.js)

    app.use(svelteSnippest); // Let SvelteKit app work in his programmed way

    app.listen(80); // Listen on specified port
```

[More informations throught SvelteKit documentation for ***adapter-node***](https://kit.svelte.dev/docs/adapter-node)