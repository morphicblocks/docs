---
title: Modes mit CSS gestalten
description: Ein Stylesheet pro Mode über .morphic-mode-*-Klassen.
---

Modes haben kein eingebautes Aussehen — **du** definierst, wie jeder Mode
rendert, eine CSS-Datei pro Mode. Das ist der Styling-Vertrag des Frameworks.

## Der Klassen-Vertrag

Jede gerenderte Kachel trägt den aktiven Mode, den Block-Identifier und eine
Klasse pro Element:

```html
<div class="morphic-block morphic-mode-iconic morphic-block-text_print"
     style="--morphic-block-color: #5C81A6">
  <div class="morphic-element-icon">…</div>
  <div class="morphic-element-title">Print</div>
  <div class="morphic-element-python">print(<span class="morphic-slot"></span>)</div>
</div>
```

Ein Mode-Stylesheet entscheidet vor allem, **welche Elements sichtbar sind und
wie sie angeordnet werden**:

```css
/* iconic.css — Icon + Titel zeigen, alles andere verbergen */
.morphic-mode-iconic .morphic-element-icon { display: block; }
.morphic-mode-iconic .morphic-element-title { display: block; font-weight: 600; }
```

Die Blockly-Workspace-Wurzel erhält die Mode-Klasse ebenfalls:

```css
/* python.css — Monospace-Text auf Workspace-Blöcken im python-Mode */
.morphic-workspace-root.morphic-mode-python .blocklyText {
  font-family: "Fira Code", monospace;
}
```

Block-Farben lassen sich über die Custom Property aus CSS steuern:

```css
.morphic-block-text_print {
  --morphic-block-color: #b469d6;
}
```

## Mode-Stylesheets laden

Drei Wege, in der Mount-Konfiguration:

```ts
engine.mount({
  // 1. Ein ganzer Ordner, per Dateiname (Vite): modes/iconic.css → Mode "iconic".
  //    Links (?url) oder CSS-Text (?raw) funktionieren beide.
  modesFolder: import.meta.glob("./modes/*.css", { eager: true, query: "?url" }),

  // 2. Mode für Mode, aus jedem Bundler oder ohne: CSS-Text oder ein Link pro Mode
  modeStyles: {
    iconic: "/styles/iconic.css",
    python: ".morphic-mode-python { … }",
  },

  // 3. Ein Basis-Stylesheet, das unabhängig vom Mode gilt
  baseStyle: { href: "/styles/morphic-base.css" },
});
```

Jeder Wert in `modesFolder` und `modeStyles` ist entweder ein Link oder das CSS
selbst. Das Framework unterscheidet das selbst: CSS enthält immer eine `{`, ein
Link nie. Nutze also, was dein Bundler liefert, ob Text-Import, URL-Import oder
eine Datei in `public/`. `modesFolder` hat für dieselben Mode-Namen Vorrang vor
`modeStyles`.

## Prüfung der Mode-Abdeckung

Beim Mount prüft das Framework, ob jeder deklarierte Mode ein Stylesheet hat,
und warnt bei Lücken — ein Mode ohne CSS rendert alle Elements unstilisiert, was
fast nie gewollt ist. Fehlende Abdeckung zeigt sich früh statt als visuelle
Überraschung später.

## Verwandt

- [Blocks & Elements](/de/concepts/blocks-and-elements/#die-gerenderte-kachel) — das vollständige gestaltete Markup
- [Eigene Toolbox](/de/guides/custom-toolbox/) — wo Kacheln erscheinen
