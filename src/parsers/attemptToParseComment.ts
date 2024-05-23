import Parser from "../types/Parser";

const attemptToParseComment: Parser = (lines) => {
  if (!lines[0].startsWith("%%")) return;

  return {
    consumedLines: 1,
    node: {
      content: "",
      properties: {},
      type: "comment"
    }
  }
}

export default attemptToParseComment;
