import type { CstNode } from "chevrotain";
import { CstParser } from "chevrotain";
import { tokensDictionary as t } from "./lexer";

type IRule = (idx: number) => CstNode;

class Parser extends CstParser {
  wxs: IRule;
  element: IRule;
  comment: IRule;
  chardata: IRule;
  attribute: IRule;
  content: IRule;
  wxscontent: IRule;
  interpolation: IRule;

  constructor() {
    super(t, {
      maxLookahead: 1,
      recoveryEnabled: true,
      nodeLocationTracking: "full",
    });

    const $ = this;

    $.RULE("document", () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.wxs) },
          { ALT: () => $.SUBRULE($.element) },
          { ALT: () => $.SUBRULE($.comment) },
          { ALT: () => $.SUBRULE($.chardata) },
          { ALT: () => $.SUBRULE($.interpolation) },
        ]);
      });
    });

    $.RULE("content", () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.wxs) },
          { ALT: () => $.SUBRULE($.element) },
          { ALT: () => $.SUBRULE($.interpolation) },
          { ALT: () => $.SUBRULE($.chardata) },
          { ALT: () => $.SUBRULE($.comment) },
        ]);
      });
    });

    $.RULE("comment", () => {
      $.CONSUME(t.COMMENT);
    });

    $.RULE("wxs", () => {
      $.CONSUME(t.WXS_START);
      $.MANY(() => {
        $.SUBRULE($.attribute);
      });
      $.OR([
        {
          ALT: () => {
            $.CONSUME(t.CLOSE, {
              LABEL: "START_CLOSE",
              ERR_MSG: "wxs element missing close '>'",
            });
            $.OPTION(() => {
              $.SUBRULE($.wxscontent);
            });
            $.CONSUME(t.SLASH_OPEN, {
              ERR_MSG: "wxs element missing slash open '</'",
            });
            $.CONSUME2(t.NAME, {
              LABEL: "END_NAME",
              ERR_MSG: "wxs element missing end tag name",
            });
            $.CONSUME2(t.CLOSE, {
              LABEL: "END",
              ERR_MSG: "wxs element missing end close '>'",
            });
          },
        },
        {
          ALT: () => {
            $.CONSUME(t.SLASH_CLOSE, {
              ERR_MSG: "wxs element missing slash close '/>'",
            });
          },
        },
      ]);
    });

    $.RULE("interpolation", () => {
      $.CONSUME(t.MUSTACHE_LEFT);
      $.MANY(() => {
        $.OR([
          { ALT: () => $.CONSUME(t.INTPN) },
          {
            ALT: () =>
              $.CONSUME(t.STRING, {
                ERR_MSG: "wx interpolation unexpected string",
              }),
          },
          { ALT: () => $.CONSUME(t.SEA_WS) },
        ]);
      });
      $.CONSUME(t.MUSTACHE_RIGHT, {
        ERR_MSG: "wx interpolation unexpected end",
      });
    });

    $.RULE("element", () => {
      $.CONSUME(t.OPEN);
      $.CONSUME(t.NAME);
      $.MANY(() => {
        $.SUBRULE($.attribute);
      });

      $.OR([
        {
          ALT: () => {
            $.CONSUME(t.CLOSE, {
              LABEL: "START_CLOSE",
              ERR_MSG: "wx element missing close '>'",
            });
            $.SUBRULE($.content);
            $.CONSUME(t.SLASH_OPEN, {
              ERR_MSG: "wx element missing slash open '</'",
            });
            $.CONSUME2(t.NAME, {
              LABEL: "END_NAME",
              ERR_MSG: "wx element missing end tag name",
            });
            $.CONSUME2(t.CLOSE, {
              LABEL: "END",
              ERR_MSG: "wx element missing end close '>'",
            });
          },
        },
        {
          ALT: () => {
            $.CONSUME(t.SLASH_CLOSE, {
              ERR_MSG: "wx element missing slash close '/>'",
            });
          },
        },
      ]);
    });

    $.RULE("attribute", () => {
      $.CONSUME(t.NAME);
      $.OPTION(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(t.EQUALS);
              $.CONSUME(t.STRING, { ERR_MSG: "wx attributes missing value" });
            },
          },
        ]);
      });
    });

    $.RULE("chardata", () => {
      $.OR([
        { ALT: () => $.CONSUME(t.TEXT) },
        { ALT: () => $.CONSUME(t.SEA_WS) },
      ]);
    });

    $.RULE("wxscontent", () => {
      $.MANY(() => {
        $.CONSUME(t.SEA_WS);
      });
      $.OPTION(() => {
        $.CONSUME(t.WXS_TEXT);
      });
    });

    this.performSelfAnalysis();
  }
}

// reuse same parser instance
export const wxmlParser = new Parser();
