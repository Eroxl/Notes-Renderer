import React from "react";

type BoldProps = {
  content: string;
};

const Bold: React.FC<BoldProps> = (props) => {
  const { content } = props;

  return (
    <span
      className="text-nord-13 font-bold"
    >
      {content}      
    </span>
  )
};

export default Bold;
