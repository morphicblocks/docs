---
title: Themes
description: Ready-made colors for the code views from the @morphicblocks/themes package.
---

A theme for the code views is a plain object (see
[Themes](/guides/preview-and-code-editor/#themes) for every field). The
optional package `@morphicblocks/themes` holds ready-made ones, so an app can
pick one instead of writing its own colors:

```bash
npm install @morphicblocks/themes
```

```ts
import { standard } from "@morphicblocks/themes";

await engine.mount({
  // …containers
  editorTheme: standard.light,
});
```

Themes come in **families**: each holds a `light` and a `dark` version, so a
page that switches between light and dark takes both from one place.

| Family   | `light`                       | `dark`                                  |
| -------- | ----------------------------- | --------------------------------------- |
| `standard` | White background | Dark background, the framework's default |

Every version sets every field, so switching leaves nothing of the other
behind. The `standard` colors are based on VS Code's Light+ and Dark+
themes.

```ts
import { standard } from "@morphicblocks/themes";

const theme = darkMode ? standard.dark : standard.light;
engine.setViewTheme("codespace", theme);
engine.setCodeEditorTheme(theme);
```

`themes` holds every family by name, e.g. for a theme picker. Each family is
one JSON file in the package, so a new one is a new file. A theme is still a
plain object, so a small change needs no new theme:
`{ ...standard.light, fontSize: "16px" }`.

Themes cover the editor colors and font, not the token colors: keywords,
strings and numbers come from each code element's
[`highlighting`](/guides/syntax-highlighting/). On a light theme, also set a
visible [selection highlight](/guides/selection-sync/#options).
