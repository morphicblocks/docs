---
title: Zusätzliche Views
description: Weitere Previews, Codespaces und Workspaces neben denen, die mount() einrichtet.
---

`mount()` richtet einen Workspace, einen Codespace und eine Preview ein.
`engine.addView()` fügt beliebig viele weitere hinzu, jede in ihrem eigenen
Mode: Python- und JavaScript-Previews nebeneinander, zwei Codespaces in
verschiedenen Sprachen oder schreibgeschützte Workspaces, die das Programm als
Blöcke in anderen Modes spiegeln.

```ts
const right = engine.addView({
  kind: "preview",                  // "preview" | "codespace" | "workspace"
  container: document.getElementById("right")!,
  mode: "syntax-js",
  name: "right",                    // optional; sonst view-1, view-2, …
  toolbar: { container: document.getElementById("right-toolbar")! },
});
await right.ready;                  // Text-Views laden ihren Editor im Hintergrund
```

## Arten

| Art | Was sie tut |
| --- | --- |
| `preview` | Zeigt das Programm als Text in ihrem Mode, schreibgeschützt. |
| `codespace` | Bearbeitet das Programm als Text in ihrem Mode: Ablegen, Werte direkt ändern, Löschen, der Griff, wie der eingebaute Codespace. |
| `workspace` | Zeigt das Programm als Blöcke in ihrem Mode und folgt jeder Änderung des Haupt-Workspace. Schreibgeschützt: `editable: false` ist vorerst der einzige Wert und der Standard. Ein Klick auf einen Block wählt ihn überall aus. |

Jede zusätzliche View nimmt an der [Auswahl-Synchronisierung](/de/guides/selection-sync/)
teil und hebt den ausgewählten Block hervor wie die eingebauten Views.

## Das Handle

`addView()` gibt ein Handle zurück:

| Mitglied | Zweck |
| --- | --- |
| `name`, `kind` | Name und Art der View. |
| `ready` | Erfüllt sich, sobald der Editor einer Text-View geladen ist. |
| `getMode()`, `setMode(mode)` | Der Mode der View. |
| `setTheme(theme)` | Farben einer Text-View, etwa beim Wechsel zwischen hell und dunkel. |
| `dispose()` | Entfernt die View und ihre Toolbar. |

Ein neues `mount()` entfernt alle zusätzlichen Views. `engine.getViewMode(name)`
gibt den Mode jeder View nach Namen zurück, eingebaut (`workspace`,
`codespace`, `preview`) oder hinzugefügt.

## Toolbars

Mit `toolbar: { container, items?, display? }` bekommt die View ihre eigene
Toolbar, die auf diese View wirkt und mit ihr entfernt wird. Die Elemente
richten sich standardmäßig nach der Art der View. Jede Toolbar lässt sich auch
später über den View-Namen anbinden; siehe [Toolbars](/de/guides/toolbars/).

## Presets

Ein Preset kann die Modes zusätzlicher Views über `views` nach Namen setzen:

```json
{ "name": "compare", "toolbox": "pseudo", "workspace": "pseudo",
  "views": { "right": "syntax-js" } }
```

Beim Anwenden wechselt jede aufgeführte View, die existiert. Die Container der
Views ein- und auszublenden bleibt Sache deiner App, wie bei den eingebauten:
Lies `preset.views` in `onPresetApplied`.
