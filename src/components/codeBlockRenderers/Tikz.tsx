import React from "react";

import TextNode from "src/lib/types/TextNode";

const Tikz: React.FC<{ node: TextNode }> = async (props) => {
  const { node } = props;

  const content = (node.properties.subNodes as string[])
    .join('');

  return (
    <div className="invert flex flex-row justify-center tikz-drawing"
      dangerouslySetInnerHTML={{
        __html: (
          `<script type="text/tikz">
            ${content
              .replaceAll("&nbsp;", "")
              .split("\n")
              .map(line => line.trim())
              .filter(line => line)
              .join('\n')
            }
          </script>`
        )
      }}
    />
  );
};

export default Tikz;
