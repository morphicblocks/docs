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

`code`-Elements nutzen die [Template-Syntax](/de/concepts/definitions-format/#template-syntax)
(`%1`-Input-Slots, `%FIELDNAME`-Felder, `<img>`-Tags) und dienen zugleich als
Textdarstellung für Codespace und Preview.

## Die gerenderte Kachel

In der HTML-Toolbox werden **alle Elements immer gerendert**; das CSS des
aktiven Mode steuert, welche sichtbar sind:

```html
<div class="morphic-block morphic-mode-iconic morphic-block-text_print"
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
