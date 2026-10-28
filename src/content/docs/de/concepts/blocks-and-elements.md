---
title: Blocks & Elements
description: Der Morphic Block und seine benannten Elements.
---

Die grundlegende Einheit des Frameworks ist der **Morphic Block**. Er
repräsentiert ein Programmkonstrukt (eine Print-Anweisung, eine Schleife, eine
Bedingung, …) und trägt eine Menge benannter **Elements** — die visuellen
Bestandteile, die er zeigen *kann*. Welche er tatsächlich zeigt, entscheiden
später die [Modes](/de/concepts/modes/).

## Elements

Elements werden pro Block als schlichte `name: content`-Map deklariert:

```json
{
  "identifier": "text_print",
  "elements": {
    "title":      "Print",
    "description":"Prints a value to the console",
    "concept":    "Output %1",
    "python":     "print(%1)",
    "javascript": "console.log(%1);"
  }
}
```

Element-**Namen sind frei wählbar** — `title`, `icon`, `concept`, `python`,
`javascript` sind Konventionen, keine Schlüsselwörter. Du erfindest das
Vokabular, das zu deinem Anwendungsfall passt (natürliche Sprachen,
Programmiersprachen, Ausführlichkeitsstufen, …).

## Element-Typen

Was ein Element-Name *bedeutet*, wird einmal global in der
`elementTypes`-Registry deklariert — nicht pro Block wiederholt:

```json
{
  "elementTypes": {
    "icon":       "image",
    "title":      "text",
    "description":"text",
    "concept":    "code",
    "python":     "code"
  }
}
```

Der Typ steuert das Rendering-Verhalten:

| Typ     | Toolbox-Kachel                         | Workspace-Block                                                        |
| ------- | -------------------------------------- | --------------------------------------------------------------------- |
| `text`  | Als HTML-Label gerendert               | Nie gezeigt                                                            |
| `code`  | Als Blockly-SVG oder Quelltext gerendert | Als Blockly-Template verwendet (`<img>` im Inhalt wird zu FieldImage) |
| `image` | Als `<img>` gerendert                  | Nie gezeigt                                                            |
| `custom` | Von einer [Funktion der App](#eigene-elemente) gezeichnet | Nie gezeigt                                     |

`code`-Elements nutzen die [Template-Syntax](/de/concepts/definitions-format/#template-syntax)
(`%1`-Input-Slots, `%FIELDNAME`-Felder, `<img>`-Tags) und dienen zugleich als
Textdarstellung für die Codespaces.

## Eigene Elemente

Ein `custom`-Element zeichnet eine Funktion der App auf die Kacheln, sodass
eine Kachel alles enthalten kann, was die drei anderen Typen nicht abdecken:
einen Info-Button, einen Ton zum Abspielen, einen Vorlese-Button, ein Video.
Die Funktion bekommt den Inhalt des Blocks für das Element, sodass jeder Block
seinen eigenen hat:

```json
{
  "elementTypes": { "title": "text", "concept": "code", "info": "custom" },
  "modes": [
    { "name": "novice-tiles", "elements": ["title", "concept", "info"] },
    { "name": "expert-tiles", "elements": ["concept"] }
  ],
  "blocks": [
    { "identifier": "print", "elements": {
      "title": "Ausgabe", "concept": "print %1", "info": "Schreibt eine Nachricht in die Ausgabe" } }
  ]
}
```

```ts
engine.mount({
  workspaceContainer,
  toolboxContainer,
  toolbox: {
    custom: {
      info: (content, { block, element, mode }) => {
        const button = document.createElement("button");
        button.textContent = "ⓘ";
        button.setAttribute("aria-label", content);
        button.onclick = () => showHelp(content);
        return button;
      },
    },
  },
});
```

Die Funktion gibt einen DOM-Knoten zurück oder einen String, der als Text
erscheint. Sie läuft bei jedem Neuzeichnen der Toolbox erneut, etwa wenn der
Toolbox-Modus wechselt. Wie bei jedem Element entscheiden die Modes, wo es
erscheint: hier haben die Novice-Kacheln den Button, die Expert-Kacheln nicht.

Ein Druck auf einen Button, Link oder ein Eingabefeld in einem eigenen Element
gilt diesem Steuerelement: Er zieht die Kachel nicht, und Enter oder Leertaste
dort fügen den Block nicht hinzu. Ein eigenes Element zählt nicht zum Namen
der Kachel für Screenreader, da seine Steuerelemente eigene Namen tragen. Ohne
Funktion in `toolbox.custom` zeigt die Kachel den Inhalt als Text, und `mount()` warnt.

## Die gerenderte Kachel

In der HTML-Toolbox werden **alle Elements immer gerendert**; das CSS des
aktiven Mode steuert, welche sichtbar sind:

```html
<div class="morphic-block morphic-mode-icon-tiles morphic-block-text_print"
     style="--morphic-block-color: #5C81A6">
  <div class="morphic-element-icon"><img src="assets/log.svg"></div>
  <div class="morphic-element-concept">Output <span class="morphic-slot"></span></div>
  <div class="morphic-element-python">print(...)</div>
  <div class="morphic-element-title">Print</div>
</div>
```

Genau das zielt dein Mode-CSS an — siehe
[Modes mit CSS gestalten](/de/guides/styling-modes/).

## Block-Identifier

Block-`identifier` sind ebenfalls frei wählbar — **auch Namen, die mit Blocklys
eingebauten kollidieren** wie `math_number` oder `logic_boolean`. Intern
registriert das Framework jeden Block als `morphic:<identifier>`, sodass deine
Namen die Stock-Blöcke nie überschreiben können (die das Framework weiterhin
für Shadows, Placeholder und Verbindungsprüfungen nutzt).

Du arbeitest immer mit dem sauberen Identifier: Er ist der Schlüssel der
Behaviors-Map, der Shadow- und Placeholder-Referenzen und der
Toolbox-Block-Listen. Eine Referenz wird zu *deinem* Block aufgelöst, wenn sie
zu einer deiner Definitionen passt, andernfalls zum Blockly-Stock-Typ —
`"shadow": "math_number"` behält Blocklys Zahlenblock, während
`"shadow": "my_number"` deinen verwendet, sofern du ihn definiert hast.

Ein Blockly-Block im Workspace trägt in `block.type` weiterhin den Typ mit
Präfix. Um seine Definition nachzuschlagen, wandelst du ihn mit `toCleanId`
zurück in den sauberen Identifier:

```ts
import { toCleanId } from "morphic-blocks";

const id = toCleanId(block.type); // "morphic:text_print" → "text_print"
```

Typen ohne Präfix, etwa Blocklys `math_number`, kommen unverändert zurück.
