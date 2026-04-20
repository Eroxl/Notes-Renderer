import MarkdownIt, { Options } from 'markdown-it';
import StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import hljs from 'highlight.js/lib/core';
import type Token from "markdown-it/lib/token.mjs";

import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import python3 from 'highlight.js/lib/languages/python';
import vb from 'highlight.js/lib/languages/vbnet';
import lisp from 'highlight.js/lib/languages/lisp';
import sql from 'highlight.js/lib/languages/sql';
import r from 'highlight.js/lib/languages/r';
import prolog from "highlight.js/lib/languages/prolog";

const sm213Asm = () => ({
  name: 'sm213',
  case_insensitive: true,
  keywords: {
    $pattern: '\\.?' + hljs.IDENT_RE,
    keyword: [
      'ld', 'st', 'mov', 'add', 'sub', 'and', 'inc', 'inca', 'dec', 'deca',
      'not', 'shl', 'shr', 'br', 'beq', 'bgt', 'j', 'gpc', 'halt', 'nop', 'mv',
    ],
    built_in: [
      'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
    ],
  },
  contains: [
    hljs.C_NUMBER_MODE,
    {
      scope: 'comment',
      begin: '#', end: '$'
    },
    {
      className: 'keyword',
      begin: '\\.',
      end: ' '
    },
    {
      className: "title.function",
      begin: hljs.IDENT_RE + ':',
      relevance: 0
    },
    {
      className: "title.variable",
      begin: hljs.IDENT_RE + ':',
      relevance: 0
    },
    {
      className: 'variable',
      begin: '\\$' + hljs.IDENT_RE,
      relevance: 0
    }
  ]
});


const datalog = () => ({
  name: 'datalog',
  case_insensitive: false,
  keywords: {
    $pattern: '[a-zA-Z_][a-zA-Z0-9_]*',
    keyword: [
      'not', 'in',
    ],
    built_in: [
      'count', 'sum', 'max', 'min', 'mean',
      'number', 'symbol', 'float', 'unsigned',
      'true', 'false', 'nil',
    ],
  },
  contains: [
    // Block comments
    hljs.C_BLOCK_COMMENT_MODE,
    // Line comments: % and //
    {
      scope: 'comment',
      begin: /%|\/\//,
      end: /$/,
    },
    // Souffle-style directives: .decl, .type, .input, .output, etc.
    {
      scope: 'meta',
      begin: /\.[a-zA-Z_][a-zA-Z0-9_]*/,
    },
    // String literals
    hljs.QUOTE_STRING_MODE,
    // Numbers
    hljs.C_NUMBER_MODE,
    // Rule neck operator :-
    {
      scope: 'operator',
      begin: /:-/,
      relevance: 10,
    },
    // Predicate / relation names: any identifier before '(' (upper or lower case)
    {
      scope: 'title.function',
      begin: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/,
      relevance: 0,
    },
    // Anonymous variable: bare _ wildcard
    {
      scope: 'comment',
      begin: /\b_\b/,
      relevance: 5,
    },
    // Variables: uppercase-start or _Name style, NOT followed by '('
    {
      scope: 'variable',
      begin: /\b(?:[A-Z][a-zA-Z0-9_]*|_[a-zA-Z0-9_]+)\b/,
      relevance: 0,
    },
  ]
});

hljs.registerLanguage('java', java);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('vb', vb);
hljs.registerLanguage('python', python3);
hljs.registerLanguage('lisp', lisp);
hljs.registerLanguage('r', r);
hljs.registerLanguage('sm213-asm', sm213Asm);
hljs.registerLanguage('datalog', datalog);
hljs.registerLanguage('sql', sql);

type CustomCodeblocksOpts = {
  renderers: {
    [type: string]: (
      content: string,
    ) => string
  }
};

const captureCustomCodeblock = (state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean => {
  let start = state.bMarks[startLine] + state.tShift[startLine];

  const marker = /^((?:`{3})+)/.exec(state.src.slice(start))?.[0];

  if (marker === undefined) { return false }

  if (silent) { return true }

  let nextLine = startLine;

  const old_parent = state.parentType
  const old_line_max = state.lineMax
  state.parentType = 'custom-fence' as any;

  const type = state.src.slice(start).match(`${marker}(\\S*)`)?.[1] || ''

  for (; ;) {
    nextLine++;

    if (nextLine >= endLine) break;

    start = state.bMarks[nextLine] + state.tShift[nextLine]

    const closingMarker = /^((?:`{3})+)/.exec(state.src.slice(start))?.[0];

    if (closingMarker === marker) break;
  }

  const token_o = state.push('custom_fence_open', 'div', 1)
  token_o.markup = marker;
  token_o.block = true;
  token_o.info = type;
  token_o.map = [startLine, nextLine]

  const token_i = state.push('custom_fence_content', '', 0)
  token_i.content = state.src.slice(
    state.bMarks[startLine] + state.tShift[startLine] + marker.length + type.length + 1,
    start
  )

  token_i.map = [startLine, nextLine]
  token_i.children = []

  const token_c = state.push('custom_fence_close', 'div', -1)
  token_c.markup = marker;
  token_c.block = true

  state.lineMax = nextLine
  state.line = nextLine;

  state.parentType = old_parent
  state.lineMax = old_line_max
  state.line = nextLine + 1;

  return true;
};

const mdCustomCodeblocks = (md: MarkdownIt, opts: CustomCodeblocksOpts) => {
  const renderCodeblockOpen = (
    tokens: Token[],
    index: number,
  ): string => {
    const renderer = opts.renderers[tokens[index].info]

    if (!renderer) {
      const highlightedCode = hljs.highlight(
        tokens[index + 1].content,
        { language: tokens[index].info }
      ).value

      return `<pre class="language-${tokens[index].info}"><code>${highlightedCode}</code></pre>`;
    }

    return renderer(tokens[index + 1].content);
  }

  md.block.ruler.before('fence', 'custom_fence', captureCustomCodeblock);

  md.renderer.rules['custom_fence_open'] = renderCodeblockOpen;
  md.renderer.rules['custom_fence_close'] = () => '';

  md.renderer.rules['custom_fence_content'] = () => '';
}

export default mdCustomCodeblocks;

