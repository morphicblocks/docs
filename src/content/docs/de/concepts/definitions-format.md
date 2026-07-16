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
    "python": {
      "type": "code",
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      }
    },
    "javascript": {
      "type": "code",
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      }
    }
  },
  "modes": [
    { "name": "iconic",     "elements": ["icon", "title", "description"] },
    { "name": "conceptual", "elements": ["title", "concept"] },
    { "name": "python",     "elements": ["title", "python"] },
    { "name": "javascript", "elements": ["title", "javascript"] }
  ],
  "presets": [
    { "name": "iconic", "label": "Iconic", "toolbox": "iconic", "workspace": "conceptual" },
    { "name": "hybrid", "label": "Hybrid", "toolbox": "conceptual",
      "workspace": "conceptual", "codespace": "python", "preview": "javascript" }
  ],
  "categories": [
    { "name": "Output", "color": "#5C81A6" }
  ],
  "highlighting": {
    "python":     { "keywords": ["print", "if", "for", "in"], "strings": ["\"", "'"], "comment": "#" },
    "javascript": { "keywords": ["console", "if", "for", "let"], "strings": ["\"", "'"], "comment": "//" }
  },
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

## `elementTypes`

Globale Registry, die Element-Namen ihrem Typ zuordnet. Ein Wert ist entweder
ein einfacher Typ-String — `"text" | "code" | "image"` — oder ein
Konfigurationsobjekt:

| Feld | Gilt für | Zweck |
| --- | --- | --- |
| `type` | alle | `"text"`, `"code"` oder `"image"` |
| `empty` | `code` | Vorgaben für leere Value-Slots (siehe [unten](#shadows-placeholder-und-leere-slots)) |
| `stringQuote` | `code` | Begrenzer um framework-gelieferte Literale in `String`-geprüften Slots, sodass der Codespace `print("hello")` statt `print(hello)` rendert. Weglassen deaktiviert das Quoting. |
| `size` | `image` | Anzeigegröße, wenn der Wert ein Dateipfad ist, der automatisch als `<img>` verpackt wird: eine Zahl (`32` → 32×32), `"32"` oder `"32x32"`. Standard 16×16. |

Siehe [Blocks & Elements](/de/concepts/blocks-and-elements/#element-typen) für
die Bedeutung der einzelnen Typen.

## Shadows, Placeholder und leere Slots

Was soll ein Value-Slot zeigen, wenn nichts angehängt ist? Eine
**Empty-Default-Konfiguration** beantwortet das und tritt an zwei Stellen mit
derselben Form auf:

- `elementTypes.<name>.empty` — pro Element (pro „Sprache"), geschlüsselt nach
  dem `check` des Slots (`"Number"`, `"String"`, `"Boolean"`, …)
- `inputSlots.<n>.default` — pro Block-Slot; **höchste Priorität**, schlägt die
  Suche auf elementType-Ebene

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

Mit gesetzten Vorgaben rendert ein `print`-Block, an dem nichts hängt, als
`print("hello")` statt `print()` — der erzeugte Text bleibt syntaktisch
gültig. Ist **keine** Vorgabe konfiguriert, rendert der Codespace eine
editierbare Markierung (`___`) und der Workspace zeigt einen leeren Socket.

## `modes`

Die Liste der Mode-Definitionen (`{ name, elements }`) — ausführlich behandelt
in [Modes](/de/concepts/modes/).

## `presets`

Benannte Mode-Zuordnungen pro View — behandelt in
[Presets & Views](/de/concepts/presets-and-views/).

## `categories`

Optionale Toolbox-Gruppierungen. Blöcke referenzieren sie per Name:

```json
"categories": [{ "name": "Output", "color": "#5C81A6" }]
```

## `highlighting`

Optionales Syntax-Highlighting für Codespace und Preview, **geschlüsselt nach
Element-Namen** (das Quell-Element eines Mode benennt die „Sprache" bereits):

| Feld | Bedeutung |
| --- | --- |
| `keywords` | Als Keywords hervorgehobene Wörter (exakte Token-Übereinstimmung) |
| `strings` | String-Begrenzer, z. B. `["\"", "'"]` |
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
| `elements` | Die `name: content`-Map der visuellen Bestandteile |
| `inputSlots` | Konfiguration der `%N`-Slots (unten) |
| `output` | Output-Typ eines Value-Blocks (z. B. `"Number"`) |
| `previousStatement` / `nextStatement` | Statement-Verbindungen |
| `color` | Block-Farbe (kann auch aus CSS kommen) |
| `tooltip`, `helpUrl`, `inputsInline` | An Blockly durchgereicht |

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
| `default` | Shadow-/Placeholder-Konfiguration pro Slot — höchste Priorität, schlägt die `empty`-Suche auf `elementTypes`-Ebene (siehe [Shadows, Placeholder und leere Slots](#shadows-placeholder-und-leere-slots)) |

## Template-Syntax

Der Inhalt eines `code`-Elements ist ein Template:

| Syntax | Ergebnis |
| --- | --- |
| `%1`, `%2` | Input-Slot — ein Blockly-Input *und* eine Einsetzstelle in Text-Views |
| `%FIELDNAME` | Feldwert (Großbuchstaben-Token, z. B. `%NUM`) — in Text-Views eingesetzt |
| `<img …>` | Bild (Blockly `FieldImage` auf Workspace-Blöcken) |
| Klartext | Wird zu einem Blockly-Label-Feld |

**Whitespace bleibt wie geschrieben erhalten** in Textdarstellungen, und die
Einrückung summiert sich über die Verschachtelung:

```json
"python": "if %1:\n  %2"
```

rendert mehrzeilig mit eingerücktem Rumpf — verschachtelte Blöcke rücken
automatisch weiter ein.
