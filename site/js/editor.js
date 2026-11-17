// The code box of a play: CodeMirror 6 (assets/vendor/codemirror, built by tools/build-editor.mjs), served from our own site.
// Python colours, line numbers, a 4-space indent after a line ending in ":", matching brackets and quotes.
// Kept from the old plain box: Shift + Enter runs, Tab puts 4 spaces, no autocorrect, curly quotes become straight ones.
// Escape and then Tab moves the focus out of the box, so keyboard users are never trapped.
import {
  EditorState, Transaction, Prec, EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine,
  defaultKeymap, history, historyKeymap, indentWithTab, indentOnInput, indentUnit, bracketMatching,
  syntaxHighlighting, HighlightStyle, closeBrackets, closeBracketsKeymap, python, tags as t,
} from '../assets/vendor/codemirror/codemirror.js';

// The same few colours as the rest of the site.
const colors = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword], color: '#ff9f1c', fontWeight: '700' },
  { tag: [t.string, t.special(t.string)], color: '#7ee2a8' },
  { tag: [t.number, t.bool, t.null], color: '#ffc83d' },
  { tag: t.comment, color: '#8fa3c4', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.standard(t.variableName)], color: '#7fc4ff' },
  { tag: [t.operator, t.compareOperator, t.arithmeticOperator], color: '#ff9cc0' },
]);
const theme = EditorView.theme({
  '&': { backgroundColor: '#10203a', color: '#e9f1ff', borderRadius: '14px', fontSize: '16px', outline: '3px solid transparent' },
  '&.cm-focused': { outline: '3px solid #ff9f1c' },
  // No ligatures: a child who types >= must see >= on the screen, not one ≥ sign they cannot find on the keyboard.
  '.cm-scroller': { fontFamily: '"JetBrains Mono", monospace', fontVariantLigatures: 'none', lineHeight: '1.55', padding: '10px 0' },
  '.cm-content': { caretColor: '#ffc83d', padding: '0 14px 0 4px' },
  '.cm-cursor, .cm-dropCursor': { borderLeft: '2px solid #ffc83d' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none', color: '#5f7397', paddingLeft: '8px' },
  '.cm-activeLine': { backgroundColor: '#ffffff0a' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#c3d2ee' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: '#3a5a94' },
  '.cm-matchingBracket': { backgroundColor: '#ffc83d33', outline: '1px solid #ffc83d', borderRadius: '3px' },
  '.cm-nonmatchingBracket': { backgroundColor: '#ff5a4f55' },
}, { dark: true });

// Tablets like to turn " and ' into curly quotes, which Python cannot read: put the straight ones back.
// Each curly quote becomes one straight one, so every position (and the cursor) stays where it was.
const CURLY = /[“”„‘’]/;
const straight = s => s.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'");
const straightQuotes = EditorState.transactionFilter.of(tr => {
  if (!tr.docChanged) return tr;
  let curly = false;
  tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => { if (CURLY.test(inserted.toString())) curly = true; });
  if (!curly) return tr;
  const changes = [];
  tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => changes.push({ from: fromA, to: toA, insert: straight(inserted.toString()) }));
  return { changes, selection: tr.selection, effects: tr.effects, scrollIntoView: tr.scrollIntoView,
    annotations: Transaction.userEvent.of(tr.annotation(Transaction.userEvent) || 'input') };
});

// Makes a code box inside parent. onRun: Shift + Enter. onChange: after every change of the text.
// Returns { value, setValue(text), focus() }.
export function codeEditor(parent, code, { label, onRun, onChange }) {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: code,
      extensions: [
        Prec.highest(keymap.of([{ key: 'Shift-Enter', run: () => { onRun(); return true; } }])),
        lineNumbers(), history(), drawSelection(), highlightActiveLine(),
        indentOnInput(), bracketMatching(), closeBrackets(),
        indentUnit.of('    '), EditorState.tabSize.of(4),
        python(), syntaxHighlighting(colors), theme, straightQuotes,
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.contentAttributes.of({ autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': label }),
        EditorView.updateListener.of(u => { if (u.docChanged) onChange(); }),
      ],
    }),
  });
  return {
    get value() { return view.state.doc.toString(); },
    setValue(text) { view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }); },
    focus() { view.focus(); },
  };
}
