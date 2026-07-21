---
title: Introduction
description: What Morphic Blocks is and the idea behind modes.
---

Morphic Blocks is a TypeScript library built on top of
[Google Blockly](https://developers.google.com/blockly). It renders one block
model in multiple **modes** — developer-defined visual representations of the
same program — to support the gradual transition between block-based and
text-based programming, or between any visual representations you define.

It is an **embeddable library**, not an app: you bring your own UI, styling, and
layout. Morphic Blocks provides the block model, the mode system, and headless
views you can mount wherever you like.

## The idea in one picture

The same program, rendered in different modes:

```text
iconic mode    → icon + title            (compact visual)
lexical mode   → natural-language block  ("print ▢")
syntactic mode → code-syntax block       ("console.log( ▢ );")
code modes     → text editor view        (codespace replaces the workspace)
```

Underneath, there is always exactly **one** Blockly block model. Modes only
change how it is *presented* — switching a mode re-renders the blocks; it never
touches the program.

## How it works

1. You provide **definitions** (JSON): each block declares named *elements* — its
   visual parts (an icon, a title, a block template, a code template, …).
2. You provide **behaviors** (JS/TS): one function per block type that generates
   executable code.
3. You provide **CSS**: one stylesheet per mode.
4. You mount the engine into your containers and pick a **preset** — an
   assignment of modes to views (toolbox, workspace, codespace, preview).
5. Switching modes or presets at runtime re-renders every view from the same
   model.

## Use cases

The primary motivating use case is **gradual block-to-text transition**: visual
scaffolding fades progressively as learners build fluency. Because modes
decouple content from presentation, the same architecture supports many other
applications with nothing but new modes, elements, and CSS:

- **Localization** — the same blocks with natural-language labels per mode
  (English, German, Spanish, …).
- **Accessibility** — high-contrast, large-text, dyslexia-friendly, or
  screen-reader-optimized modes.
- **Age-appropriate rendering** — icon-centric modes for young learners, verbose
  text for older ones.
- **Comparative programming education** — the same program in Python, Java, and
  C++ syntax side by side.
- **Expert vs. novice views** — compact rendering for experts, descriptive
  rendering for novices.
- **Domain-specific visual languages** — custom modes for music, robotics, data
  science, game design.
- **Documentation-enriched blocks** — descriptions, examples, or rationale
  rendered alongside blocks.

## Where to go next

- [Installation](/getting-started/installation/) — add the package to your project.
- [Quick Start](/getting-started/quick-start/) — a minimal end-to-end example.
- [Blocks & Elements](/concepts/blocks-and-elements/) — the core concept everything builds on.
