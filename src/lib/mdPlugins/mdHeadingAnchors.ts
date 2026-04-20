import MarkdownIt from 'markdown-it';
import { cleanURL } from '../getValidNotes';

const mdHeadingAnchors = (md: MarkdownIt) => {
  md.core.ruler.push('heading_anchors', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open') {
        const inlineToken = tokens[i + 1];
        if (inlineToken?.type === 'inline') {
          const text = inlineToken.children
            ?.filter((t) => t.type === 'text' || t.type === 'code_inline' || t.type === 'math_inline')
            .map((t) => t.content)
            .join('') ?? '';
          tokens[i].attrSet('id', cleanURL(text));
        }
      }
    }
  });
};

export default mdHeadingAnchors;
