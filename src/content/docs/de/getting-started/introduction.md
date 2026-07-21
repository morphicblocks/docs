---
title: Einführung
description: Was Morphic Blocks ist und die Idee hinter den Modes.
---

Morphic Blocks ist eine TypeScript-Bibliothek, die auf
[Google Blockly](https://developers.google.com/blockly) aufbaut. Sie stellt ein
einziges Block-Modell in mehreren **Modes** dar — entwicklerdefinierten
visuellen Repräsentationen desselben Programms — und unterstützt so den
schrittweisen Übergang zwischen block- und textbasierter Programmierung, oder
zwischen beliebigen von dir definierten Repräsentationen.

Es handelt sich um eine **einbettbare Bibliothek**, nicht um eine App: Du
bringst deine eigene Oberfläche, dein Styling und dein Layout mit. Morphic
Blocks liefert das Block-Modell, das Mode-System und unstilisierte Views, die du
beliebig einbinden kannst.

## Die Idee in einem Bild

Dasselbe Programm, in verschiedenen Modes dargestellt:

```text
iconic mode    → Icon + Titel            (kompakt visuell)
lexical mode   → natürlichsprachlicher Block  ("print ▢")
syntactic mode → Block in Code-Syntax     ("console.log( ▢ );")
code modes     → Texteditor-Ansicht       (Codespace ersetzt den Workspace)
```

Darunter liegt stets genau **ein** Blockly-Block-Modell. Modes ändern nur, wie
es *dargestellt* wird — ein Mode-Wechsel rendert die Blöcke neu; das Programm
selbst bleibt unberührt.

## So funktioniert es

1. Du lieferst **Definitionen** (JSON): Jeder Block deklariert benannte
   *Elements* — seine visuellen Bestandteile (ein Icon, einen Titel, ein
   Block-Template, ein Code-Template, …).
2. Du lieferst **Behaviors** (JS/TS): eine Funktion pro Block-Typ, die
   ausführbaren Code erzeugt.
3. Du lieferst **CSS**: ein Stylesheet pro Mode.
4. Du bindest die Engine in deine Container ein und wählst ein **Preset** — eine
   Zuordnung von Modes zu Views (Toolbox, Workspace, Codespace, Preview).
5. Ein Wechsel von Modes oder Presets zur Laufzeit rendert jede View aus
   demselben Modell neu.

## Anwendungsfälle

Der wichtigste motivierende Anwendungsfall ist der **schrittweise Übergang von
Block zu Text**: Visuelle Hilfestellungen treten nach und nach zurück, während
Lernende sicherer werden. Weil Modes Inhalt von Darstellung entkoppeln,
unterstützt dieselbe Architektur viele weitere Anwendungen — allein durch neue
Modes, Elements und CSS:

- **Lokalisierung** — dieselben Blöcke mit natürlichsprachlichen Beschriftungen
  je Mode (Englisch, Deutsch, Spanisch, …).
- **Barrierefreiheit** — Modes für hohen Kontrast, große Schrift,
  Legasthenie-freundliche oder für Screenreader optimierte Darstellung.
- **Altersgerechte Darstellung** — icon-zentrierte Modes für junge Lernende,
  ausführlicher Text für ältere.
- **Vergleichende Programmierdidaktik** — dasselbe Programm in Python-, Java- und
  C++-Syntax nebeneinander.
- **Experten- vs. Anfänger-Ansichten** — kompakte Darstellung für Experten,
  beschreibende für Einsteiger.
- **Domänenspezifische visuelle Sprachen** — eigene Modes für Musik, Robotik,
  Data Science, Game Design.
- **Dokumentationsangereicherte Blöcke** — Beschreibungen, Beispiele oder
  Begründungen neben den Blöcken.

## Wie es weitergeht

- [Installation](/de/getting-started/installation/) — das Paket in dein Projekt aufnehmen.
- [Schnellstart](/de/getting-started/quick-start/) — ein minimales End-to-End-Beispiel.
- [Blocks & Elements](/de/concepts/blocks-and-elements/) — das Kernkonzept, auf dem alles aufbaut.
