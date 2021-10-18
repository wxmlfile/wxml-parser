import { createToken as createTokenOrg, Lexer } from "chevrotain";
import type { TokenType } from "chevrotain";

// A little mini DSL for easier lexer definition.
const fragments = {};
const f: Record<string, any> = fragments;

function FRAGMENT(name, def) {
  fragments[name] = typeof def === "string" ? def : def.source;
}

function makePattern(strings, ...args) {
  let combined = "";
  for (let i = 0; i < strings.length; i++) {
    combined += strings[i];
    if (i < args.length) {
      let pattern = args[i];
      combined += `(?:${pattern})`;
    }
  }
  return new RegExp(combined);
}

const tokensArray = [];
export const tokensDictionary = {} as Record<string, TokenType>;

function createToken(options) {
  const newTokenType = createTokenOrg(options);
  tokensArray.push(newTokenType);
  tokensDictionary[options.name] = newTokenType;
  return newTokenType;
}

FRAGMENT(
  "NameStartChar",
  "(:|[a-zA-Z]|_|\\u2070-\\u218F|\\u2C00-\\u2FEF|\\u3001-\\uD7FF|\\uF900-\\uFDCF|\\uFDF0-\\uFFFD)"
);
FRAGMENT(
  "NameChar",
  makePattern`${f.NameStartChar}|-|\\.|\\d|\\u00B7||[\\u0300-\\u036F]|[\\u203F-\\u2040]`
);
FRAGMENT("Name", makePattern`${f.NameStartChar}(${f.NameChar})*`);

const WXS_START = createToken({
  name: "WXS_START",
  pattern: /<wxs/,
  push_mode: "INSIDE"
});


const COMMENT = createToken({
  name: "COMMENT",
  pattern: /<!--(.|\r?\n)*?-->/,
  line_breaks: true
});

/**
 * https://stackoverflow.com/questions/41090129/what-does-sea-ws-stands-for-in-antlr-grammar
 *
 * white space
 */
const SEA_WS = createToken({
  name: "SEA_WS",
  pattern: /( |\t|\n|\r\n)+/,
});

const SLASH_OPEN = createToken({
  name: "SLASH_OPEN",
  pattern: /<\//,
  push_mode: "INSIDE",
});

const INVALID_SLASH_OPEN = createToken({
  name: "INVALID_SLASH_OPEN",
  pattern: /<\//,
  categories: [SLASH_OPEN],
});

const OPEN = createToken({ name: "OPEN", pattern: /</, push_mode: "INSIDE" });

const INVALID_OPEN_INSIDE = createToken({
  name: "INVALID_OPEN_INSIDE",
  pattern: /</,
  categories: [OPEN],
});

const TEXT = createToken({ name: "TEXT", pattern: /[^<]+/ });

const WXS_TEXT = createToken({ name: "WXS_TEXT", pattern: /[^]+?(?=<\/wxs>)/, line_breaks: true });

const CLOSE = createToken({ name: "CLOSE", pattern: />/, pop_mode: true });

const SLASH_CLOSE = createToken({
  name: "SLASH_CLOSE",
  pattern: /\/>/,
  pop_mode: true,
});

const SLASH = createToken({ name: "SLASH", pattern: /\// });

const STRING = createToken({
  name: "STRING",
  pattern: /"[^<"]*"|'[^<']*'/,
});

const EQUALS = createToken({ name: "EQUALS", pattern: /=/ });

const NAME = createToken({ name: "NAME", pattern: makePattern`${f.Name}` });

const SPACE = createToken({
  name: "SPACE",
  pattern: /[ \t\r\n]/,
  group: Lexer.SKIPPED,
});

const wxmlLexerDefinition = {
  defaultMode: "OUTSIDE",

  modes: {
    OUTSIDE: [
      WXS_START,
      COMMENT,
      SEA_WS,
      SLASH_OPEN,
      OPEN,
      WXS_TEXT,
      TEXT,
    ],
    INSIDE: [
      // Tokens from `OUTSIDE` to improve error recovery behavior
      COMMENT,
      INVALID_SLASH_OPEN,
      INVALID_OPEN_INSIDE,
      // "Real" `INSIDE` tokens
      CLOSE,
      SLASH_CLOSE,
      SLASH,
      EQUALS,
      STRING,
      NAME,
      SPACE,
    ],
  },
};

export const wxmlLexer = new Lexer(wxmlLexerDefinition, {
  positionTracking: "full",
  ensureOptimizations: false,
  lineTerminatorCharacters: ["\n"],
  lineTerminatorsPattern: /\n|\r\n/g,
});
