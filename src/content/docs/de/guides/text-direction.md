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

- **Blöcke:** `blockly.rtl` zeichnet den Workspace von rechts nach links;
  zusätzliche Workspaces und die Toolbox-Kacheln folgen ihm.
- **Text-Views:** Codespace, Preview und zusätzliche Text-Views folgen dem
  `dir` der Seite, wie jedes andere Element.

## Eine Text-View in die andere Richtung

Eine Text-View übernimmt die Richtung des Elements um sie herum. Um Python auf
einer Seite von rechts nach links von links nach rechts zu zeigen, setz `dir`
auf ihren Container:

```html
<div id="codespace" dir="ltr"></div>
```

Auf einer Seite von links nach rechts braucht nur die View `dir="rtl"`, die von
rechts nach links laufen soll.

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
