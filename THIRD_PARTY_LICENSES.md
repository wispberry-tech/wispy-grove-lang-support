# Third-Party Licenses

This project vendors portions of the following MIT-licensed projects.

## Alpine.js editor support

Built-in Alpine.js tooling in the VS Code extension (`vscode/syntaxes/alpine.injection.json`, `vscode/syntaxes/alpine.html-data.json`, `vscode/snippets/alpine.code-snippets`) is derived from:

### pcbowers/alpine-intellisense

- Source: https://github.com/pcbowers/alpine-intellisense
- Pinned commit: `6854d1612eeae7d192f26c2209c97dba39756c34`
- License: MIT

Modifications: `scopeName` in the injection grammar changed from `alpine-intellisense.injection` to `wispy.alpine.injection` to avoid collision when the user also has the upstream extension installed. Injection scoped to `text.html.grov` only (via `injectTo` in `vscode/package.json`).

```
MIT License

Copyright (c) 2022 P Christopher Bowers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Sperovita/alpinejs-syntax-highlight

- Source: https://github.com/Sperovita/alpinejs-syntax-highlight
- Pinned commit: `2cf4f66f264dabeb218bb28128c2844aceb4a4a9`
- License: MIT

Referenced during proposal research for cross-checking JS-in-attribute injection patterns. No files vendored directly, but credit is recorded here in case future revisions incorporate its regex patterns.

```
MIT License

Portions Copyright (c) 2021 Greg Ransons
Portions Copyright (c) 2017 Pine Wu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
