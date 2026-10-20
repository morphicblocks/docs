---
title: Modes
description: Modes wählen, welche Elemente eine Toolbox-Kachel zeigt.
---

Ein **Mode** ist eine benannte Teilmenge von
[Elementen](/de/concepts/blocks-and-elements/), die eine **Toolbox-Kachel**
zeigt. Modes sind rein darstellerisch: Ein Wechsel ändert nie das Block-Modell
darunter. Seit 0.4.0 sind sie nur für die Kacheln da;
[Views](/de/concepts/presets-and-views/) zeigen stattdessen ein Code-Element.

```json
{
  "modes": [
    { "name": "iconic",      "elements": ["icon", "title", "description"] },
    { "name": "conceptual",  "elements": ["title", "concept"] },
    { "name": "python-text", "elements": ["title", "python"],
      "render": { "python": "text-based" } },
    { "name": "side-by-side", "elements": ["title", "concept", "python"],
      "render": { "concept": "block-based", "python": "text-based" } }
  ]
}
```

| Feld       | Pflicht | Zweck                                                      |
| ---------- | ------- | ---------------------------------------------------------- |
| `name`     | ja      | Bezeichner des Modes; halte ihn verschieden von Element- und Preset-Namen |
| `elements` | ja      | Element-Namen auf der Kachel, **in Listenreihenfolge** |
| `render`   | nein    | Wie jedes Code-Element auf der Kachel gezeichnet wird: `"block-based"` (Standard) oder `"text-based"` |

Die **Reihenfolge** von `elements` ist die Reihenfolge der Teile auf der
Kachel; ordne die Liste um, um sie neu anzuordnen.

Mode-Namen sind dir überlassen. Ein „Mode" kann eine Gerüst-Stufe sein
(`iconic`, `conceptual`, `python-text`), eine natürliche Sprache (`english`,
`deutsch`), eine Barrierefreiheits-Variante, was deine Anwendung braucht.

Halte jeden Mode-Namen **verschieden von deinen Element- und Preset-Namen**.
Einen Mode nach einem Element zu benennen (ein `python`-Mode, der das
`python`-Element zeigt) gibt einem Wort zwei Bedeutungen; das Framework warnt,
wenn Element-, Mode- oder Preset-Namen kollidieren.

## Blöcke oder Text auf einer Kachel

`render` sagt pro Code-Element, ob eine Kachel es als ziehbaren Mini-Block oder
als seinen Quelltext zeichnet. Weglassen heißt `block-based`, aber wo ein Mode
beides mischt, liest sich die Datei leichter, wenn `block-based` ausgeschrieben
ist, wie oben in `side-by-side`.

Der Text liest sich genau so, wie der Codespace den Block schreiben würde:
Feldwerte und Slot-Vorgaben eingesetzt (`for i in range(3):`), ein leerer Slot
als seine Typ-Markierung (`[NUMBER]`).

Bis 0.3 saß `render` am `toolbox`-Eintrag des Presets (`{ mode, render }`,
Werte `"block"` und `"text"`); `mount()` meldet diesen Platz mit dem neuen.

## Das Quell-Element

Das **Quell-Element** eines Modes ist das erste `type: "code"`-Element in
seinen `elements`. Views zeigen es, wo nichts anderes ein Element nennt: Ohne
Preset zeigt jeder View das Quell-Element des ersten Modes.

## Modes wechseln

Der Toolbox-Mode wechselt mit einem [Preset](/de/concepts/presets-and-views/)
oder `show({ toolbox: "conceptual" })`. Kacheln werden an Ort und Stelle neu
gezeichnet; das Programm bleibt unberührt.

Hinter jedem Mode steht eine CSS-Datei, die das Aussehen seiner Elemente
steuert; siehe [Modes gestalten](/de/guides/styling-modes/).

## Die Elemente eines Modes ändern

Die Element-Liste eines Modes kann sich auch zur Laufzeit ändern, etwa damit
der Nutzer wählt, was die Kacheln zeigen:

```ts
engine.setModeElements("iconic", ["icon", "title"]);
```

Die Kacheln werden neu gezeichnet; die Views sind nicht betroffen. Deine
Definitionsdatei bleibt, wie sie ist, und ein neues `mount()` beginnt wieder
mit ihr. Unbekannte Element-Namen werden abgelehnt.
