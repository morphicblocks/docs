---
title: Fehler & Warnungen
description: Jede Prüfung des Frameworks, mit einer Beispielmeldung und wie du sie behebst.
---

Das Framework prüft die Definitionen und die Einrichtung, wenn du `mount()`
aufrufst. Ein **Fehler** stoppt das Mounten, da das Ergebnis falsch wäre;
alle Probleme werden gesammelt und auf einmal gemeldet. Eine **Warnung** geht
in die Browser-Konsole (oder an
[`onWarning`](/de/concepts/definitions-format/#validierung)), und die App läuft
weiter, da die Konfiguration nur wirkungslos oder verwirrend ist. Suche auf
dieser Seite nach dem Anfang einer Meldung, um sie zu finden. Die Meldungen
selbst sind englisch.

## Fehler in den Definitionen

| Meldung, zum Beispiel | Was zu tun ist |
| --- | --- |
| `Block "say": code elements "concept" and "python" use different placeholders (%1 vs %1, %2)` | Gib jedem Code-Element eines Blocks dieselben `%N`-Slots, sonst verschwindet ein Input, wenn das gezeigte Element wechselt |
| `Block "say": field token %NAME has no fields["NAME"] entry and the block has no onViewApplied behavior` | Deklariere das Feld in [`fields`](/de/concepts/definitions-format/#felder) oder erzeuge es in `onViewApplied` |
| `Block "declare": element "java" uses %2:type, but %2 is not a value slot in it` | Lass `%N:type` auf einen Wert-Slot desselben Templates zeigen |
| `Block "repeat": inputSlots["1"].default.shadow: "number" is neither a defined block nor a registered Blockly block type.` | Nenne einen deiner Blöcke oder einen Blockly-Typ wie `math_number` |
| `Block "say": unknown shape "line".` | Nimm eine Form aus der Liste in der Meldung |
| `Block "say": inputSlots["1"] has unknown kind "values".` | Nimm `value` oder `statement` |
| `Block "say": fields["COLOR"] has unknown type "colour".` | Nimm `dropdown`, `text`, `number` oder `checkbox` |
| `Block "pen": fields["COLOR"] option "red" has an image label without "src" or "color".` | Gib dem Bild ein `src` oder eine `color` |
| `elementTypes."icon": unknown type "picture".` | Nimm `text`, `code`, `image` oder `custom` |
| `elementTypes declares "default", which is reserved` | Benenne das Element um; `default` heißt das Ersatz-Template eines Blocks |
| `Mode "python-tiles": render.python must be "block-based" or "text-based".` | Nimm einen der beiden Werte |
| `Preset "text-preset": unknown mode "python-text" for the toolbox.` | Nenne einen Mode aus `modes` |
| `Preset "text-preset": view "text-pane" shows "python-tiles", which is no code element.` | Ein View zeigt ein Code-Element (`python`), ein Mode ist für Kacheln |
| `Preset "text-preset": "views" must name at least one view.` | Führe die Views auf, die das Preset zeigt |
| `Preset "text-preset" is defined more than once.` | Gib jedem Preset einen eigenen Namen |

## Fehler in der Einrichtung

| Meldung, zum Beispiel | Was zu tun ist |
| --- | --- |
| `MorphicBlocks.mount needs a container for at least one view.` | Übergib `containers` (oder `workspaceContainer` / `codespaceContainer`) |
| `mount: a container for "editor", but no view of that name.` | Nimm einen Namen aus `views` oder deklariere den View |
| `View "read-pane": unknown kind "text".` | Nimm `workspace` oder `codespace` |
| `MorphicBlocks.mount: unknown preset "start".` | Nenne ein Preset aus `presets` |
| `show: no view named "editor".`, `addView: a view named "read-pane" already exists.` | Nimm den Namen eines eingerichteten Views oder einen neuen für einen hinzugefügten |

## Fehler nach einem Update

Eine Einstellung an ihrem Platz aus einer älteren Version scheitert mit dem
neuen Platz in der Meldung:

| Meldung, zum Beispiel | Seit |
| --- | --- |
| `mount option "previewContainer" moved in 0.4.0: …` (auch `previewTheme`, `toolbarContainers`, `codespace`) | 0.4.0 |
| `Preset "text": "workspace", "codespace" moved into "views" in 0.4.0` | 0.4.0 |
| `Preset "text": the toolbox entry is a mode name since 0.4.0, and its "render" moved into the mode` | 0.4.0 |
| `Mode "python-tiles": render "text" is now "text-based"` | 0.4.0 |
| `setModes was replaced by show() in 0.4.0` | 0.4.0 |
| `elementTypes."python": "stringQuote" moved into the "code" section` (auch `empty`, ein `highlighting` auf oberster Ebene) | 0.3.0 |

## Warnungen in den Definitionen

| Meldung, zum Beispiel | Was zu tun ist |
| --- | --- |
| `Name "python" is used as element and view` | Gib jeder Art einen eigenen Namen; siehe [Namen](/de/concepts/naming/) |
| `Name "blocks" (mode) is a Morphic Blocks word` | Benenne es nach dem, was es in deiner App ist, etwa `concept-tiles` |
| `Name "my pane" (view) has characters a CSS class cannot hold; its classes use "my-pane".` | Nimm Buchstaben, Ziffern, `-` und `_`, oder schreib den geänderten Namen in dein CSS |
| `Block "say": placeholder %2 has no inputSlots["2"] entry` | Füge den Slot hinzu, damit Behaviors seinen Input per Namen lesen |
| `Block "say": inputSlots["2"] has no matching %2 placeholder` | Entferne den Slot oder füge `%2` zu den Templates hinzu |
| `Block "say": fields["NAME"] has no matching %NAME token` | Entferne das Feld oder füge `%NAME` zu einem Template hinzu |
| `Block "say": element "javascript" is not declared in elementTypes` | Deklariere den Typ des Elements |
| `Mode "icon-tiles": element "picture" is not declared in elementTypes` | Deklariere es oder nimm es aus dem Mode |
| `Mode "icon-tiles": render.pyton names no code element` | Korrigiere den Element-Namen |
| `Block "say": category "Ouput" is not declared in categories` | Korrigiere den Namen oder deklariere die Kategorie |
| `Block "say": shape "statement" contradicts its flags` | Entferne die Flags oder die Form; die Flags gewinnen |
| `Block "pen": fields["OP"] option "and" has display for "title", which is not a code element` | Schlüssel `display` nach Code-Elementen |
| `code["title"] is not a code element` | Verschiebe die Einstellungen zu einem Code-Element |
| `elementTypes."title": "size" applies only to image elements` | Entferne `size` |
| `Preset "text-preset" names "read-pane", which is no declared view` | Deklariere den View oder füge ihn mit `addView()` hinzu, bevor das Preset greift |

## Warnungen während des Betriebs

| Meldung, zum Beispiel | Was zu tun ist |
| --- | --- |
| `Modes without explicit CSS definition: icon-tiles.` | Gib dem Mode ein Stylesheet (`modesFolder` oder `modeStyles`) |
| `Blockly's media is missing at "blockly-media/"` | Kopiere es mit dem [Bundler-Plugin oder dem Skript](/de/getting-started/installation/) |
| `The custom element "info" has no function in toolbox.custom` | Füge die Funktion des Elements zu [`toolbox.custom`](/de/concepts/blocks-and-elements/#eigene-elemente) hinzu |
| `The toolbox layout "tabs" needs categories` | Gib der Toolbox Kategorien oder nimm das gestapelte Layout |

Um die Prüfungen der Definitionen selbst auszuführen, vor dem Mounten (in
einem Test oder Build-Schritt), rufe `validateDefinitions(...)` auf; es gibt
`{ errors, warnings }` zurück, statt zu werfen.
