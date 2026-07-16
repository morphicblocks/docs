---
title: Syntax-Highlighting
description: Definitionsgesteuertes Highlighting für Codespace und Preview.
---

Codespace und Preview färben ihren Text aus der obersten `highlighting`-Map
deiner Definitionen — **keine Grammatik-Dateien, keine Sprach-Plugins**. Da das
[Quell-Element](/de/concepts/modes/#das-quell-element) eines Mode die „Sprache"
bereits benennt, ist die Map nach Element-Namen geschlüsselt:

```json
{
  "highlighting": {
    "python": {
      "keywords": ["print", "if", "else", "for", "in", "def", "return"],
      "strings": ["\"", "'"],
      "comment": "#"
    },
    "javascript": {
      "keywords": ["console", "if", "else", "for", "let", "const", "function"],
      "strings": ["\"", "'"],
      "comment": "//",
      "colors": { "keyword": "#c678dd" }
    }
  }
}
```

## Regel-Felder

| Feld | Zweck |
| --- | --- |
| `keywords` | Als Keywords hervorgehobene Wörter — exakte Übereinstimmung mit Identifier-Tokens |
| `strings`  | String-Begrenzer; ein Bereich läuft bis zum passenden Schließen auf derselben Zeile |
| `comment`  | Zeilenkommentar-Marker; hebt vom Marker bis Zeilenende hervor |
| `numbers`  | Ganzzahl-/Dezimalliterale hervorheben — Standard `true` |
| `colors`   | Optionale Überschreibungen pro Token-Klasse: `keyword`, `string`, `number`, `comment` (Framework liefert Standardwerte) |

Das ist bewusst auf Token-Ebene, kein Parser: genug, um gerenderte Templates
lesbar zu machen, einfach genug, dass eine neue „Sprache" in deinen Definitionen
fünf Zeilen JSON kostet.

## Wie es angewendet wird

- Übergib `highlighting` in der Mount-Konfiguration (meist direkt aus deiner
  Definitions-JSON).
- Jeder Codespace/jede Preview wählt den Eintrag, der zum Quell-Element seines
  Mode passt.
- Ein Mode-Wechsel zur Laufzeit (`setModes()`, Presets) tauscht die Regeln live.

## Pro Editor überschreiben

Für volle Kontrolle über einen einzelnen Editor übergib `highlightRules` in
dessen Mount-Optionen — sie hat Vorrang vor der Definitions-Suche:

```ts
await engine.mountPreview(container, {
  highlightRules: { keywords: ["SELECT", "FROM"], strings: ["'"] },
});
```
