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
| `fields`    | Plain field values, keyed by field name                    |
| `quoted`    | The same values as quoted string literals                  |
| `context`   | Render context                                             |

`proxy.inputs.TEXT` is the *already generated* code of whatever block sits in
the `TEXT` slot — generation recurses through the program for you.

`fields` holds each value exactly as the field has it. `quoted` holds the same
value as a quoted, escaped string literal, always quoted, even when it looks like
a number. Pick the one your output needs:

```ts
var_declare(proxy) {
  // a variable name must stay bare: let x = …
  return `let ${proxy.fields.VAR} = ${proxy.inputs.VAL};\n`;
},
text_value(proxy) {
  // a text value must be a string: "hello", and "42" stays a string
  return proxy.quoted.TEXT;
},
```

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

## Parentheses in composed expressions

Blocks encode grouping by nesting: a multiply block holding an add block *is*
`2 * (3 + 4)`. Plain text loses that unless the brackets are written out, so the
framework adds them — in the executable code and in the rendered text alike.

An operand is bracketed when two conditions hold: the operand block composes
values of its own (it has value inputs), and the parent template composes several
values. The second condition keeps single-slot templates clean:

| Template | Value slots | Result |
| --- | --- | --- |
| `%1 %OP %2` | 2 | `2 * (3 + 4)` — grouping preserved |
| `print(%1)` | 1 | `print(2 * 3)` |
| `if %1:` | 1 | `if 10 == 20:` — idiomatic Python |

A **unary** operator is the exception: `-%1` has a single slot, yet `-(3 + 4)`
does need brackets. Write them into the template yourself — `-(%1)` — where the
framework cannot infer the intent.

## Behaviors vs. template rendering

Two different things turn blocks into text — don't confuse them:

- **Behaviors** produce the *executable* code (`generateJavaScript()`).
- **Templates** (`code` elements with `%N` substitution) produce what the
  codespace and preview *display*.

They are independent by design: what learners see can be Python while what
runs is JavaScript. See [Presets & Views](/concepts/presets-and-views/) for
wiring views, and the [Codespace guide](/guides/codespace/) for the editable
text view.
