---
title: Modes
description: Modes wählen aus, welche Elements ein Block zeigt.
---

Ein **Mode** ist eine benannte Teilmenge von
[Elements](/de/concepts/blocks-and-elements/). Einem View einen Mode
zuzuweisen entscheidet, welche visuellen Bestandteile jedes Blocks dieser View
rendert — mehr nicht. Modes sind rein darstellend: Ein Wechsel ändert nie das
zugrunde liegende Block-Modell.

```json
{
  "modes": [
    { "name": "iconic",     "elements": ["icon", "title", "description"] },
    { "name": "conceptual", "elements": ["title", "concept"] },
    { "name": "syntax-py",  "elements": ["title", "python"] }
  ]
}
```

| Feld       | Erforderlich | Zweck                                                        |
| ---------- | ------------ | ------------------------------------------------------------ |
| `name`     | ja           | Mode-Identifier — halte ihn getrennt von Element- und Preset-Namen |
| `elements` | ja           | Element-Namen, die auf der Toolbox-Kachel gerendert werden, **in Listenreihenfolge** |

Die **Reihenfolge** von `elements` ist die Reihenfolge, in der die Teile auf der
Toolbox-Kachel erscheinen — die Liste umsortieren, um die Kachel umzuordnen.

Die Mode-Namen liegen bei dir. Ein „Mode" kann eine Hilfestellungs-Stufe sein
(`iconic` → `conceptual` → `syntax-py`), eine natürliche Sprache (`english`,
`deutsch`), eine Zielsyntax (`syntax-py`, `syntax-js`), eine Barrierefreiheits-
Variante — was auch immer deine Anwendung braucht.

Halte jeden Mode-Namen **getrennt von deinen Element- und Preset-Namen**. Einen
Mode nach seinem Quell-Element zu benennen (ein `python`-Mode, dessen Quelle das
`python`-Element ist) lässt ein Wort zwei Dinge bedeuten; das Framework gibt eine
Warnung aus, wenn ein Element-, Mode- oder Preset-Name kollidiert. Deshalb heißt
der Mode oben `syntax-py`, nicht `python`.

## Das Quell-Element

Wird ein Mode einem **Codespace** oder einer **Preview** (Text-Views)
zugewiesen, muss das Framework wissen, *welches* Element es als Quelltext
rendert. Das ist das **Quell-Element** des Mode: das erste `type: "code"`-Element
in seinem `elements`-Array.

Für den obigen `syntax-py`-Mode ist das Quell-Element `python` — ein Codespace in
diesem Mode rendert das `python`-Template jedes Blocks als Text.

Wie die Code-Elements eines Mode auf einer **Toolbox-Kachel** rendern (als
Mini-Block oder als Quelltext) entscheidet *nicht* der Mode — das entscheidet
der `toolbox`-Eintrag des Preset. So bleiben Modes wiederverwendbar: Derselbe
Mode kann in einem Einsteiger-Preset block-artig und in einem
fortgeschrittenen text-artig erscheinen. Siehe
[Presets & Views](/de/concepts/presets-and-views/).

## Auflösung des Workspace-Templates

Wird ein Mode dem **Workspace** zugewiesen, braucht jeder Block ein
Blockly-Template. Es wird der Reihe nach aufgelöst:

1. Das erste `type: "code"`-Element im `elements`-Array des Mode
2. Fallback: das erste `type: "code"`-Element in der Block-Definition
3. Fallback: ein Element mit dem wörtlichen Namen `"block"` (Abwärtskompatibilität)
4. Fallback: das erste Element in der Definition

In der Praxis denkst du selten darüber nach — führe ein Code-Element im Mode
auf, und das ist das Template.

## Modes wechseln

Modes werden pro View zur Laufzeit gewechselt, einzeln über
[`setModes()`](/de/concepts/presets-and-views/#die-tieferliegende-api-setmodes)
oder als benanntes Bündel über [Presets](/de/concepts/presets-and-views/). Die
Blöcke werden an Ort und Stelle neu gerendert; das Programm bleibt unberührt.

Jeder Mode wird von einer CSS-Datei gestützt, die steuert, wie seine Elements
aussehen — siehe [Modes mit CSS gestalten](/de/guides/styling-modes/).
