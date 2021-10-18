import { wxmlLexer } from "./lexer";
import { wxmlParser } from "./parser";

export const parse = (text) => {
  const lexResult = wxmlLexer.tokenize(text);
  // setting a new input will RESET the parser instance's state.
  wxmlParser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  // @ts-ignore
  const cst = wxmlParser.document();
  return {
    cst: cst,
    tokenVector: lexResult.tokens,
    lexErrors: lexResult.errors,
    parseErrors: wxmlParser.errors,
  };
};

export const BaseWxmlCstVisitor = wxmlParser.getBaseCstVisitorConstructor();
