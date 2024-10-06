import createTextRenderer from "src/components/factories/createTextRenderer";
import TextNode from "../types/TextNode";
import Callout from "src/components/Callout";
import Math from "src/components/Math";
import List from "src/components/List";
import CodeBlock from "src/components/CodeBlock";
import Embed from "src/components/Embed";
import Table from "src/components/Table";

const renderers = {
  text: createTextRenderer('my-4'),

  h1: createTextRenderer('my-4 text-nord-11 font-semibold text-[1.5rem]'),
  h2: createTextRenderer('my-4 text-nord-12 font-semibold text-[1.25rem]'),
  h3: createTextRenderer('my-4 text-nord-13 font-semibold text-[1.125rem]'),
  h4: createTextRenderer('my-4 text-nord-14 font-semibold text-[1.0rem]'),
  h5: createTextRenderer('my-4 text-nord-9 font-semibold text-[0.875rem]'),
  h6: createTextRenderer('my-4 text-nord-15 text-[0.85rem]'),
  
  quote: createTextRenderer('border-l-2 border-nord-3 pl-3 text-[#9eafcc] my-4'),
  callout: Callout,

  math: Math,
  list: List,

  codeblock: CodeBlock,
  embed: Embed,
  table: Table,
} as Record<string, React.FC<{ node: TextNode }>>

export default renderers;
