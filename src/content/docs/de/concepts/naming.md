---
title: Namen
description: Wie du Elemente, Modes, Presets, Views und Kategorien benennst, damit der Code klar lesbar bleibt.
---

Jeder Name in den Definitionen gehört dir: Elemente, Modes, Presets, Views und
Kategorien. Das Framework warnt nur bei zwei Dingen; alles andere auf dieser
Seite ist eine Empfehlung, die den Code einer App gut lesbar hält.

## Wovor das Framework warnt

**Ein Name für zwei Arten.** Ein Wort für ein Element und einen View, oder für
einen Mode und ein Preset, lässt Lesende raten, was gemeint ist:

```jsonc
"views":   { "python": "codespace" },                    // ein View namens python…
"presets": [{ "views": { "python": "python" } }]         // …zeigt das Element python
```

**Ein Wort des Frameworks als Name.** Diese Wörter bedeuten in Morphic Blocks
schon etwas, als eigene Namen lesen sie sich wie die des Frameworks:

| Kategorie | Wörter |
| --- | --- |
| View-Arten | `workspace`, `codespace`, `preview` |
| Element-Typen | `text`, `code`, `image`, `custom` |
| Teile der Definitionen | `element`, `mode`, `preset`, `view`, `category`, `block`, `blocks`, `tile`, `tiles`, `toolbox` |

Beides sind Warnungen, keine Fehler. Die eigenen Standard-Views des
Frameworks, `workspace` und `codespace` (wenn die Definitionen keine `views`
deklarieren), warnen nicht. Ein Name ist reserviert: Ein Element darf nicht
`default` heißen, denn so heißt das Ersatz-Template eines Blocks.

## Ein Muster pro Art

Ein Suffix zeigt auf einen Blick, welche Art ein Name ist. Das sind die
empfohlenen; jedes klare, einheitliche Muster funktioniert genauso.

| Art | Empfohlen | Alternativen | Beispiele |
| --- | --- | --- | --- |
| Element | ein schlichtes Wort für den Inhalt | | `concept`, `python`, `icon`, `description` |
| Mode | `…-tiles` | `…-mode` | `icon-tiles`, `python-text-tiles`, `expert-tiles` |
| Preset | `…-preset` | `…-step`, `…-level`, `…-layout` | `icon-preset`, `concept-step`, `java-level`, `compare-layout` |
| View | `…-pane` | `…-view` | `editor-pane`, `text-pane`, `read-pane` |
| Kategorie | ein Wort, das Lernende lesen | | `Output`, `Loops`, `Variables` |

**Warum `tiles` und `pane`.** Sie sagen, was man sieht: Ein Mode bestimmt, wie
die Kacheln (Tiles) der Toolbox aussehen, und ein View sitzt in einem Bereich
(Pane) der Seite. `expert` funktioniert als Mode-Name, aber `expert-tiles`
sagt, was es ist. Außerdem bleiben die CSS-Klassen lesbar, denn das Framework
schreibt die Art schon hinein: `morphic-mode-icon-tiles` und
`morphic-view-editor-pane`, wo `icon-mode` oder `editor-view` sie wiederholen
würden.

**Warum `preset` Alternativen hat.** Ein Preset ist oft ein Schritt eines
Lernwegs (`concept-step`), eine Stufe (`java-level`) oder ein Seitenlayout
(`compare-layout`). Das genauere Wort sagt mehr; `…-preset` passt immer.

## Namen schreiben

Empfohlen sind Namen in **kebab-case** (`editor-pane`), der übliche Stil für
alles, was im CSS landet. In JavaScript ist ein View-Name dann ein Schlüssel in
Anführungszeichen, was die eigenen Namen der App zugleich von den Optionen des
Frameworks abhebt:

```ts
engine.mount({
  containers: { "editor-pane": blocksElement, "read-pane": readElement },
  themes: { "read-pane": readTheme },
});
```

Andere Stile funktionieren genauso. Das Framework übernimmt jeden Namen so,
wie er geschrieben ist, in seine Klassen: `iconTiles` ergibt
`morphic-mode-iconTiles` und `title_en` ergibt `morphic-element-title_en`; nur
Zeichen, die eine Klasse nicht enthalten kann (ein Leerzeichen, `&`), werden
zu `-`. camelCase spart die Anführungszeichen in JavaScript
(`containers: { editorPane: el }`, wobei `{ "editorPane": el }` auch
funktioniert), und Unterstriche passen zu Element-Namen mit einer Sprache
(`title_en`, `pseudo_de`). Ein einzelnes Wort braucht weder Suffix noch Stil:
`title`, `python`. Wähle einen Stil pro App und bleib dabei.

Ein Name mit Zeichen, die eine Klasse nicht enthalten kann, warnt und nennt
die Klasse, die er stattdessen bekommt: `my pane` wird zu
`morphic-view-my-pane`. Kategorie-Namen sind Beschriftungen, die Lernende
lesen, daher sind Leerzeichen dort in Ordnung und warnen nicht; ihre Klasse
folgt derselben Regel: `Output & Text` wird zu `morphic-category-Output-Text`
und `data-category="Output-Text"`.

## Die Namen in dieser Dokumentation

Die Beispiele auf diesen Seiten nutzen einen Satz von Namen:

| Name | Art | Was es ist |
| --- | --- | --- |
| `title`, `icon`, `description` | Elemente | Beschriftung, Bild und Hilfetext einer Kachel |
| `concept` | Element | der Block in einfachen Worten (`Output %1`) |
| `python`, `javascript` | Elemente | der Block in jeder Sprache |
| `icon-tiles` | Mode | Kacheln mit Icon, Titel und Beschreibung |
| `concept-tiles`, `python-tiles` | Modes | Kacheln, die dieses Element als Block zeigen |
| `python-text-tiles` | Mode | Kacheln, die Python als Text zeigen |
| `icon-preset`, `hybrid-preset`, `text-preset` | Presets | die Schritte von Icons zu Python-Text |
| `editor-pane`, `text-pane`, `read-pane` | Views | die Blöcke, der bearbeitbare Text, der Text nur zum Lesen |

Die Standard-Views `workspace` und `codespace` erscheinen dort, wo ein
Beispiel keine eigenen `views` braucht.
