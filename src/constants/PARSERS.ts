import attemptToParseCallout from "../parsers/attemptToParseCallout";
import attemptToParseComment from "../parsers/attemptToParseComment";
import attemptToParseList from "../parsers/attemptToParseList";
import attemptToParseMath from "../parsers/attemptToParseMath";
import attemptToParseQuote from "../parsers/attemptToParseQuote";
import regexParserFactory from "../parsers/regexParserFactory";
import Parser from "../types/Parser";

const PARSERS: Parser[] = [
  attemptToParseCallout,
  attemptToParseMath,
  attemptToParseQuote,
  attemptToParseList,
  attemptToParseComment,

  regexParserFactory(/^# /, 'h1'),
  regexParserFactory(/^## /, 'h2'),
  regexParserFactory(/^### /, 'h3'),
  regexParserFactory(/^#### /, 'h4'),
  regexParserFactory(/^##### /, 'h5'),
  regexParserFactory(/^###### /, 'h6'),
]

export default PARSERS;
