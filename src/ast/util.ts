import type {
  CstNode,
  CstNodeLocation,
  IRecognitionException,
  ILexingError,
} from "chevrotain";

interface IEspreeError {
  column: number;
  index: number;
  lineNumber: number;
  message: string;
  stack: string;
}

/**
 * sort cst children
 */
export function sortCstChildren(ctx: Record<string, CstNode[]>): CstNode[] {
  let child: CstNode[] = [];
  let sortedChild: CstNode[] = [];
  Object.keys(ctx).forEach((key) => {
    child.push(...ctx[key]);
  });
  sortedChild = child
    .filter((node) => node.location)
    .sort((nodeA, nodeB) => {
      if (
        nodeA.location.startLine > nodeB.location.startLine ||
        (nodeA.location.startLine === nodeB.location.startLine &&
          nodeA.location.startColumn > nodeB.location.startColumn)
      ) {
        return 1;
      } else {
        return -1;
      }
    });
  return sortedChild;
}

/**
 * merge position info
 *
 * covert chevrotain-style to eslint-style
 */
export function mergeLocation(astNode, location: CstNodeLocation): void {
  Object.assign(astNode, {
    start: location.startOffset,
    end: location.endOffset,
    loc: {
      start: {
        line: location.startLine,
        column: location.startColumn,
      },
      end: {
        line: location.endLine,
        column: location.endColumn,
      },
    },
    range: [location.startOffset, location.endOffset],
  });
}

/**
 * parse inline wxs js
 */
export function parseInlineJS(astNode): void {
  let espreeParser;
  /**
   * check wxscript node contain js string
   */
  if (!astNode?.value) {
    return;
  }
  /**
   * try to load local eslint builtin espree parser
   */
  try {
    espreeParser = require("espree");
  } catch (_) {
    // ...
  }
  /**
   * then parse inline js string
   */
  if (espreeParser) {
    try {
      const espreeAst = espreeParser.parse(astNode.value, {
        loc: true,
        range: true,
        comment: true,
        ecmaVersion: 2015,
      });
      espreeAst.type = "WXScriptProgram";
      espreeAst.offset = [];
      astNode.body = espreeAst;
    } catch (e) {
      // IEspreeError
      const error = e as IEspreeError;
      const errorOffset = astNode.startTag
        ? astNode.startTag.loc.end
        : astNode.loc.start;
      astNode.error = {
        type: "WXScriptError",
        value: error.message,
        start: astNode.start,
        end: astNode.end,
        loc: {
          start: {
            line: errorOffset.line + error.lineNumber - 1,
            column:
              error.lineNumber <= 1
                ? error.column + errorOffset.column
                : error.column,
          },
          end: {
            line: errorOffset.line + error.lineNumber - 1,
            column:
              error.lineNumber <= 1
                ? error.column + errorOffset.column
                : error.column,
          },
        },
        range: [astNode.start, astNode.end],
      };
    }
  } else {
    // require local espress fail, do nothing
  }
}

/**
 * transpile Lexer error to eslint node
 */
export function convertLexerErrorToNode(error: ILexingError) {
  return {
    type: "WXLexerError",
    value: error.message,
    start: error.offset,
    end: error.offset + error.length,
    loc: {
      start: {
        line: error.line,
        column: error.column,
      },
      end: {
        line: error.line,
        column: error.column,
      },
    },
    range: [error.offset, error.length],
  };
}

/**
 * transpile Parse error to eslint node
 */
export function convertParseErrorToNode(error: IRecognitionException) {
  return {
    type: "WXParseError",
    value: error.message,
    start: error.token.startOffset,
    end: error.token.endOffset,
    loc: {
      start: {
        line: error.token.startLine,
        column: error.token.startColumn,
      },
      end: {
        line: error.token.endLine,
        column: error.token.endColumn,
      },
    },
    range: [error.token.startOffset, error.token.endOffset],
  };
}
