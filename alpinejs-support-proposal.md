# Alpine.js Support Proposal

## Goal

Ship first-class Alpine.js editor support inside the Grove VS Code extension. `.grov` files get `x-*`/`@*`/`:*` attribute highlighting, hover docs, and snippets — no second extension install required.

## Why fork, not depend

Existing Alpine extensions scope injections to `text.html`, `text.html.derivative`, `text.html.php`, `text.html.twig`. Our grammar uses `text.html.grov` (extends `text.html.basic`). Neither upstream injects there, so `.grov` gets zero Alpine tooling if we only list them as `extensionDependencies`. Upstreams are low-activity (last push 2022/2023) and unlikely to accept a scope PR quickly. Alpine's directive surface is stable (v3 API frozen since 2020), so fork drift risk is low.

## Sources

Both MIT-licensed — compatible with vendoring.

| Repo | Role | Take |
|---|---|---|
| [pcbowers/alpine-intellisense](https://github.com/pcbowers/alpine-intellisense) | IntelliSense + snippets + HTML custom-data hover docs | Primary base |
| [Sperovita/alpinejs-syntax-highlight](https://github.com/Sperovita/alpinejs-syntax-highlight) | JS highlighting inside `x-*` attribute values | Secondary (cleaner injection grammar) |

## Features to absorb

From **pcbowers/alpine-intellisense**:
- `syntaxes/alpine-intellisense.injection.json` — injects JS grammar into Alpine attribute values
- `syntaxes/html.html-data.json` — VS Code HTML custom data (hover docs + autocomplete for `x-data`, `x-show`, `x-bind`, `x-on`, `x-model`, `x-text`, `x-html`, `x-ref`, `x-if`, `x-for`, `x-transition`, `x-init`, `x-effect`, `x-cloak`, `x-ignore`, `x-teleport`, `x-modelable`, `x-mask`, magics `$el`/`$refs`/`$store`/`$watch`/`$dispatch`/`$nextTick`/`$root`/`$data`/`$id`)
- `snippets/snippets.code-snippets` — directive snippets
- `src/extension.ts` helpers — only if we find them genuinely useful; skip if pure glue

From **Sperovita**:
- Cross-check injection regex patterns for `:class`/`@event`/`x-*` — pick whichever is more accurate

## Scope changes required

Both upstream grammars need `injectTo` extended to include `text.html.grov`:

```json
"injectTo": [
  "text.html",
  "text.html.grov"
]
```

`contributes.html.customData` works automatically for any HTML-derived language, so hover docs likely need no change — verify.

## Integration plan

### 1. Vendor files
```
vscode/
├── syntaxes/
│   ├── grove.tmLanguage.json              (existing)
│   ├── alpine.injection.json              (from pcbowers, rescoped)
│   └── alpine.html-data.json              (from pcbowers)
├── snippets/
│   └── alpine.code-snippets               (from pcbowers)
└── THIRD_PARTY_LICENSES.md                (MIT attributions)
```

### 2. `package.json` additions
```json
"contributes": {
  "grammars": [
    { /* existing grove grammar */ },
    {
      "scopeName": "alpine.injection",
      "path": "./syntaxes/alpine.injection.json",
      "injectTo": ["text.html.grov"],
      "embeddedLanguages": {
        "source.js": "javascript"
      }
    }
  ],
  "html": {
    "customData": ["./syntaxes/alpine.html-data.json"]
  },
  "snippets": [
    { "language": "grov", "path": "./snippets/alpine.code-snippets" }
  ]
}
```

### 3. Conflict check
- Grove's `{expr}` interpolation inside attributes uses `punctuation.section.embedded.*.attribute`. Alpine injection targets attribute *values* — no overlap expected, but regression-test a file mixing both (`x-text="{user.name}"`).
- `@` sigil: Grove does not currently use bare `@` in attribute position, so `@click` stays Alpine-only. Confirm against `lang-support-spec.md`.

### 4. Attribution
Add `THIRD_PARTY_LICENSES.md` with full MIT notice from both repos. Credit in README.

### 5. Tests
Create `vscode/test-fixtures/alpine.grov` with representative directives. Manual smoke test until automated grammar tests exist.

## Non-goals

- No runtime Alpine linting (would require LSP).
- No Alpine version detection — ship v3 surface only.
- No upstream PR back — fork is vendored, not tracked.

## Risks

| Risk | Mitigation |
|---|---|
| Alpine adds new directives | Manual sync on Alpine minor releases; surface is small |
| Scope conflicts with Grove `{expr}` | Fixture tests before release |
| Bundle size | html-data + injection + snippets < 50KB total |
| Upstream license change | Irrelevant after vendor — pinned to current MIT commit SHA |

## Deliverables checklist

- [ ] Vendor pcbowers injection grammar, rescope to `text.html.grov`
- [ ] Vendor html-data.json verbatim
- [ ] Vendor snippets, scope to `grov` language
- [ ] Update `vscode/package.json` contributions
- [ ] Add `THIRD_PARTY_LICENSES.md`
- [ ] Fixture file + manual smoke test
- [ ] README section: "Built-in Alpine.js support"
