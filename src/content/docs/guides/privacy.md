---
title: Privacy & External Requests
description: Keep every request on your own site by serving Blockly's media yourself.
---

Blockly, the engine underneath Morphic Blocks, loads its images and sounds
from Google's server (`blockly-demo.appspot.com`) by default: the trash can,
the zoom controls, the drag cursors and the click and delete sounds. Every
browser that opens your site then contacts that server. Wherever a privacy policy
applies, at a university or a school for example, you will want those files
to come from your own site.

## Serve Blockly's media yourself

**1. Copy the media folder into your static files.** Blockly is installed
together with Morphic Blocks, so the script looks it up from there. That way it
works with every package manager, pnpm included:

```js
// scripts/copy-blockly-media.mjs
import { cpSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Blockly comes with morphic-blocks, so look it up from there.
const require = createRequire(import.meta.url);
const blockly = dirname(require.resolve("blockly", { paths: [dirname(require.resolve("morphic-blocks"))] }));
cpSync(join(blockly, "media"), "public/blockly-media", { recursive: true });
```

**2. Run it before `dev` and `build`**, so the copy always matches the
installed Blockly:

```json
{
  "scripts": {
    "dev": "node scripts/copy-blockly-media.mjs && vite",
    "build": "node scripts/copy-blockly-media.mjs && vite build"
  }
}
```

The copy is generated, so add `public/blockly-media/` to your `.gitignore`.

**3. Point Blockly at the copy:**

```ts
await engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  blockly: { media: "blockly-media/" },
});
```

`public/` is the folder Vite serves as is; Next.js uses `public/` too. With
another bundler, copy to whichever folder it serves unchanged. The relative
path `blockly-media/` also works when your app lives under a subpath.

The toolbox tiles follow the same setting automatically, and never load sounds.

## Without sounds

To leave out the sounds altogether, turn them off:

```ts
blockly: { media: "blockly-media/", sounds: false }
```

## Check it

Open your app, then your browser's developer tools, and go to the **Network**
tab. Filter for `appspot`, then drag, drop and delete a block and use the zoom
controls. The list stays empty.
