const path = require('path');
const vscode = require('vscode');

const COMPONENT_RE = /[A-Z][A-Za-z0-9]*/;
const IMPORT_RE = /\{%\s*import\s+([A-Z][A-Za-z0-9]*)\s+from\s+"([^"]+)"\s*%\}/g;
const TAG_BEFORE_RE = /<\/?\s*$/;

const rootCache = new Map();

function ancestors(startDir, stopDir) {
  const out = [];
  let dir = startDir;
  while (true) {
    out.push(dir);
    if (dir === stopDir) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return out;
}

async function pathExists(fsPath) {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(fsPath));
    return true;
  } catch {
    return false;
  }
}

function importCandidates(rootDir, importPath) {
  const base = path.basename(importPath);
  return [
    path.join(rootDir, importPath + '.grov'),
    path.join(rootDir, importPath, base + '.grov'),
  ];
}

async function resolveImport(documentUri, importPath) {
  const folder = vscode.workspace.getWorkspaceFolder(documentUri);
  const stop = folder ? folder.uri.fsPath : path.parse(documentUri.fsPath).root;
  const start = path.dirname(documentUri.fsPath);
  const folderKey = folder ? folder.uri.fsPath : start;

  const cached = rootCache.get(folderKey);
  if (cached) {
    for (const candidate of importCandidates(cached, importPath)) {
      if (await pathExists(candidate)) return vscode.Uri.file(candidate);
    }
  }

  for (const dir of ancestors(start, stop)) {
    for (const candidate of importCandidates(dir, importPath)) {
      if (await pathExists(candidate)) {
        rootCache.set(folderKey, dir);
        return vscode.Uri.file(candidate);
      }
    }
  }
  return null;
}

function buildImportMap(text) {
  const map = new Map();
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(text)) !== null) {
    map.set(m[1], m[2]);
  }
  return map;
}

async function findComponentDefinitionLocation(uri) {
  try {
    const doc = await vscode.workspace.openTextDocument(uri);
    const text = doc.getText();
    const match = /<Component\s+[^>]*name\s*=\s*"([^"]+)"/.exec(text);
    if (match) return new vscode.Location(uri, doc.positionAt(match.index));
  } catch {
    // fall through
  }
  return new vscode.Location(uri, new vscode.Position(0, 0));
}

const definitionProvider = {
  async provideDefinition(document, position) {
    const range = document.getWordRangeAtPosition(position, COMPONENT_RE);
    if (!range) return null;
    const word = document.getText(range);
    if (!/^[A-Z]/.test(word)) return null;

    const lineStart = new vscode.Position(range.start.line, 0);
    const before = document.getText(new vscode.Range(lineStart, range.start));
    if (!TAG_BEFORE_RE.test(before)) return null;

    const importMap = buildImportMap(document.getText());
    if (!importMap.has(word)) return null;

    const uri = await resolveImport(document.uri, importMap.get(word));
    if (!uri) return null;
    return [await findComponentDefinitionLocation(uri)];
  },
};

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider({ language: 'grov' }, definitionProvider),
  );
}

function deactivate() {
  rootCache.clear();
}

module.exports = { activate, deactivate };
