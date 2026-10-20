---
title: Zusätzliche Views
description: Zur Laufzeit hinzugefügte Views, neben denen, die die Definitionen deklarieren.
---

Die meisten Apps deklarieren ihre Views in den Definitionen
([Presets & Views](/de/concepts/presets-and-views/)). `engine.addView()` fügt
stattdessen zur Laufzeit einen hinzu, für einen View, den die App nur
manchmal braucht: einen zweiten Codespace in einer anderen Sprache oder einen
weiteren Workspace, der das Programm als Blöcke in einem anderen Element zeigt.

```ts
const right = engine.addView({
  kind: "codespace",                // "codespace" | "workspace"
  editable: false,                  // schreibgeschützt, Standard true
  container: document.getElementById("right")!,
  element: "javascript",
  name: "right",                    // optional; sonst view-1, view-2, …
  toolbar: { container: document.getElementById("right-toolbar")! },
});
await right.ready;                  // Text-Views laden ihren Editor im Hintergrund
```

Er nimmt, was ein deklarierter View nimmt (`editable`, `rtl`, `delete`), dazu
seinen `container`, das `element`, das er zeigt, und optional `theme` und
`toolbar`.

## Arten

| Art | Was sie tut |
| --- | --- |
| `codespace` | Bearbeitet das Programm als Text in seinem Element: Ablegen, Werte inline bearbeiten, Löschen, der Griff. Mit `editable: false` zeigt er es nur. |
| `workspace` | Zeigt das Programm als Blöcke in seinem Element und folgt jeder Änderung des Workspace, der das Programm hält. Dort lassen sich Blöcke verschieben, verbinden, bearbeiten und löschen und Kacheln ablegen, und jede Änderung geht an den Workspace des Programms; `editable: false` macht ihn schreibgeschützt. Rückgängig folgt der Historie des Programms. Ein Klick auf einen Block wählt ihn überall aus. |

Jeder zusätzliche View nimmt am [Selection-Sync](/de/guides/selection-sync/)
teil und hebt den ausgewählten Block hervor wie die deklarierten Views.

## Das Handle

`addView()` gibt ein Handle zurück:

| Mitglied | Zweck |
| --- | --- |
| `name`, `kind` | Name und Art des Views. |
| `ready` | Erfüllt sich, sobald der Editor einer Text-View geladen ist. |
| `getElement()`, `show(element)` | Das Element, das der View zeigt. |
| `setTheme(theme)` | Farben einer Text-View, etwa beim Wechsel zwischen hell und dunkel. |
| `dispose()` | Entfernt den View und seine Toolbar. |

Ein neues `mount()` entfernt jeden zusätzlichen View.
`engine.getViewElement(name)` liefert das Element jedes Views nach Name,
deklariert oder hinzugefügt.

## Toolbars

Mit `toolbar: { container, items?, display? }` bekommt der View seine eigene
Toolbar, die auf ihn wirkt und mit ihm entfernt wird. Die Elemente richten
sich nach seiner Art. Jede Toolbar lässt sich auch später über den View-Namen
anbinden; siehe [Toolbars](/de/guides/toolbars/).

## Presets

Ein Preset kann zusätzliche Views in seinen `views` nennen, wie deklarierte:

```json
{ "name": "compare", "toolbox": "pseudo", "views": { "blocks": "concept", "right": "javascript" } }
```

Da der Name kein deklarierter View ist, warnt `mount()` einmal; das Anwenden
des Presets schaltet den View um, wenn es ihn gibt. Die Container der Views zu
zeigen und zu verbergen bleibt bei deiner App: Lies `preset.views` in
`onPresetApplied`.
