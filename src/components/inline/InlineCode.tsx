import React from "react";

type InlineCodeProps = {
  content: string;
};

const InlineCode: React.FC<InlineCodeProps> = (props) => {
  const { content } = props;

  return (
    <span
      className="font-mono text-sm bg-nord2/50 p-1 rounded-md"
    >
      {content}      
    </span>
  )
};

export default InlineCode;
