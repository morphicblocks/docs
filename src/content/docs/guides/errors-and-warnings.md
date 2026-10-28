---
title: Errors & Warnings
description: Every check the framework runs, with an example message and how to fix it.
---

The framework checks the definitions and the setup when you call `mount()`.
An **error** stops the mount, since the result would be wrong; every problem is
collected and reported at once. A **warning** goes to the browser console (or
to [`onWarning`](/concepts/definitions-format/#validation)) and the app keeps
running, since the config is only dead or confusing. Search this page for the
start of a message to find it.

## Errors in the definitions

| Message, for example | What to do |
| --- | --- |
| `Block "say": code elements "concept" and "python" use different placeholders (%1 vs %1, %2)` | Give every code element of a block the same `%N` slots, or an input disappears when the shown element changes |
| `Block "say": field token %NAME has no fields["NAME"] entry and the block has no onViewApplied behavior` | Declare the field in [`fields`](/concepts/definitions-format/#fields), or create it in `onViewApplied` |
| `Block "declare": element "java" uses %2:type, but %2 is not a value slot in it` | Point `%N:type` at a value slot of the same template |
| `Block "repeat": inputSlots["1"].default.shadow: "number" is neither a defined block nor a registered Blockly block type.` | Name one of your blocks or a Blockly type such as `math_number` |
| `Block "say": unknown shape "line".` | Use a shape from the list in the message |
| `Block "say": inputSlots["1"] has unknown kind "values".` | Use `value` or `statement` |
| `Block "say": fields["COLOR"] has unknown type "colour".` | Use `dropdown`, `text`, `number` or `checkbox` |
| `Block "pen": fields["COLOR"] option "red" has an image label without "src" or "color".` | Give the picture a `src` or a `color` |
| `elementTypes."icon": unknown type "picture".` | Use `text`, `code`, `image` or `custom` |
| `elementTypes declares "default", which is reserved` | Rename the element; `default` names a block's fallback template |
| `Mode "python-tiles": render.python must be "block-based" or "text-based".` | Use one of the two values |
| `Preset "text-preset": unknown mode "python-text" for the toolbox.` | Name a mode from `modes` |
| `Preset "text-preset": view "text-pane" shows "python-tiles", which is no code element.` | A view shows a code element (`python`), a mode is for tiles |
| `Preset "text-preset": "views" must name at least one view.` | List the views the preset shows |
| `Preset "text-preset" is defined more than once.` | Give each preset its own name |

## Errors in the setup

| Message, for example | What to do |
| --- | --- |
| `MorphicBlocks.mount needs a container for at least one view.` | Pass `containers` (or `workspaceContainer` / `codespaceContainer`) |
| `mount: a container for "editor", but no view of that name.` | Use a name from `views`, or declare the view |
| `View "read-pane": unknown kind "text".` | Use `workspace` or `codespace` |
| `MorphicBlocks.mount: unknown preset "start".` | Name a preset from `presets` |
| `show: no view named "editor".`, `addView: a view named "read-pane" already exists.` | Use a set up view's name, or a new one for an added view |

## Errors after an upgrade

A setting in its place from an older version fails with the new place in the
message:

| Message, for example | Since |
| --- | --- |
| `mount option "previewContainer" moved in 0.4.0: …` (also `previewTheme`, `toolbarContainers`, `codespace`) | 0.4.0 |
| `Preset "text": "workspace", "codespace" moved into "views" in 0.4.0` | 0.4.0 |
| `Preset "text": the toolbox entry is a mode name since 0.4.0, and its "render" moved into the mode` | 0.4.0 |
| `Mode "python-tiles": render "text" is now "text-based"` | 0.4.0 |
| `setModes was replaced by show() in 0.4.0` | 0.4.0 |
| `elementTypes."python": "stringQuote" moved into the "code" section` (also `empty`, a top level `highlighting`) | 0.3.0 |

## Warnings in the definitions

| Message, for example | What to do |
| --- | --- |
| `Name "python" is used as element and view` | Give each kind its own name; see [Naming](/concepts/naming/) |
| `Name "blocks" (mode) is a Morphic Blocks word` | Name it after what it is in your app, e.g. `concept-tiles` |
| `Name "my pane" (view) has characters a CSS class cannot hold; its classes use "my-pane".` | Use letters, digits, `-` and `_`, or write the changed name in your CSS |
| `Block "say": placeholder %2 has no inputSlots["2"] entry` | Add the slot, so behaviors can read its input by name |
| `Block "say": inputSlots["2"] has no matching %2 placeholder` | Remove the slot, or add `%2` to the templates |
| `Block "say": fields["NAME"] has no matching %NAME token` | Remove the field, or add `%NAME` to a template |
| `Block "say": element "javascript" is not declared in elementTypes` | Declare the element's type |
| `Mode "icon-tiles": element "picture" is not declared in elementTypes` | Declare it, or remove it from the mode |
| `Mode "icon-tiles": render.pyton names no code element` | Fix the element name |
| `Block "say": category "Ouput" is not declared in categories` | Fix the name, or declare the category |
| `Block "say": shape "statement" contradicts its flags` | Remove the flags or the shape; the flags win |
| `Block "pen": fields["OP"] option "and" has display for "title", which is not a code element` | Key `display` by code elements |
| `code["title"] is not a code element` | Move the settings to a code element |
| `elementTypes."title": "size" applies only to image elements` | Remove `size` |
| `Preset "text-preset" names "read-pane", which is no declared view` | Declare the view, or add it with `addView()` before the preset applies |

## Warnings while running

| Message, for example | What to do |
| --- | --- |
| `Modes without explicit CSS definition: icon-tiles.` | Give the mode a stylesheet (`modesFolder` or `modeStyles`) |
| `Blockly's media is missing at "blockly-media/"` | Copy it with the [bundler plugin or the script](/getting-started/installation/) |
| `The custom element "info" has no function in toolbox.custom` | Add the element's function to [`toolbox.custom`](/concepts/blocks-and-elements/#custom-elements) |
| `The toolbox layout "tabs" needs categories` | Give the toolbox categories, or use the stacked layout |

To run the definition checks yourself, before mounting (in a test or a build
step), call `validateDefinitions(...)`; it returns `{ errors, warnings }`
instead of throwing.
