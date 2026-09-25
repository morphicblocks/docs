---
title: Datenschutz & externe Anfragen
description: Alle Anfragen auf der eigenen Seite halten, indem du Blocklys Medien selbst auslieferst.
---

Blockly, die Engine unter Morphic Blocks, lädt seine Bilder und Sounds
standardmäßig von Googles Server (`blockly-demo.appspot.com`): den Papierkorb,
die Zoom-Steuerung, die Cursor beim Ziehen und die Klick- und Lösch-Sounds.
Jeder Browser, der deine Seite aufruft, kontaktiert dann diesen Server. Überall, wo eine Datenschutzerklärung gilt, etwa an einer Hochschule
oder Schule, sollen diese Dateien von deiner eigenen Seite kommen.

## Blocklys Medien selbst ausliefern

**1. Den Medien-Ordner in deine statischen Dateien kopieren.** Blockly wird
zusammen mit Morphic Blocks installiert, deshalb sucht das Skript es von dort
aus. So funktioniert es mit jedem Paketmanager, auch mit pnpm:

```js
// scripts/copy-blockly-media.mjs
import { cpSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Blockly kommt mit morphic-blocks, also von dort aus suchen.
const require = createRequire(import.meta.url);
const blockly = dirname(require.resolve("blockly", { paths: [dirname(require.resolve("morphic-blocks"))] }));
cpSync(join(blockly, "media"), "public/blockly-media", { recursive: true });
```

**2. Vor `dev` und `build` ausführen**, damit die Kopie immer zum installierten
Blockly passt:

```json
{
  "scripts": {
    "dev": "node scripts/copy-blockly-media.mjs && vite",
    "build": "node scripts/copy-blockly-media.mjs && vite build"
  }
}
```

Die Kopie wird erzeugt, also trage `public/blockly-media/` in deine
`.gitignore` ein.

**3. Blockly auf die Kopie zeigen lassen:**

```ts
await engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  blockly: { media: "blockly-media/" },
});
```

`public/` ist der Ordner, den Vite unverändert ausliefert; Next.js nutzt
ebenfalls `public/`. Bei einem anderen Bundler kopierst du in den Ordner, den
er unverändert ausliefert. Der relative Pfad `blockly-media/` funktioniert auch,
wenn deine App unter einem Unterpfad läuft.

Die Toolbox-Kacheln folgen dieser Einstellung automatisch und laden nie Sounds.

## Ohne Sounds

Um die Sounds ganz wegzulassen, schalte sie aus:

```ts
blockly: { media: "blockly-media/", sounds: false }
```

## Prüfen

Öffne deine App, dann die Entwicklertools des Browsers, und wechsle zum Tab
**Netzwerk**. Filtere nach `appspot`, ziehe dann einen Block hinein, lösche ihn
und nutze die Zoom-Steuerung. Die Liste bleibt leer.
