# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-editor language support for Wispy Grove (`.grov` files). The project provides syntax highlighting and editor integration across VS Code (Phase 1, implemented), Neovim, and Zed (Phase 2, stubs).

## Build Commands

### VS Code Extension
```bash
cd vscode && npm install
# Package into .vsix:
npx @vscode/vsce package --out wispy-grove.vsix --no-update-package-json
# Or use the build script:
./scripts/build-vscode.sh
```

### Tree-sitter Grammar (Phase 2 — parser not yet generated)
```bash
cd tree-sitter && npm install
npx tree-sitter generate   # generates src/parser.c from grammar.js
npx tree-sitter test        # runs tests if tree-sitter/test/ exists
# Or use the build script:
./scripts/build-tree-sitter.sh
```

No test infrastructure exists yet for either component.

## Architecture

- **`vscode/`** — Self-contained VS Code extension using a **TextMate regex grammar** (`syntaxes/grove.tmLanguage.json`). Scope name: `text.html.grov`, extends `text.html.basic`.
- **`tree-sitter/`** — **Tree-sitter AST grammar** (`grammar.js`) + highlight queries (`queries/highlights.scm`). Shared foundation for Neovim and Zed. Independent of the VS Code extension.
- **`neovim/`** and **`zed/`** — Stub configurations that will consume the tree-sitter grammar.
- **`scripts/`** — Bash build scripts for packaging each component.
- **`lang-support-spec.md`** — Full design specification covering syntax edge cases, keyword lists, and acceptance criteria.

The two grammars (TextMate and Tree-sitter) define the same language in parallel — TextMate for VS Code, Tree-sitter for Neovim/Zed. They share no code.

## Key Design Decisions

### TextMate scope conventions
The VS Code TextMate grammar (`grove.tmLanguage.json`) uses semantic scopes that distinguish Grove constructs from plain HTML. The mapping:

| Grove token | Scope |
|---|---|
| `{%` `%}` delimiters | `punctuation.section.embedded.begin/end` |
| Sigils (`#`, `:`, `/`) | `keyword.operator.sigil.open/branch/close` |
| Keywords (`if`, `each`, `set`, etc.) | `keyword.control.<category>` (conditional, loop, assignment, import, slot, capture, web, verbatim) |
| Variables/identifiers | `variable.other` |
| `=` assignment | `keyword.operator.assignment` |
| Strings | `string.quoted.double/single` (standard) |
| Filters (after `\|`) | `support.function.filter` |
| Component tags (`<Card>`) | `entity.name.tag.component` |
| `<Component>` definition | `entity.name.tag.definition` |
| `{expr}` in attributes | `punctuation.section.embedded.begin/end.attribute` |
| Comments `{# #}` | `comment.block` |
