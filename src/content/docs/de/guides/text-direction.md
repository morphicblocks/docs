---
title: Textrichtung
description: Apps von rechts nach links (Arabisch, Hebräisch, Persisch) und Views, die andersherum laufen.
---

Die meisten Apps laufen dauerhaft in eine Richtung. Leg sie einmal fest, auf
der Seite und für die Blöcke:

```html
<html dir="rtl">
```

```ts
engine.mount({
  // …Container
  blockly: { rtl: true },
});
```

- **Blöcke:** `blockly.rtl` zeichnet die Workspaces von rechts nach links; die
  Toolbox-Kacheln folgen ihm.
- **Text-Views:** Codespaces folgen dem `dir` der Seite, wie jedes andere
  Element.

## Ein View in die andere Richtung

Das `rtl` eines Views setzt seine Richtung für sich, z. B. Python von links
nach rechts auf einer Seite von rechts nach links, oder arabische Blöcke neben
englischen:

```json
{
  "views": {
    "editor-pane": "workspace",
    "text-pane": { "kind": "codespace", "rtl": false }
  }
}
```

Weggelassen folgt ein View der Seite (Codespaces) oder `blockly.rtl`
(Workspaces), was die meisten Apps wollen. Bei einem Codespace tut `dir` an
seinem Container dasselbe.

## Die Richtung wechseln

Blockly legt die Richtung eines Workspace fest, wenn er entsteht, also baut ein
Wechsel die Views neu. Speichere das Programm, mounte mit der neuen Richtung
und lade es:

```ts
// `config`: was die App anfangs `mount()` gegeben hat.
async function setDirection(rtl: boolean) {
  const program = engine.serializeWorkspace();
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  await engine.mount({ ...config, blockly: { ...config.blockly, rtl } });
  engine.loadWorkspace(program);
}
```

`mount()` beginnt von vorn: Füge die Views aus `addView()` erneut hinzu, und
Rückgängig beginnt leer.
