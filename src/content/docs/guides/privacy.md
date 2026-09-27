---
title: Privacy & External Requests
description: Every request stays on your own site, Blockly's media included.
---

Blockly, the engine underneath Morphic Blocks, needs a few images and sounds:
the trash can, the zoom controls, the drag cursors and the click and delete
sounds. On its own, Blockly loads them from Google's server
(`blockly-demo.appspot.com`), so every browser that opens the site contacts it.

Morphic Blocks loads them from your own site instead: `blockly-media/` next to
the page. Wherever a privacy policy applies, at a university or a school for
example, no visitor's browser contacts another server.

## Copy the media

Blockly's media comes with the package. The `morphic-blocks` command copies it
into the folder your app serves; run it before `dev` and `build`:

```json
{
  "scripts": {
    "dev": "morphic-blocks copy-media public/blockly-media && vite",
    "build": "morphic-blocks copy-media public/blockly-media && vite build"
  }
}
```

It copies only when the folder is new or Blockly was updated, so running it
every time costs nothing. The copy is generated, so add `public/blockly-media/`
to your `.gitignore`.

`public/` is the folder Vite serves as is; Next.js uses `public/` too. With
another bundler, copy to whichever folder it serves unchanged. The relative
path `blockly-media/` also works when your app lives under a subpath.

Without the copy, icons are missing and sounds stay silent; nothing else
breaks. The toolbox tiles use the same media, and never load sounds.

## Media from elsewhere

`blockly.media` points Blockly to another folder or server:

```ts
await engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  blockly: { media: "assets/blockly/" },
});
```

To use Google's copy, as Blockly does on its own, set
`media: "https://blockly-demo.appspot.com/static/media/"`. Visitors' browsers
then contact Google's server.

## Without sounds

To leave out the sounds altogether, turn them off:

```ts
blockly: { sounds: false }
```

## Check it

Open your app, then your browser's developer tools, and go to the **Network**
tab. Filter for `appspot`, then drag, drop and delete a block and use the zoom
controls. The list stays empty.
