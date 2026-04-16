<p align="center">
  <img src="branding/grove-full-logo@3x.png" alt="Wispy Grove" width="400">
</p>

<p align="center">
  Multi-editor language support for <strong>Wispy Grove</strong> templates (<code>.grov</code> files).
</p>

---

## Features

- Syntax highlighting for Grove template delimiters (`{% %}`, `{# #}`) and attribute expressions (`{expr}`)
- Sigil-aware block recognition (`{% #if %}` / `{% :else %}` / `{% /if %}`)
- Keyword recognition for control flow, loops, assignment, imports, slots, and web primitives
- PascalCase component tags (`<Card>`, `<Base>`) highlighted distinctly from HTML tags
- Full HTML embedding — Grove tokens are highlighted alongside standard HTML
- File icons for `.grov` files
- Bracket matching and auto-closing pairs for Grove delimiters
- Built-in Alpine.js support: directive highlighting (`x-*`, `@event`, `:prop`), hover docs, and snippets for `.grov` files — no second extension required

## Supported Editors

| Editor | Status | Engine |
|--------|--------|--------|
| VS Code | Available | TextMate grammar |
| Neovim | Planned | Tree-sitter |
| Zed | Planned | Tree-sitter |

## Installation

### VS Code

**From `.vsix` file:**

1. Build the `.vsix` (see [Building](#building) below)
2. In VS Code, open the Command Palette and run **Extensions: Install from VSIX...**
3. Select the `.vsix` file
4. Reload the window

### Neovim / Zed

Coming soon — these editors will share a Tree-sitter grammar currently in development.

## Building

### VS Code Extension

```bash
cd vscode && npm install
npx @vscode/vsce package --out wispy-grove.vsix --no-update-package-json
```

Or use the build script:

```bash
./scripts/build-vscode.sh
```

### Tree-sitter Grammar (in progress)

```bash
cd tree-sitter && npm install
npx tree-sitter generate
npx tree-sitter test
```

## Grove Syntax Overview

Grove is an HTML template language. It adds a unified `{% %}` delimiter for all server-side operations, `{# #}` for comments, and `{expr}` for dynamic attribute values. Blocks use sigil-prefixed keywords: `#` opens, `:` branches, `/` closes.

```html
{# Comments #}

{% #if user.logged_in %}
  <h1>Welcome, {% user.name | capitalize %}</h1>
{% :else %}
  <a href="/login">Log in</a>
{% /if %}

{% #each cart.items as item %}
  <div class="item">{% item.title %} - {% item.price %}</div>
{% :empty %}
  <p>Your cart is empty.</p>
{% /each %}

<Card title={post.title} elevated={isActive}>
  {% #fill body %}<p>{% post.excerpt %}</p>{% /fill %}
</Card>
```

### Tag Keywords

| Category | Keywords |
|----------|----------|
| Conditionals | `if`, `else`, `else if` |
| Loops | `each`, `as`, `in`, `empty` |
| Assignment | `set`, `let` |
| Imports | `import`, `from` |
| Slots | `slot`, `fill` |
| Capture | `capture` |
| Web primitives | `asset`, `meta`, `hoist` |
| Verbatim | `verbatim` |
| Logical operators | `and`, `or`, `not`, `&&`, `\|\|`, `!` |
| Literals | `true`, `false`, `nil`, `null` |

Blocks are formed by combining a sigil with a keyword: `{% #if %}` / `{% :else %}` / `{% /if %}`, `{% #each %} ... {% /each %}`, `{% #verbatim %} ... {% /verbatim %}`, etc. PascalCase elements like `<Card>` are component invocations; `<Component name="Card">...</Component>` defines a component.

### Filters

Filters transform values using the pipe operator:

```
{% name | lower | truncate(20) %}
```

Built-in filters include:

- **String:** `upper`, `lower`, `title`, `capitalize`, `trim`, `lstrip`, `rstrip`, `replace`, `truncate`, `center`, `ljust`, `rjust`, `split`, `wordcount`
- **Collection:** `length`, `first`, `last`, `join`, `sort`, `reverse`, `unique`, `min`, `max`, `sum`, `map`, `batch`, `flatten`, `keys`, `values`
- **Numeric:** `abs`, `round`, `ceil`, `floor`, `int`, `float`
- **Type/Logic:** `default`, `string`, `bool`
- **HTML:** `escape`, `striptags`, `nl2br`
- **Special:** `safe`

## HTML-adjacent extensions

Grove is HTML-first, so most HTML editor tooling works in `.grov` files. The extension ships defaults that opt `grov` into the standard HTML ecosystem:

| Extension | Works out of the box? | Notes |
|---|---|---|
| Emmet (built-in) | Yes | `emmet.includeLanguages: { "grov": "html" }` set by default. |
| Tailwind CSS IntelliSense | Yes | `tailwindCSS.includeLanguages: { "grov": "html" }` set by default. |
| Auto Close Tag | Yes | Default `activationOnLanguage: ["*"]` already covers `.grov`. |
| Auto Rename Tag | Yes | Same as above. |
| Extensions keyed on TextMate scope (e.g. `text.html.*`) | Yes | Grove's root scope is `text.html.grov`, so scope-prefixed matchers hit. |

### Built-in Alpine.js support

The extension ships with vendored Alpine.js tooling derived from [pcbowers/alpine-intellisense](https://github.com/pcbowers/alpine-intellisense) (MIT), re-scoped to target `.grov` files directly. You get directive syntax highlighting, hover docs, autocompletion, and snippets without installing a second extension. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for attribution. Also inspired by [Sperovita/alpinejs-syntax-highlight](https://github.com/Sperovita/alpinejs-syntax-highlight) (MIT).

### Extensions that hardcode `html`

Some extensions (a few linters, legacy tooling) only run when the language ID is literally `html` and offer no `includeLanguages`-style opt-in. To use them in `.grov` files, add a workspace-level association:

```json
// .vscode/settings.json
{
  "files.associations": {
    "*.grov": "html"
  }
}
```

**Trade-off:** this disables the Grove grammar for those files — you lose `{% %}` / `{# #}` / component highlighting. Opt in per-workspace only if the hardcoded-html extension is worth more than Grove's own highlighting.

## Project Structure

```
wispy-grove-lang-support/
├── vscode/              # VS Code extension (TextMate grammar)
│   ├── package.json
│   ├── language-configuration.json
│   ├── syntaxes/
│   │   └── grove.tmLanguage.json
│   └── images/
├── tree-sitter/         # Tree-sitter grammar (Neovim + Zed)
│   ├── grammar.js
│   └── queries/
│       └── highlights.scm
├── neovim/              # Neovim integration (planned)
├── zed/                 # Zed integration (planned)
├── scripts/             # Build scripts
└── branding/            # Logos and assets
```

## Credits

Built-in Alpine.js support is derived from the following MIT-licensed projects. Full license text and pinned commit SHAs are recorded in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

- [pcbowers/alpine-intellisense](https://github.com/pcbowers/alpine-intellisense) by P Christopher Bowers — injection grammar, HTML custom-data hover docs, and directive snippets (primary source, vendored).
- [Sperovita/alpinejs-syntax-highlight](https://github.com/Sperovita/alpinejs-syntax-highlight) by Greg Ransons — reference for JS-in-attribute injection patterns (researched, not directly vendored).

Thank you to both authors — this extension would not ship Alpine tooling without their prior work.

## License

MIT — see [LICENSE](LICENSE) for details.
