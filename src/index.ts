import { parse as cstParse } from "./cst";
import { buildAst } from "./ast/build-ast";

function parse(code: string) {
  const { cst, tokenVector, lexErrors, parseErrors } = cstParse(code);
  return buildAst(cst, tokenVector, lexErrors, parseErrors);
}

function parseForESLint(code: string) {
  const { cst, tokenVector, lexErrors, parseErrors } = cstParse(code);
  return {
    ast: buildAst(cst, tokenVector, lexErrors, parseErrors, true),
    services: {},
    scopeManager: null,
    visitorKeys: {
      Program: ["errors", "body"]
    },
  };
}

export { parse, parseForESLint };
