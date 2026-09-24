---
title: Tests ausführen
description: Wie die eigenen Tests des Frameworks funktionieren und wie man einen hinzufügt.
---

Diese Seite ist für die Arbeit an Morphic Blocks selbst. Um deine eigenen Blöcke
in deiner App zu testen, siehe [Blöcke testen](/de/guides/testing/).

## Ausführen

Im Wurzelverzeichnis des `morphic-blocks`-Repositorys:

```sh
bun install
bun run test
```

Die Tests laufen mit [Vitest](https://vitest.dev) in
[jsdom](https://github.com/jsdom/jsdom), einem Browser-Ersatz, weil Blockly ein
DOM braucht. Die ganze Suite dauert deutlich unter einer Sekunde.

## Wo sie liegen

Alles liegt in `packages/morphic-blocks/`:

| Datei | Zweck |
| --- | --- |
| `vitest.config.ts` | Nutzt `vite.config.ts` mit, sodass Tests Imports genau wie der Library-Build auflösen, auch reine Vite-Imports wie `?inline`-CSS |
| `test/setup-dom.ts` | Beantwortet die wenigen Textmessungen, die jsdom nicht kann, mit festen Größen |
| `test/brackets.test.ts` | Operanden-Klammern, im gerenderten Text und im ausführbaren Code |
| `test/multiple-editors.test.ts` | Mehrere Editoren auf einer Seite behalten ihre eigenen Blöcke |
| `test/styles.test.ts` | Eingefügte Stylesheets werden nie doppelt hinzugefügt |

Die Tests prüfen erzeugten Text und Verhalten, nie das Aussehen der Blöcke auf
dem Bildschirm, deshalb spielen die festen Größen in der Setup-Datei keine Rolle.

## Einen Test hinzufügen

- Füge für jeden Fix und jedes Feature einen Test hinzu, und stelle sicher, dass
  er **ohne deine Änderung fehlschlägt**. Ein Test, der so oder so besteht,
  beweist nichts.
- Mounte eine echte Engine und gib jeder Testdatei ihre eigenen kleinen
  Definitionen, damit Tests nicht von der Sandbox abhängen.
- In den Tests des Frameworks darfst du Blöcke direkt mit
  `engine.getWorkspace()!.newBlock("morphic:<identifier>")` erzeugen. Das Präfix
  `morphic:` ist der interne Blockly-Typname; Apps brauchen ihn nie.
