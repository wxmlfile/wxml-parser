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

export const tokensDictionary = {} as Record<string, TokenType>;

function createToken(options) {
  const newTokenType = createTokenOrg(options);
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
  push_mode: "WXS_INSIDE",
});

const COMMENT = createToken({
  name: "COMMENT",
  pattern: /<!--(.|\r?\n)*?-->/,
  line_breaks: true,
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

const TEXT = createToken({ name: "TEXT", pattern: /((?!(<|\{\{)).)+/ });

const INTPN = createToken({ name: "INTPN", pattern: /((?!('|"|\}\})).)+/ });

const WXS_REG = /([^]*?)(?=<\/(( |\t|\n|\r\n)*)wxs(( |\t|\n|\r\n)*)>)/;

const WXS_END = createToken({
  name: "WXS_END",
  pattern: /(?=<\/(( |\t|\n|\r\n)*)wxs(( |\t|\n|\r\n)*))>/,
  pop_mode: true,
});
const WXS_CLOSE = createToken({
  name: "WXS_CLOSE",
  pattern: /(?!<\/(( |\t|\n|\r\n)*)wxs(( |\t|\n|\r\n)*))>/,
  push_mode: "WXS_CONTENT",
  longer_alt: WXS_END,
});
const WXS_SLASH_CLOSE = createToken({
  name: "WXS_SLASH_CLOSE",
  pattern: /<\/(( |\t|\n|\r\n)*)wxs(( |\t|\n|\r\n)*)>/,
  pop_mode: true,
});

const WXS_TEXT = createToken({
  name: "WXS_TEXT",
  pattern: WXS_REG,
  line_breaks: true,
});

const INLINE_WXS_TEXT = createToken({
  name: "INLINE_WXS_TEXT",
  pattern: WXS_REG,
  line_breaks: true,
  pop_mode: true,
});

const CLOSE = createToken({ name: "CLOSE", pattern: />/, pop_mode: true });

const SLASH_CLOSE = createToken({
  name: "SLASH_CLOSE",
  pattern: /\/>/,
  pop_mode: true,
});

const SLASH = createToken({ name: "SLASH", pattern: /\// });

const STRING = createToken({
  name: "STRING",
  pattern: /"[^"]*"|'[^']*'/,
});

const MUSTACHE_LEFT = createToken({
  name: "MUSTACHE_LEFT",
  pattern: /\{\{/,
  push_mode: "INTPN_INSIDE",
});

const MUSTACHE_LEFT_IN_QUOTE = createToken({
  name: "MUSTACHE_LEFT_IN_QUOTE",
  pattern: /\{\{/,
  push_mode: "INTPN_IN_QUOTE",
});

const MUSTACHE_RIGHT = createToken({
  name: "MUSTACHE_RIGHT",
  pattern: /\}\}/,
  pop_mode: true,
});

const MUSTACHE_RIGHT_IN_QUOTE = createToken({
  name: "MUSTACHE_RIGHT_IN_QUOTE",
  pattern: /\}\}/,
  pop_mode: true,
});

const EQUALS = createToken({ name: "EQUALS", pattern: /=/ });

const NAME = createToken({ name: "NAME", pattern: makePattern`${f.Name}` });

const SPACE = createToken({
  name: "SPACE",
  pattern: /[ \t\r\n]/,
  group: Lexer.SKIPPED,
});

const PURE_STRING = createToken({
  name: "PURE_STRING",
  pattern: /"[^"^\{\{]*"|'[^'^\{\{]*'/,
});

const PURE_STRING_IN_DOUBLE_QUOTE = createToken({
  name: "PURE_STRING_IN_DOUBLE_QUOTE",
  pattern: /[^"^\{\{^\}\}]+/,
});

const PURE_STRING_IN_SINGLE_QUOTE = createToken({
  name: "PURE_STRING_IN_SINGLE_QUOTE",
  pattern: /[^'^\{\{^\}\}]+/,
});

const DOUBLE_QUOTE_START = createToken({
  name: "DOUBLE_QUOTE_START",
  pattern: /"/,
  push_mode: "DOUBLE_QUOTE_STR_INSIDE",
});

const DOUBLE_QUOTE_END = createToken({
  name: "DOUBLE_QUOTE_END",
  pattern: /"/,
  pop_mode: true,
});

const SINGLE_QUOTE_START = createToken({
  name: "SINGLE_QUOTE_START",
  pattern: /'/,
  push_mode: "SINGLE_QUOTE_STR_INSIDE",
});

const SINGLE_QUOTE_END = createToken({
  name: "SINGLE_QUOTE_END",
  pattern: /'/,
  pop_mode: true,
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
      TEXT,
      MUSTACHE_LEFT,
      WXS_TEXT,
    ],
    INTPN_INSIDE: [MUSTACHE_RIGHT, INTPN, SEA_WS, STRING],
    DOUBLE_QUOTE_STR_INSIDE: [
      DOUBLE_QUOTE_END,
      MUSTACHE_LEFT_IN_QUOTE,
      PURE_STRING_IN_DOUBLE_QUOTE,
      SEA_WS,
    ],
    SINGLE_QUOTE_STR_INSIDE: [
      SINGLE_QUOTE_END,
      MUSTACHE_LEFT_IN_QUOTE,
      PURE_STRING_IN_SINGLE_QUOTE,
      SEA_WS,
    ],
    INTPN_IN_QUOTE: [MUSTACHE_RIGHT_IN_QUOTE, INTPN, STRING, SEA_WS],
    INSIDE: [
      COMMENT,
      INVALID_SLASH_OPEN,
      INVALID_OPEN_INSIDE,
      CLOSE,
      SLASH_CLOSE,
      SLASH,
      EQUALS,
      PURE_STRING,
      DOUBLE_QUOTE_START,
      SINGLE_QUOTE_START,
      NAME,
      SPACE,
    ],
    WXS_INSIDE: [
      WXS_SLASH_CLOSE,
      WXS_CLOSE,
      SLASH_CLOSE,
      SLASH,
      EQUALS,
      PURE_STRING,
      DOUBLE_QUOTE_START,
      SINGLE_QUOTE_START,
      NAME,
      SPACE,
      WXS_END,
    ],
    WXS_CONTENT: [INLINE_WXS_TEXT],
  },
};

export const wxmlLexer = new Lexer(wxmlLexerDefinition, {
  positionTracking: "full",
  ensureOptimizations: false,
  lineTerminatorCharacters: ["\n"],
  lineTerminatorsPattern: /\n|\r\n/g,
});
