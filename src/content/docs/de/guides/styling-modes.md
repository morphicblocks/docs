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
<div class="morphic-block morphic-mode-icon-tiles morphic-block-text_print"
     style="--morphic-block-color: #5C81A6">
  <div class="morphic-element-icon">…</div>
  <div class="morphic-element-title">Print</div>
  <div class="morphic-element-python">print(<span class="morphic-slot"></span>)</div>
</div>
```

Ein Mode-Stylesheet entscheidet vor allem, **welche Elements sichtbar sind und
wie sie angeordnet werden**:

```css
/* icon-tiles.css — Icon + Titel zeigen, alles andere verbergen */
.morphic-mode-icon-tiles .morphic-element-icon { display: block; }
.morphic-mode-icon-tiles .morphic-element-title { display: block; font-weight: 600; }
```

Views zeigen ein Element, keinen Mode, daher tragen Workspace-Views und ihre
Blöcke statt der Mode-Klasse `morphic-shows-<element>` (siehe
[Presets & Views](/de/concepts/presets-and-views/#klassen-für-dein-css)):

```css
/* python.css: Monospace-Text auf Workspace-Blöcken, die python zeigen */
.morphic-workspace-root.morphic-shows-python .blocklyText {
  font-family: "Fira Code", monospace;
}
```

Mode-Stylesheets werden für jeden Mode geladen, also können Regeln für Views
in jedem davon stehen, oder in deinem eigenen CSS.

Blöcke werden passend zur Schrift bemessen, die dein CSS ihrem Text gibt.
Schriftart, Größe und Stärke von `.blocklyText` werden bei jedem Wechsel
übernommen, und erneut, sobald ein Stylesheet oder eine Webfont fertig geladen
ist. So ragt Text nie aus seinem Block heraus. Das gilt auch für Blöcke auf
Toolbox-Kacheln, die die Schrift ihres Elements übernehmen. Andere
Eigenschaften, etwa Farben, ändern nichts an der Größe.

Ändert deine App die Blockschrift selbst, etwa mit einem Schalter für die
Schriftgröße, rufe danach `engine.refresh()` auf, damit Blöcke und Kacheln neu
bemessen werden.

Codespaces tragen `morphic-codespace-root` und das Element, das sie zeigen,
schreibgeschützte zusätzlich `morphic-read-only`:

```css
.morphic-codespace-root.morphic-shows-python { font-size: 15px; }
.morphic-codespace-root.morphic-read-only { opacity: 0.9; }
```

Block-Farben lassen sich über die Custom Property aus CSS steuern:

```css
.morphic-block-text_print {
  --morphic-block-color: #b469d6;
}
```

Blockly zeichnet eine dünne graue Linie um den Workspace. Das Framework lässt
sie weg; zwei Custom Properties holen sie zurück oder gestalten sie, am
Workspace oder pro Mode:

```css
.morphic-workspace-root {
  --morphic-workspace-border-color: #c6c6c6;
  --morphic-workspace-border-width: 1px;
}
```

## Mode-Stylesheets laden

Drei Wege, in der Mount-Konfiguration:

```ts
engine.mount({
  // 1. Ein ganzer Ordner, per Dateiname (Vite): modes/icon-tiles.css → Mode "icon-tiles".
  //    Links (?url) oder CSS-Text (?raw) funktionieren beide.
  modesFolder: import.meta.glob("./modes/*.css", { eager: true, query: "?url" }),

  // 2. Mode für Mode, aus jedem Bundler oder ohne: CSS-Text oder ein Link pro Mode
  modeStyles: {
    "icon-tiles": "/styles/icon-tiles.css",
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
