import React from "react";

type ItalicProps = {
  content: string;
};

const Italic: React.FC<ItalicProps> = (props) => {
  const { content } = props;

  return (
    <span
      className="italic"
    >
      {content}      
    </span>
  )
};

export default Italic;
