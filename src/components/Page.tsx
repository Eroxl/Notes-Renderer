import React from "react";
import TextNode from "src/lib/types/TextNode";
import TextBlock from "./TextBlock";
import PageMetadata from "./PageMetadata";

type PageProps = {
  title: string;
  content: TextNode[];
  metadata?: Record<string, unknown>,
};

const Page: React.FC<PageProps> = (props) => {
  const { title, content, metadata } = props;

  return (
    <div
      className="max-w-2xl w-full mx-auto text-nord-4 overflow-y-scroll overflow-x-hidden h-screen no-scrollbar p-10"
    >
      <div
        className="font-bold text-4xl pb-6 pt-12"
      >
        {title}
      </div>

      {metadata && <PageMetadata metadata={metadata} />}

      <div className="pb-[200px]">
        {content.map((textNode) => (
          <TextBlock node={textNode} />
        ))}
      </div>
    </div>
  )
};

export default Page;
