import React, { ReactNode } from "react";
import Bold from "./inline/Bold";
import Italic from "./inline/Italic";
import InlineMath from "./inline/InlineMath";
import Link from "next/link";

type ContentProps = {
  textContent: string
};

const parseOnRegex = (
  content: string,
  splitStr: string,
  Element: React.FC<{ content: string }>,
): (string | ReactNode)[] => {
  return content.split(splitStr)
    .map((section, index) => {
      if (index % 2 === 0) return section;

      return (
        <Element content={section} />
      )
    })
};

const renderers = [
  {
    regex: '**',
    renderer: Bold,
    parseOnSplit: true,
  },
  {
    regex: '*',
    renderer: Italic,
    parseOnSplit: true,
  },
  {
    regex: '$',
    renderer: InlineMath,
    parseOnSplit: true,
  },
  {
    regex: /\[(.*?)\]\((.*?).md\)/g,
    renderer: (match: RegExpMatchArray) => {
      if (!match[1] || !match[2]) return;

      return (
        <Link
          href={match[2]}
          className="underline text-[#5d81ac]"
        >
          {match[1]}
        </Link>
      )
    },
    parseOnSplit: false,
  },
  {
    regex: /\[\[(.*?)\]\]/g,
    renderer: (match: RegExpMatchArray) => {
      if (!match[1]) return;

      return (
        <Link
          href={match[1]}
          className="underline text-[#5d81ac]"
        >
          {match[1]}
        </Link>
      )
    },
    parseOnSplit: false,
  }
]

const Content: React.FC<ContentProps> = (props) => {
  const { textContent } = props;

  return renderers.reduce((prev, curr) => {
    return prev.flatMap((content) => {
      if (typeof content !== 'string') return content;

      if (curr.parseOnSplit) {
        return parseOnRegex(content, curr.regex as string, curr.renderer as React.FC<any>)
      }

      const matches = Array.from(content.matchAll(curr.regex as RegExp))

      const regexRenderer = (curr.renderer as (match: RegExpMatchArray) => React.ReactNode);

      let out = [];
      let offset = 0;

      matches.forEach((match) => {
        out.push(
          content.slice(offset, match.index),
          regexRenderer(match)
        )

        offset = match.index + match[0].length;
      })

      if (offset !== content.length) {
        out.push(content.slice(offset))
      };

      return out;      
    })
  }, [textContent]);

  // return (
  //   parseOnRegex(textContent, "**", Bold)
  //     .flatMap((node) => {
  //       if (typeof node === 'string') return parseOnRegex(node, "*", Italic)

  //       return node;
  //     })
  //     .flatMap((node) => {
  //       if (typeof node === 'string') return parseOnRegex(node, "$", InlineMath)

  //       return node;
  //     })
  // )
}

export default Content;
