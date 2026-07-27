---
title: Behaviors & Code Generation
description: Behavior functions turn blocks into runnable code.
---

Definitions describe how blocks *look*; **behaviors** define what they *do*.
The behaviors map pairs each block identifier with the function that generates
its executable code:

```ts
import type { MorphicBehaviorMap } from "morphic-blocks";

export const behaviors: MorphicBehaviorMap = {
  text_print(proxy) {
    return `console.log(${proxy.inputs.TEXT ?? "undefined"});\n`;
  },
};
```

Code generation is **one-way and developer-controlled**: whatever string your
behavior returns *is* the code. There is no fixed target language — behaviors
typically emit JavaScript because that's what the browser can run, but the
strings are yours.

## The behavior proxy

Your generate function receives a proxy of the live block:

| Property    | What it holds                                              |
| ----------- | ---------------------------------------------------------- |
| `blockId`   | The Blockly block id                                       |
| `blockType` | The clean block identifier (e.g. `text_print`)             |
| `mode`      | The active workspace mode                                  |
| `inputs`    | Generated code of attached blocks, keyed by input name     |
| `fields`    | Field values, keyed by field name                          |
| `context`   | Render context                                             |

`proxy.inputs.TEXT` is the *already generated* code of whatever block sits in
the `TEXT` slot — generation recurses through the program for you.

## The full behavior object

A behavior can be more than a generate function. The long form:

```ts
export const behaviors: MorphicBehaviorMap = {
  text_print: {
    init(block, context) {
      // one-time setup when the block is created
    },
    onViewApplied(block, context) {
      // called after a mode/view is applied — attach *custom* Blockly fields
      // here (dropdown/text/number/checkbox are declared in `fields` instead)
    },
    generate(proxy) {
      return `console.log(${proxy.inputs.TEXT ?? "undefined"});\n`;
    },
  },
};
```

| Hook            | When it runs                                                   |
| --------------- | -------------------------------------------------------------- |
| `init`          | Once, when the block is instantiated                           |
| `onViewApplied` | After each mode application — attach *custom* fields (standard dropdown/text/number/checkbox go in [`fields`](/concepts/definitions-format/#fields)) |
| `generate`      | During code generation                                         |

A bare function is shorthand for `{ generate }`.

## Generating and running

```ts
const js = engine.generateJavaScript();

// with block → code-position metadata (used by selection sync):
const { code, metadata } = engine.generateJavaScriptWithMetadata();

// execute in the page:
engine.runJavaScript();
```

## Behaviors vs. template rendering

Two different things turn blocks into text — don't confuse them:

- **Behaviors** produce the *executable* code (`generateJavaScript()`).
- **Templates** (`code` elements with `%N` substitution) produce what the
  codespace and preview *display*.

They are independent by design: what learners see can be Python while what
runs is JavaScript. See [Presets & Views](/concepts/presets-and-views/) for
wiring views, and the [Codespace guide](/guides/codespace/) for the editable
text view.
