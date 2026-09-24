---
title: Running the Tests
description: How the framework's own tests work and how to add one.
---

This page is for working on Morphic Blocks itself. To test your own blocks in
your app, see [Testing Your Blocks](/guides/testing/).

## Run them

From the root of the `morphic-blocks` repository:

```sh
bun install
bun run test
```

The tests run with [Vitest](https://vitest.dev) in
[jsdom](https://github.com/jsdom/jsdom), a browser stand-in, because Blockly
needs a DOM. The whole suite takes well under a second.

## Where they live

Everything sits in `packages/morphic-blocks/`:

| File | Purpose |
| --- | --- |
| `vitest.config.ts` | Reuses `vite.config.ts`, so tests resolve imports exactly like the library build, including Vite-only ones such as `?inline` CSS |
| `test/setup-dom.ts` | Answers the few text measuring calls jsdom cannot, with fixed sizes |
| `test/brackets.test.ts` | Operand brackets, in rendered text and in executable code |
| `test/multiple-editors.test.ts` | Several editors on one page keep their own blocks |
| `test/styles.test.ts` | Injected stylesheets are never added twice |

The tests check generated text and behavior, never how blocks look on screen,
so the fixed sizes in the setup file do not matter.

## Adding a test

- Add a test for every fix or feature, and make sure it **fails without your
  change**. A test that passes either way proves nothing.
- Mount a real engine and give each test file its own small definitions, so
  tests do not depend on the sandbox.
- Inside the framework's tests you may create blocks directly with
  `engine.getWorkspace()!.newBlock("morphic:<identifier>")`. The `morphic:`
  prefix is the internal Blockly type name; apps never need it.
