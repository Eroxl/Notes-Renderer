import React from "react";
import TextNode from "src/lib/types/TextNode";
import TextBlock from "./TextBlock";

type PageProps = {
  title: string;
  content: TextNode[];
};

const Page: React.FC<PageProps> = (props) => {
  const { title, content } = props;

  return (
    <div
      className="max-w-2xl w-full mx-auto text-nord-4 overflow-scroll h-screen no-scrollbar"
    >
      <div
        className="font-bold text-4xl pb-6 pt-12"
      >
        {title}
      </div>
      <div className="pb-[200px]">
        {content.map((textNode) => (
          <TextBlock node={textNode} />
        ))}
      </div>
    </div>
  )
};

export default Page;
