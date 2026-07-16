---
title: Saving & Loading
description: Persist and restore workspaces.
---

Two calls cover persistence:

```ts
const state = engine.serializeWorkspace();   // plain JSON-serializable object
engine.loadWorkspace(state);                 // restore it
```

The state is Blockly's standard JSON workspace serialization — store it
wherever you like:

```ts
// save
localStorage.setItem("program", JSON.stringify(engine.serializeWorkspace()));

// restore
const saved = localStorage.getItem("program");
if (saved) engine.loadWorkspace(JSON.parse(saved));
```

Restoring re-renders all mounted views (workspace, codespace, preview, code
editor) in their current modes — saved state carries the *program*, not the
presentation. A program saved in `iconic` mode loads fine into a session
running `python` mode.

## Namespacing in saved state

Inside the serialized JSON, your blocks appear under their **namespaced**
Blockly type — `morphic:text_print`, not `text_print` (see
[Block identifiers](/concepts/blocks-and-elements/#block-identifiers)).
Practical consequences:

- **Don't** post-process saved state with clean identifiers in mind; the
  `morphic:` prefix is expected and required for loading.
- Saved state is coupled to your definitions: loading state that references a
  block you've since removed or renamed fails the same way it would in plain
  Blockly. Treat definition identifiers as a stable, versioned contract once
  users have saved programs.
- Blockly stock blocks used as shadows/placeholders (`math_number`, `text`)
  appear under their unprefixed names — that's correct too.
