---
title: Das Definitions-Format
description: Die Definitions-JSON, Feld für Feld.
---

Alles, was ein Block *ist*, lebt in einem JSON-Dokument. Ein vollständiges,
kleines Beispiel:

```json
{
  "elementTypes": {
    "icon":       "image",
    "title":      "text",
    "description":"text",
    "concept":    "code",
    "python":     "code",
    "javascript": "code"
  },
  "code": {
    "python": {
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      },
      "highlighting": { "keywords": ["print", "if", "for", "in"], "strings": ["\"", "'"], "comment": "#" }
    },
    "javascript": {
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      },
      "highlighting": { "keywords": ["console", "if", "for", "let"], "strings": ["\"", "'"], "comment": "//" }
    }
  },
  "modes": [
    { "name": "iconic",      "elements": ["icon", "title", "description"] },
    { "name": "conceptual",  "elements": ["title", "concept"] },
    { "name": "python-text", "elements": ["title", "python"], "render": { "python": "text-based" } }
  ],
  "views": {
    "blocks": "workspace",
    "code": "codespace",
    "read": { "kind": "codespace", "editable": false }
  },
  "presets": [
    { "name": "iconic", "label": "Iconic", "toolbox": "iconic", "views": { "blocks": "concept" } },
    { "name": "hybrid", "label": "Hybrid", "toolbox": "conceptual",
      "views": { "blocks": "concept", "code": "python", "read": "javascript" } }
  ],
  "categories": [
    { "name": "Output", "color": "#5C81A6" }
  ],
  "blocks": [
    {
      "identifier": "text_print",
      "category": "Output",
      "elements": {
        "title":      "Print",
        "description":"Prints a value to the console",
        "concept":    "Output %1",
        "python":     "print(%1)",
        "javascript": "console.log(%1);"
      },
      "inputSlots": {
        "1": { "kind": "value", "name": "TEXT" }
      }
    }
  ]
}
```

## `$schema` und `version`

