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
  dem `check` des Slots (`"Number"`, `"String"`, `"Boolean"`, …). Ein
  `default`-Schlüssel dient als Auffangwert — verwendet, wenn der `check` des
  Slots nicht gelistet ist oder der Slot gar keinen `check` hat.
- `inputSlots.<n>.default` — pro Block-Slot; **höchste Priorität**, schlägt die
  Suche auf elementType-Ebene

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
| `elements` | Die `name: content`-Map der visuellen Bestandteile; optionales `default`-Template (unten) |
| `inputSlots` | Konfiguration der `%N`-Slots (unten) |
| `fields` | Inline-Feld-Widgets — Dropdown/Text/Number/Checkbox (unten) |
| `output` | Output-Typ eines Value-Blocks (z. B. `"Number"`) |
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

#### Options-Text pro Modus

`display` lässt den *angezeigten* Text einer Option dem aktiven Modus folgen,
während der Wert einzeln bleibt — dieselbe Modus-Bewusstheit, die das
Element-System dem Inhalt gibt, jetzt für Felder. Es bildet einen
**Element-Namen** (geschlüsselt wie [`highlighting`](#highlighting)) auf den
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
`display[E] ?? label ?? value`; Codespace und Preview zeigen
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
| `<img …>` | Bild (Blockly `FieldImage` auf Workspace-Blöcken) |
| Klartext | Wird zu einem Blockly-Label-Feld |

**Whitespace bleibt wie geschrieben erhalten** in Textdarstellungen, und die
Einrückung summiert sich über die Verschachtelung:

```json
"python": "if %1:\n  %2"
```

rendert mehrzeilig mit eingerücktem Rumpf — verschachtelte Blöcke rücken
automatisch weiter ein.

## Validierung

Das Framework prüft deine Definitionen beim `mount()`, damit Probleme, die sonst
still beim Rendern fehlschlagen würden, als klare Meldungen mit Nennung des
Blocks auftauchen. Es **wirft** bei struktureller Beschädigung, die falsche
Ausgabe garantiert, und **warnt** bei bloß beeinträchtigter oder toter Konfiguration.

Wirft (alle Probleme werden gesammelt und auf einmal gemeldet):

- ein Block, dessen `code`-Elemente sich über ihre `%N`-Menge uneinig sind — ein
  Input, und jeder daran gesteckte Block, würde beim Mode-Wechsel verschwinden
- ein `%FIELDNAME`-Token ohne [`fields`](#felder)-Eintrag und ohne `onViewApplied`
- ein `shadow` / `placeholder`, der weder einen deiner Blöcke noch einen echten
  Blockly-Typ benennt

Warnt:

- ein `%N` ohne `inputSlots`-Eintrag, oder ein `inputSlots`-Eintrag ohne
  passendes `%N`
- ein Element-Name, der nicht in `elementTypes` deklariert ist, oder ein Mode,
  der ein Element auflistet, das kein Block definiert
- ein `highlighting`-Schlüssel, der kein `code`-Element ist
- ein `elementTypes`-Konfigurationsfeld am falschen Typ — `stringQuote` oder
  `empty` an einem Nicht-`code`-Element, oder `size` an einem
  Nicht-`image`-Element — das ignoriert wird
- eine Block-`category`, die nicht in `categories` steht
- ein Name, der über Element / Mode / Preset hinweg mehrfach verwendet wird
  (siehe [Modes](/de/concepts/modes/))

Um eine Datei *vor* dem Mounten zu prüfen — in einem Test oder Build-Schritt —
rufe das exportierte `validateDefinitions(...)` auf, das `{ errors, warnings }`
zurückgibt, statt zu werfen.
