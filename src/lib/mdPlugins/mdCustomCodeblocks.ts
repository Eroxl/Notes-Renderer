import MarkdownIt, { Options } from 'markdown-it';
import StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import type Renderer from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";

type CustomCodeblocksOpts = {
  renderers: {
    [type: string]: (
      tokens: Token[],
      index: number,
      options: Options,
      env: unknown,
      slf: Renderer,
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

  const token_o = state.push('custom_fence_open', 'div', 1)
  token_o.markup = marker;
  token_o.block = true;
  token_o.info = type;

  let contentStart = start + marker.length + type.length + 1;

  for (; ;) {
    nextLine++;

    if (nextLine >= endLine) break;

    start = state.bMarks[nextLine] + state.tShift[nextLine]

    const closingMarker = /^((?:`{3})+)/.exec(state.src.slice(start))?.[0];

    if (closingMarker === undefined) continue;

    if (closingMarker === marker) break;

    // ~ Nested Code Block
    const token_i = state.push('custom_fence_content', '', 0);
    token_i.content = state.src.slice(
      contentStart,
      start
    )
    token_i.children = []
    token_i.map = [startLine, nextLine]


    captureCustomCodeblock(state, nextLine, endLine, false);

    nextLine = state.line

    contentStart = state.bMarks[state.line + 1] + state.tShift[state.line + 1];
  }

  token_o.map = [startLine, nextLine]

  const token_i = state.push('custom_fence_content', '', 0)
  token_i.content = state.src.slice(
    contentStart,
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
    options: Options,
    env: unknown,
    slf: Renderer,
  ): string => {
    const renderer = opts.renderers[tokens[index].info]

    if (!renderer) return `<div type="${tokens[index].info}">`;

    return `<div type="${tokens[index].info}">${renderer(tokens, index, options, env, slf)}`
  }

  md.block.ruler.before('fence', 'custom_fence', captureCustomCodeblock);

  md.renderer.rules['custom_fence_open'] = renderCodeblockOpen;
  md.renderer.rules['custom_fence_close'] = () => '</div>';

  md.renderer.rules['custom_fence_content'] = () => '';
}

export default mdCustomCodeblocks;

