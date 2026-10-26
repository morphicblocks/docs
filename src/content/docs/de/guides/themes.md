---
title: Themes
description: Fertige Farben für die Code-Views aus dem Paket @morphicblocks/themes.
---

Ein Theme für die Code-Views ist ein einfaches Objekt (alle Felder unter
[Themes](/de/guides/preview-and-code-editor/#themes)). Das optionale Paket
`@morphicblocks/themes` enthält fertige Themes, sodass eine App eines wählen
kann, statt eigene Farben zu schreiben:

```bash
npm install @morphicblocks/themes
```

```ts
import { standard } from "@morphicblocks/themes";

await engine.mount({
  // …Container
  editorTheme: standard.light,
});
```

Themes kommen in **Familien**: Jede enthält eine `light`- und eine
`dark`-Version, sodass eine Seite, die zwischen hell und dunkel wechselt,
beide an einer Stelle findet.

| Familie  | `light`                          | `dark`                                   |
| -------- | -------------------------------- | ---------------------------------------- |
| `standard` | Weißer Hintergrund | Dunkler Hintergrund, der Standard des Frameworks |

Jede Version setzt jedes Feld, sodass beim Wechsel nichts von der anderen
zurückbleibt. Die Farben von `standard` beruhen auf den Themes Light+ und
Dark+ von VS Code.

```ts
import { standard } from "@morphicblocks/themes";

const theme = darkMode ? standard.dark : standard.light;
engine.setViewTheme("codespace", theme);
engine.setCodeEditorTheme(theme);
```

`themes` enthält jede Familie nach Namen, etwa für eine Theme-Auswahl. Jede
Familie ist eine JSON-Datei im Paket, eine neue ist also eine neue Datei. Ein Theme
bleibt ein einfaches Objekt, eine kleine Änderung braucht also kein neues
Theme: `{ ...standard.light, fontSize: "16px" }`.

Themes legen die Editor-Farben und die Schrift fest, nicht die Token-Farben:
Schlüsselwörter, Strings und Zahlen kommen aus dem
[`highlighting`](/de/guides/syntax-highlighting/) jedes Code-Elements. Bei
einem hellen Theme setze auch eine sichtbare
[Auswahl-Hervorhebung](/de/guides/selection-sync/#optionen).
