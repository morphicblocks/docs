---
title: Syntax-Highlighting
description: Definitionsgesteuertes Highlighting für die Codespaces.
---

Die Codespaces färben ihren Text aus dem `highlighting` jedes
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
- Jeder Codespace wählt den Eintrag des Elements, das er zeigt.
- Ein Wechsel dessen, was ein View zeigt, zur Laufzeit (`show()`, Presets) tauscht die Regeln live.
- Code, der auf Toolbox-Kacheln als Text steht (`render: "text-based"`), nimmt
  dieselben Regeln und Farben; die Toolbox-Option `highlight: false` schaltet
  das ab.

## Pro Editor überschreiben

Der Code-Editor nimmt `highlightRules` in seinen Optionen, vor den
Definitionen:

```ts
await engine.mountCodeEditor(container, {
  highlightRules: { keywords: ["SELECT", "FROM"], strings: ["'"] },
});
```
