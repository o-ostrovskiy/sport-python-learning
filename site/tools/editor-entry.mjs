// The parts of CodeMirror 6 the game's code boxes use. tools/build-editor.mjs bundles this file into
// site/assets/vendor/codemirror/codemirror.js, one ES module served from our own site.
export { EditorState, Compartment, Transaction, Prec } from '@codemirror/state';
export { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
export { defaultKeymap, history, historyKeymap, indentWithTab, insertNewlineAndIndent } from '@codemirror/commands';
export { indentOnInput, indentUnit, bracketMatching, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
export { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
export { python } from '@codemirror/lang-python';
export { tags } from '@lezer/highlight';
