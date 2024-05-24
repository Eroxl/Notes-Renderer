import React from "react";

type ContentProps = {
  textContent: string
};

const Content: React.FC<ContentProps> = (props) => {
  const { textContent } = props;

  return textContent;
}

export default Content;
