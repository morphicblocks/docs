---
title: Bereiche in der Größe ändern
description: Das Seitenlayout gehört der App; makeResizable ist ein optionaler Helfer für Trenner.
---

Jeder View sitzt in einem eigenen Container, also platzierst du Toolbox,
Workspaces und Codespaces, wo deine Seite sie braucht. Das Framework steuert
nie das Layout. Die Größe von Bereichen zu ändern gehört zu diesem Layout: CSS
oder die geteilten Bereiche deiner UI-Bibliothek funktionieren, wie sie sind.

Für einen einfachen Trenner zwischen zwei Bereichen exportiert das Framework
einen optionalen, ungestalteten Helfer. Du gibst ihm dein Trenner-Element und
den Bereich, dessen Größe er ändert; der Bereich muss ein Flex-Item sein:

```ts
import { makeResizable } from "morphic-blocks";

const divider = makeResizable(document.getElementById("gutter")!, {
  target: document.getElementById("codespace-pane")!,
  axis: "x",          // "x" ändert die Breite, "y" die Höhe
  min: 200,           // Pixel
  max: 800,
  invert: false,      // true, wenn der Trenner vor dem Bereich sitzt, den er ändert
  onResize: (size) => localStorage.setItem("codespace-width", String(size)),
});

divider.dispose();    // löst ihn wieder
```

Er ändert die `flex-basis` des Bereichs, während der Trenner mit der Maus oder
einem Finger gezogen wird. Ein Workspace im Bereich zeichnet sich neu, wenn
sich seine Größe ändert.

## Tastatur und Screenreader

Der Trenner ist mit Tab erreichbar und lässt sich mit den Pfeiltasten entlang
seiner Achse bewegen, um `step` Pixel (Standard 10), mit Umschalt fünfmal so
weit. Pos1 und Ende gehen zu `min` und `max`.

Screenreader kündigen ihn als Griff zum Ändern der Größe an: Er bekommt
`role="separator"`, `aria-orientation` und die Größe des Bereichs in
`aria-valuenow`, `aria-valuemin` und `aria-valuemax`. Gib dem Bereich eine
`id`, und der Trenner nennt ihn in `aria-controls`; füge ein `aria-label`
hinzu, das sagt, was er ändert:

```html
<div id="gutter" aria-label="Größe des Codes ändern"></div>
```

Wie der Trenner aussieht, sein Cursor und sein Fokusrahmen gehören deinem CSS.