Verweise mit deiner Datei auf das mit dem Paket ausgelieferte JSON-Schema, und
Editoren (VS Code, …) geben **Autovervollständigung und Inline-Validierung**
beim Tippen — das Gegenstück zur Laufzeit-[Validierung](#validierung) beim
Mounten:

```json
{
  "$schema": "./node_modules/morphic-blocks/definitions.schema.json",
  "version": 1,
  "blocks": [ /* … */ ]
}
```

`$schema` kann ein relativer Pfad (zu `morphic-blocks/definitions.schema.json`)
oder eine URL sein. `version` markiert die Format-Revision (aktuell `1`). Beide
sind optional und werden vom Framework zur Laufzeit ignoriert.

## `elementTypes`

Globale Registry, die Element-Namen ihrem Typ zuordnet. Ein Wert ist entweder
ein einfacher Typ-String — `"text" | "code" | "image"` — oder, für ein
Bild-Element mit Größe, ein Konfigurationsobjekt:

| Feld | Gilt für | Zweck |
| --- | --- | --- |
| `type` | alle | `"text"`, `"code"` oder `"image"` |
| `size` | `image` | Anzeigegröße, wenn der Wert ein Dateipfad ist, der automatisch als `<img>` verpackt wird: eine Zahl (`32` → 32×32), `"32"` oder `"32x32"`. Standard 16×16. |

Siehe [Blocks & Elements](/de/concepts/blocks-and-elements/#element-typen) für
die Bedeutung der einzelnen Typen.

## `code`

Wie die Sprache jedes Code-Elements geschrieben wird, **geschlüsselt nach
Element-Namen** (das Quell-Element eines Mode benennt die „Sprache" bereits).
Jedes Feld ist optional:

:::note[Die Sprachen sind deine eigenen]
Morphic Blocks kennt keine Programmiersprache. Ein „Python"- oder
„Java"-Element besteht nur aus Templates, die du schreibst, und den
Einstellungen unten; das Framework füllt die Slots und prüft das Ergebnis nie.
Ausgeführt wird, was deine [Behaviors](/de/concepts/behaviors-and-codegen/)
zurückgeben, meist JavaScript. Eine Sprache kann also echt, vereinfacht,
erfunden oder Alltagssprache sein.
:::

| Feld | Zweck |
| --- | --- |
| `stringQuote` | Begrenzer um framework-gelieferte Literale in `String`-geprüften Slots, sodass der Codespace `print("hello")` statt `print(hello)` rendert. Weglassen deaktiviert das Quoting. |
| `empty` | Vorgaben für leere Value-Slots (siehe [unten](#shadows-placeholder-und-leere-slots)) |
| `emptyStatement` | Wird in einen leeren Statement-Slot geschrieben, wo die Sprache eine Anweisung braucht, z. B. `"pass"` für Python, damit ein leerer Schleifenrumpf gültiger Code bleibt. Weglassen lässt leere Rümpfe leer. |
| `types` | Namen, die `%1:type` schreibt, geschlüsselt nach dem Typ des Werts (siehe [Typnamen](#typnamen)) |
| `highlighting` | Token-Farben für die Codespaces (siehe [unten](#highlighting)) |
| `values` | Wie ausgegebene Werte sich lesen, solange dieses Element gezeigt wird (`True`, `None`, `['a']`); siehe [Behaviors & Code-Erzeugung](/de/concepts/behaviors-and-codegen/#ausgegebene-werte-in-der-gezeigten-sprache) |

Bis 0.2 standen `stringQuote` und `empty` am Element in `elementTypes`, und
`highlighting` war eine eigene Map auf oberster Ebene. `mount()` meldet diese
Stellen mit der neuen.

## Shadows, Placeholder und leere Slots

Was soll ein Value-Slot zeigen, wenn nichts angehängt ist? Eine
**Empty-Default-Konfiguration** beantwortet das und tritt an zwei Stellen mit
derselben Form auf:

- `code.<name>.empty` — pro Element (pro „Sprache"), geschlüsselt nach
  dem `check` des Slots (`"Number"`, `"String"`, `"Boolean"`, …). Ein
  `default`-Schlüssel dient als Auffangwert — verwendet, wenn der `check` des
  Slots nicht gelistet ist oder der Slot gar keinen `check` hat.
- `inputSlots.<n>.default` — pro Block-Slot; **höchste Priorität**, schlägt die
  Suche am Element

Die Auflösungsreihenfolge ist `inputSlots.<n>.default` → `empty[<check>]` →
`empty.default`.

```json
"inputSlots": {
  "1": {
    "kind": "value", "name": "TEXT", "check": "String",
    "default": { "shadow": "text", "fieldValues": { "TEXT": "Hello, world!" } }
  }
}
```

| Feld | Zweck |
| --- | --- |
| `shadow` | Blockly-Block-Typ als **Shadow** — ausgegraut, unveränderlich, automatisch ersetzt, wenn ein echter Block andockt, und wiederhergestellt, wenn er abgekoppelt wird. Z. B. `"math_number"`, `"text"`, `"logic_boolean"`. |
| `placeholder` | Blockly-Block-Typ, der als **echter Block** beim Rendern angehängt wird — beweglich, editierbar, löschbar. Sind beide gesetzt, hat der Placeholder Vorrang auf dem sichtbaren Slot; Blocklys native Shadow-Wiederherstellung bringt den Shadow zurück, wenn der Nutzer den Placeholder entfernt. |
| `fieldValues` | Anfangswerte für die Felder des gewählten Blocks, z. B. `{ "NUM": "42" }` für `math_number` oder `{ "TEXT": "hello" }` für `text`. |

Die `shadow`- / `placeholder`-Werte werden zuerst gegen *deine*
Block-Identifier aufgelöst, dann gegen Blockly-Stock-Typen — siehe
[Block-Identifier](/de/concepts/blocks-and-elements/#block-identifier). Der
Output-Typ eines Shadow muss mit dem `check` des Slots kompatibel sein, sonst
lehnt Blockly ihn stillschweigend ab.

Eine **Shadow**-Vorgabe füllt den Slot in beiden Ansichten: der Workspace zeigt
den ausgegrauten Block und der Codespace seinen Wert, direkt editierbar (ein
`print` mit einem `String`-Shadow rendert also `print("hello")` — der Text
bleibt syntaktisch gültig). Ein **Placeholder** setzt einen *echten* Block ein,
der, einmal gelöscht, den Slot wirklich leer zurücklässt: Er wird beim ersten
Rendern des Slots angehängt und nie neu erzeugt — eine Löschung übersteht also
Modus-Wechsel und spätere Renderings.

Ist der Shadow einer deiner eigenen Blöcke, schreibt der Codespace ihn über das
Template dieses Blocks, sodass er genau wie der eingesetzte Block aussieht: Ein
Textblock mit dem Template `"%TEXT"` zeigt `"hello"`, und ein Block ohne Felder
(etwa ein `*` für alle Spalten) zeigt trotzdem seinen Text. Ein Blockly-Stock-Shadow
wie `text` hat kein Template, sein Wert wird also direkt geschrieben und von
`stringQuote` in Anführungszeichen gesetzt.

**Shadow-Werte werden einmalig angewendet.** Ein Shadow wird an einer Verbindung
nur deklariert, wenn dort noch keiner existiert — das *zuerst* gerenderte Element
liefert also den Wert. Demselben `check` je Element unterschiedliche `fieldValues`
zu geben — `python` `42`, `go` `100` — erzeugt deshalb keine sprachspezifischen
Vorgaben: Der zuerst gerenderte Modus gewinnt für alle. Halte die Werte über alle
Elemente gleich und überlasse die sprachspezifische Darstellung der `display`-Map
eines Dropdowns und `stringQuote`.

Für einen wirklich leeren Slot — gelöschter Placeholder oder gar keine Vorgabe —
zeigt der Workspace einen leeren Socket, und der Codespace (der „nichts“ nicht
rendern kann) zeigt eine eingeklammerte **Typmarkierung** aus dem `check` des
Slots: `[NUMBER]`, `[TEXT]`, `[BOOL]` oder `[VALUE]`, wenn der Slot kein `check`
hat. Zum Füllen einen Wert-Block in den Slot ziehen.

## `modes`

Die Liste der Mode-Definitionen (`{ name, elements, render? }`), was
Toolbox-Kacheln zeigen; ausführlich behandelt in [Modes](/de/concepts/modes/).

## `views`

Die Views nach Name, jeder eine Art (`workspace`, `codespace`) oder
`{ kind, editable?, rtl?, delete? }`; `mount()` richtet jeden ein, für den es
einen Container bekommt. Behandelt in
[Presets & Views](/de/concepts/presets-and-views/).

## `presets`

Was die Toolbox und jeder View zeigen (`{ name, label?, toolbox, views }`);
behandelt in [Presets & Views](/de/concepts/presets-and-views/).

## `categories`

Optionale Toolbox-Gruppierungen. Blöcke referenzieren sie per Name:

```json
"categories": [{ "name": "Output", "color": "#5C81A6" }]
```

## `highlighting`

Syntax-Highlighting für die Codespaces, pro Code-Element gesetzt als
`code.<name>.highlighting`:

| Feld | Bedeutung |
| --- | --- |
| `keywords` | Als Keywords hervorgehobene Wörter, als ganze Wörter in jeder Schrift |
| `strings` | String-Begrenzer, z. B. `["\"", "'"]`, oder `[open, close]`-Paare wie `["„", "“"]` |
| `comment` | Zeilenkommentar-Marker, z. B. `"#"` oder `"//"` |
| `numbers` | Zahlenliterale hervorheben (Standard `true`) |
| `colors` | Optionale Überschreibungen pro Token-Klasse (`keyword`, `string`, `number`, `comment`) |

Keine Grammatik-Dateien, keine Sprach-Plugins — siehe die
[Anleitung zum Syntax-Highlighting](/de/guides/syntax-highlighting/).

## `blocks`

Ein flaches Array von Block-Definitionen:

| Feld | Zweck |
| --- | --- |
| `identifier` | Frei wählbare Block-ID (siehe [Namespacing](/de/concepts/blocks-and-elements/#block-identifier)) |
| `category` | Optionaler Kategorie-Name |
| `elements` | Die `name: content`-Map der visuellen Bestandteile; optionales `default`-Template (unten) |
| `inputSlots` | Konfiguration der `%N`-Slots (unten) |
| `fields` | Inline-Feld-Widgets — Dropdown/Text/Number/Checkbox (unten) |
| `output` | Output-Typ eines Value-Blocks (z. B. `"Number"`) |
| `shape` | Wie ein Statement-Block verbunden wird, in einem Wort (unten) |
| `previousStatement` / `nextStatement` | Statement-Verbindungen |
| `color` | Block-Farbe (kann auch aus CSS kommen) |
| `tooltip`, `helpUrl`, `inputsInline` | An Blockly durchgereicht |

### Default-Template

Viele Templates sind in jeder Sprache gleich. Statt sie zu wiederholen, schreibst
du sie einmal unter den reservierten Schlüssel `default`:

```json
"elements": {
  "title": "Math",
  "default": "%1 %OP %2"
}
```

`default` gilt für jedes `code`-Element, das der Block nicht selbst auflistet.
Ein aufgelistetes Element hat immer Vorrang, du kannst also einzelne Sprachen
überschreiben:

```json
"elements": {
  "concept": "Variable %VAR",
  "default": "%VAR"
}
```

Hier zeigt `concept` den Text `Variable x`, während `python`, `javascript` und
jedes andere Code-Element `x` zeigen.

- Es ist optional. Jede Sprache auszuschreiben funktioniert genau wie bisher.
- Es füllt nur `code`-Elemente. Text- und Bild-Elemente wie `title` oder `icon`
  werden nie daraus befüllt.
- `default` ist reserviert und kann daher nicht der Name eines Elements in
  `elementTypes` sein.

### Block-Shape

`shape` sagt in einem Wort, wie ein Statement-Block oben und unten verbunden
wird:

| `shape` | Oben | Unten | Beispiel |
| --- | --- | --- | --- |
| `"statement"` | ja | ja | `print`, `if` |
| `"start"` | nein | ja | „wenn das Programm startet“ |
| `"end"` | ja | nein | `return`, `stop` |
| `"standalone"` | nein | nein | ein Block, der für sich allein steht |

```json
{ "identifier": "text_print", "shape": "statement", "...": "..." }
```

`shape` beschreibt das Verbinden, nicht das Aussehen. Wie ein Block aussieht,
bestimmen Modes und CSS.

- Es ist optional. Ohne `shape` entscheiden `previousStatement` und
  `nextStatement` genau wie bisher, und ein Block ohne beide steht für sich allein.
- Es füllt nur die Flags, die der Block nicht selbst setzt. Ein Flag, das du
  schreibst, hat also Vorrang. So fügst du einen Verbindungstyp hinzu:
  `"shape": "statement", "previousStatement": "Action"`.
- Value-Blöcke haben keinen Shape. Sie nutzen `output`: `true` für jeden Wert
  oder einen Typ wie `"Number"`.
- Ein Flag, das dem Shape widerspricht, etwa `"shape": "end"` mit
  `"nextStatement": true`, erzeugt eine Validierungswarnung.

### Input-Slots

`inputSlots` konfiguriert jeden `%N`-Platzhalter, geschlüsselt nach seiner
Nummer:

```json
"inputSlots": {
  "1": { "kind": "value", "name": "TEXT", "check": "String" }
}
```

| Feld | Zweck |
| --- | --- |
| `kind` | `"value"` (Ausdrucks-Input) oder `"statement"` (verschachtelter Rumpf) |
| `name` | Blockly-Input-Name — Behaviors lesen den angehängten Code darüber |
| `check` | Typprüfung (`"Number"`, `"String"`, …), schlüsselt auch die Empty-Defaults |
| `label` | Optionaler Label-Text |
| `align` | Ausrichtung des Inputs |
| `default` | Shadow-/Placeholder-Konfiguration pro Slot — höchste Priorität, schlägt die Suche in `code.<element>.empty` (siehe [Shadows, Placeholder und leere Slots](#shadows-placeholder-und-leere-slots)) |

#### Wann ein Slot `check` braucht

`check` entscheidet, welche Blöcke in einen Wert-Slot passen, im Workspace und
beim Ablegen im Codespace: Ein Block passt, wenn sein `output`-Typ
übereinstimmt. Außerdem wählt es den Empty-Default des Slots und seinen
`[TYP]`-Marker.

- **Setze es**, wenn das Programm eine bestimmte Art von Wert braucht: die
  Zahlen eines Rechenblocks, die Anzahl einer Wiederholung, die Bedingung
  eines `while`, das nur Vergleiche annehmen soll.
- **Lass es weg**, wenn jeder Wert geht: der Wert einer Ausgabe oder ein `if`
  in einer Sprache, in der jeder Wert als wahr oder falsch gilt (Python,
  JavaScript). Ein Slot ohne `check` nimmt jeden Block mit Output an.

```json
"inputSlots": {
  "1": { "kind": "value", "name": "CONDITION" },
  "2": { "kind": "statement", "name": "THEN" }
}
```

Dieses `if` nimmt einen Vergleich, eine Zahl oder eine Variable. Mit
`"check": "Boolean"` an Slot 1 passte keine Zahl mehr, nur noch
Boolean-Blöcke (true, false, Vergleiche). Ein Block mit `"output": true` hat
keinen Typ und passt in jeden Slot, mit oder ohne `check`.

### Felder

Während `inputSlots` die `%N`-**Steckplätze** konfiguriert, in die andere Blöcke
eingesteckt werden, deklariert `fields` die Inline-**Widgets**, die auf dem
Block selbst sitzen — Dropdowns, Textfelder, Zahlenfelder, Checkboxen —
geschlüsselt nach ihrem `%FIELDNAME`-Token:

```json
"elements": { "python": "%1 %OP %2" },
"fields": {
  "OP": {
    "type": "dropdown",
    "options": ["+", ["-", "−"], ["*", "×"], ["/", "÷"]],
    "default": "+"
  }
}
```

| Typ        | Zusätzliche Konfiguration                        |
| ---------- | ------------------------------------------------ |
| `dropdown` | `options` (unten), `default` (ausgewählter Wert) |
| `text`     | `default`                                        |
| `number`   | `default`, `min`, `max`, `precision`             |
| `checkbox` | `default` (boolean)                              |

Eine Dropdown-**Option** ist eine der Formen:

| Form                             | Bedeutung                                    |
| -------------------------------- | -------------------------------------------- |
| `"=="`                           | Wert = Label = `"=="`                        |
| `["-", "−"]`                     | `[Wert, Label]` — Wert `-`, angezeigt als `−` |
| `{ "value": "-", "label": "−" }` | Objekt-Form                                  |

Der **Wert** ist die Quelle der Wahrheit: Er ist das, was der Block *generiert*,
serialisiert und ausführt. Das optionale **Label** ist nur eine
Anzeige-Überschreibung auf dem Workspace-Block, sodass eine Option `÷` zeigen
kann, während Text-Views und generierter Code `/` verwenden. Es gibt keinen
separaten Serialisierungs-Schlüssel — Blockly speichert den Wert.

#### Bilder als Auswahl

Ein `label` kann auch ein Bild sein. Der Block zeigt es statt Text; die
Text-Views und der generierte Code verwenden weiterhin den Wert.

```json
"fields": {
  "DIR": {
    "type": "dropdown",
    "options": [
      { "value": "left",  "label": { "src": "icons/arrow_left.svg" } },
      { "value": "right", "label": { "src": "icons/arrow_right.svg", "alt": "nach rechts" } }
    ]
  },
  "COLOR": {
    "type": "dropdown",
    "options": [
      { "value": "red",  "label": { "color": "#e53935" } },
      { "value": "blue", "label": { "color": "#1e88e5" } }
    ]
  }
}
```

| Schlüssel | Bedeutung                                                       |
| --------- | --------------------------------------------------------------- |
| `src`     | Eine Bilddatei (SVG, PNG, …), wie bei `image`-Elementen          |
| `color`   | Eine CSS-Farbe; das Framework zeichnet ein Farbfeld, ohne Datei  |
| `alt`     | Was Screenreader vorlesen. Standard: der Wert                   |
| `width`, `height` | Größe in Pixeln. Standard: 16 × 16                      |

Ein Bild braucht `src` oder `color`. Bilder passen zu Auswahlen, die man
leichter sieht als liest: Farben, Richtungen, Tiere, Figuren, Noten.

Der Wert bleibt ein Wort deiner Wahl (`red`, `ink`), sodass die Text-Views
ihn schreiben und `display` funktioniert. Um eine beliebige Farbe als Hex-Code
zu wählen, nutze Blocklys Plugin
[`@blockly/field-colour`](https://www.npmjs.com/package/@blockly/field-colour)
im `onViewApplied` eines Behaviors.

#### Das Menü gestalten

Das Menü eines geöffneten Dropdowns bekommt zwei Klassen: `morphic-menu` und
`morphic-menu-<FIELD>` mit dem Namen des Felds. Das Aussehen bestimmst du:
Bilder in einer Reihe oder einem Raster, keine Häkchen, größere Auswahlen für
Touch oder eine größere Schrift für ein Operator-Menü. Zum Beispiel ein Menü
für Stiftfarben mit den Farbfeldern in einer Reihe und einem Rahmen um das
gewählte:

```css
.morphic-menu-COLOR { display: flex; gap: 4px; padding: 4px; }
.morphic-menu-COLOR .blocklyMenuItem { min-width: 0; padding: 4px; }
.morphic-menu-COLOR .blocklyMenuItemCheckbox { display: none; }
.morphic-menu-COLOR img { display: block; width: 24px; height: 24px; border-radius: 6px;
  outline: 3px solid transparent; outline-offset: 1px; }
.morphic-menu-COLOR .blocklyMenuItemSelected img { outline-color: #55bdcb; }
```

Das Feld auf dem Block behält Blocklys Aussehen. Eine App, die es in der
gewählten Farbe füllen will, wie die App Turtle Drawing im
[Playground](https://playground.morphicblocks.com), baut ihr eigenes Feld im
`onViewApplied` eines Behaviors.


#### Options-Text pro Modus

`display` lässt den *angezeigten* Text einer Option dem aktiven Modus folgen,
während der Wert einzeln bleibt — dieselbe Modus-Bewusstheit, die das
Element-System dem Inhalt gibt, jetzt für Felder. Es bildet einen
**Element-Namen** (geschlüsselt wie der [`code`](#code)-Abschnitt) auf den
Text ab, der beim Rendern dieses Elements gezeigt wird — Python-Quelltext zeigt
also `True`, JavaScript `true`, wobei beide `true` speichern und ausführen:

```json
"fields": {
  "BOOL": {
    "type": "dropdown",
    "options": [
      { "value": "true",  "display": { "python": "True" } },
      { "value": "false", "display": { "python": "False" } }
    ],
    "default": "true"
  }
}
```

Auflösung beim Rendern von Element `E`: der Workspace-Block zeigt
`display[E] ?? label ?? value`; die Codespaces zeigen
`display[E] ?? value` (`label` bleibt block-only). Ausführung, Codegen und
Serialisierung nutzen immer den **Wert**. Das betrifft nur die
*Repräsentations*-Achse (Python- vs. JavaScript-Schreibweise) — die Übersetzung
natürlicher Sprache ist ein separates Thema. Nur `dropdown`-Felder nehmen
`display`; `text`/`number` halten Nutzerdaten oder sprachneutrale Werte.

Felder außerhalb dieser vier Typen (Variablen, Farbe, Plugin/Custom) werden von
einem
[`onViewApplied`](/de/concepts/behaviors-and-codegen/#das-vollständige-behavior-objekt)
einer Behavior angehängt — ein nicht deklariertes `%FIELDNAME`-Token bleibt der
Behavior überlassen.

## Template-Syntax

Der Inhalt eines `code`-Elements ist ein Template:

| Syntax | Ergebnis |
| --- | --- |
| `%1`, `%2` | Input-Slot — ein Blockly-Input *und* eine Einsetzstelle in Text-Views |
| `%FIELDNAME` | Inline-Feld deklariert in [`fields`](#felder) (Großbuchstaben-Token, z. B. `%NUM`) — auf dem Block gerendert, in Text-Views eingesetzt |
| `%1:type` | Der Name des Typs des Werts in Slot 1 (siehe [Typnamen](#typnamen)) |
| `<img …>` | Bild (Blockly `FieldImage` auf Workspace-Blöcken) |
| Klartext | Wird zu einem Blockly-Label-Feld |

**Whitespace bleibt wie geschrieben erhalten** in Textdarstellungen, und die
Einrückung summiert sich über die Verschachtelung:

```json
"python": "if %1:\n  %2"
```

rendert mehrzeilig mit eingerücktem Rumpf — verschachtelte Blöcke rücken
automatisch weiter ein.

### Typnamen

`%1:type` schreibt den Typ des Werts in Slot 1. So braucht eine typisierte
Sprache kein Typ-Dropdown, und der Typ passt immer zum Wert. Der Typ des Werts
ist der `output`-Check seines Blocks, oder der `check` des Slots, solange er
leer ist. Jede Sprache benennt die Typen in ihren [`code`](#code)-Einstellungen;
`default` gilt, wenn kein Schlüssel passt, und ohne ihn wird nichts geschrieben:

```json
"code": {
  "java": { "types": { "Number": "int", "String": "String", "Boolean": "boolean", "default": "var" } }
},
"blocks": [{
  "identifier": "declare",
  "elements": { "java": "%1:type %NAME = %1;", "js": "let %NAME = %1;" },
  "inputSlots": { "1": { "kind": "value", "name": "VALUE" } }
}]
```

Mit `"hey"` im Slot liest Java `String s = "hey";`, mit `5` `int s = 5;`. Eine
Sprache ohne Typen lässt das Token weg, wie hier `js`. In Blöcken ist der Name
ein Label, das sich mit dem Wert ändert. `%2:type` ist der Typ von Slot 2.

Nimm den Typ eines Blocks aus einer Quelle: `%1:type` in jeder Sprache, die
einen Typ schreibt, oder ein eigenes Feld (z. B. `int x;` ohne Wert), nicht
beides. Ein Feld in einer Sprache und `%1:type` in einer anderen können sich
widersprechen.

## Validierung

Das Framework prüft deine Definitionen beim `mount()`, damit Probleme, die sonst
still beim Rendern fehlschlagen würden, als klare Meldungen mit Nennung des
Blocks auftauchen. Es **wirft** bei struktureller Beschädigung, die falsche
Ausgabe garantiert, und **warnt** bei bloß beeinträchtigter oder toter Konfiguration.

Jede Prüfung, mit einer Beispielmeldung und wie du sie behebst, steht unter
[Fehler & Warnungen](/de/guides/errors-and-warnings/).

Um eine Datei *vor* dem Mounten zu prüfen — in einem Test oder Build-Schritt —
rufe das exportierte `validateDefinitions(...)` auf, das `{ errors, warnings }`
zurückgibt, statt zu werfen.

Warnungen gehen in die Browser-Konsole. Übergib `onWarning` an `mount()`, um
sie selbst zu erhalten, zusammen mit den übrigen Warnungen des Frameworks
(Modes ohne CSS, fehlende Blockly-Medien), etwa um sie nur während der
Entwicklung zu zeigen:

```ts
engine.mount({
  workspaceContainer,
  onWarning(message) {
    if (import.meta.env.DEV) showDevBanner(message);
  },
});
```
