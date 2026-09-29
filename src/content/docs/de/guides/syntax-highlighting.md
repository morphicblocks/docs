---
title: Syntax-Highlighting
description: Definitionsgesteuertes Highlighting für Codespace und Preview.
---

Codespace und Preview färben ihren Text aus dem `highlighting` jedes
Code-Elements im [`code`-Abschnitt](/de/concepts/definitions-format/#code)
deiner Definitionen — **keine Grammatik-Dateien, keine Sprach-Plugins**. Da das
[Quell-Element](/de/concepts/modes/#das-quell-element) eines Mode die „Sprache"
bereits benennt, stehen die Regeln bei diesem Element:

```json
{
  "code": {
    "python": {
      "highlighting": {
        "keywords": ["print", "if", "else", "for", "in", "def", "return"],
        "strings": ["\"", "'"],
        "comment": "#"
      }
    },
    "javascript": {
      "highlighting": {
        "keywords": ["console", "if", "else", "for", "let", "const", "function"],
        "strings": ["\"", "'"],
        "comment": "//",
        "colors": { "keyword": "#c678dd" }
      }
    }
  }
}
```

## Regel-Felder

| Feld | Zweck |
| --- | --- |
| `keywords` | Als Keywords hervorgehobene Wörter, als ganze Wörter in jeder Schrift erkannt (`if`, `اطبع`) |
| `strings`  | String-Begrenzer: ein Zeichen, das öffnet und schließt (`"\""`), oder ein `[open, close]`-Paar für unterschiedliche Anführungszeichen (`["„", "“"]`); ein Bereich läuft bis zu seinem Schließen auf derselben Zeile |
| `comment`  | Zeilenkommentar-Marker; hebt vom Marker bis Zeilenende hervor |
| `numbers`  | Ganzzahl-/Dezimalliterale hervorheben — Standard `true` |
| `colors`   | Optionale Überschreibungen pro Token-Klasse: `keyword`, `string`, `number`, `comment` (Framework liefert Standardwerte) |

Das ist bewusst auf Token-Ebene, kein Parser: genug, um gerenderte Templates
lesbar zu machen, einfach genug, dass eine neue „Sprache" in deinen Definitionen
fünf Zeilen JSON kostet.

## Wie es angewendet wird

- Die Regeln kommen aus den Definitionen, die der Engine übergeben werden; ein
  `code`-Abschnitt in der Mount-Konfiguration ersetzt sie.
- Jeder Codespace/jede Preview wählt den Eintrag, der zum Quell-Element seines
  Mode passt.
- Ein Mode-Wechsel zur Laufzeit (`setModes()`, Presets) tauscht die Regeln live.
- Code, der auf Toolbox-Kacheln als Text steht (`render: "text"`), nimmt
  dieselben Regeln und Farben; die Toolbox-Option `highlight: false` schaltet
  das ab.

## Pro Editor überschreiben

Für volle Kontrolle über einen einzelnen Editor übergib `highlightRules` in
dessen Mount-Optionen — sie hat Vorrang vor der Definitions-Suche:

```ts
await engine.mountPreview(container, {
  highlightRules: { keywords: ["SELECT", "FROM"], strings: ["'"] },
});
```
