This document specifies the core WXML AST node types

- [Primitive Type (virtual)](#primitive-type)
  - [Position](#position)
  - [WXNode](#wxnode)
- [Real Type](#real-type)
  - [Program](#program)
  - [WXLexerError](#wxlexerError)
  - [WXParseError](#wxparseError)
  - [WXScript](#wxscript)
  - [WXElement](#wxelement)
  - [WXStartTag](#wxstarttag)
  - [WXEndTag](#wxendtag)
  - [WXAttribute](#wxattribute)
  - [WXAttributeInterpolation](#wxinterpolation)
  - [WXInterpolation](#wxinterpolation)
  - [WXText](#wxtext)
  - [WXComment](#wxcomment)

## Primitive Type

### Position
```ts
interface Position {
  start: number;
  end: number;
  start: {
    line: number;
    column: number;
  },
  end: {
    line: number;
    column: number;
  },
  range: [number, number]
}
```

### WXNode
```ts
type WXNode = WXScript | WXElement | WXComment | WXText;
```

## Real Type

### Program
```ts
interface Program extends Position {
  type: "Program";
  body: WXNode[];
  comments: WXComment[];
  errors: Array<WXLexerError | WXParseError>;
  tokens: []; // placeholder for future feature
}
```

### WXLexerError
```ts
interface WXLexerError extends Position {
  type: "WXLexerError";
  value: string; // error.message
}
```

### WXParseError
```ts
interface WXParseError extends Position {
  type: "WXParseError";
  value: string; // error.message
  rawType: string; // error.name
}
```

### WXScript
```ts
interface WXScript extends Position {
  type: "WXScript",
  name: "wxs",
  startTag: WXStartTag
  endTag: WXEndTag | null
  value: string | null;
  error: WXScriptError | undefined;
  body: [WXScriptProgram] | undefined;
}
```

### WXElement
```ts
interface WXElement extends Position {
  type: "WXElement";
  name: string;
  children: WXNode[];
  startTag: WXStartTag;
  endTag: WXEndTag | null;
}
```

### WXStartTag
```ts
interface WXStartTag extends Position {
  type: "WXStartTag";
  name: string;
  attributes: WXAttribute[];
  selfClosing: boolean;
}
```

### WXEndTag
```ts
interface WXEndTag extends Position {
  type: "WXEndTag";
  name: string;
}
```

### WXAttribute
```ts
interface WXAttribute extends Position {
  type: "WXAttribute";
  key: string;
  quote: '\'' | '\"';
  value: string | null;
  rawValue: string | null;
  children: Array<WXAttributeInterpolation | WXText>;
  interpolations: WXInterpolation[];
}
```

### WXInterpolation
> same with `WXAttributeInterpolation`
```ts
interface WXInterpolation extends Position {
  type: "WXInterpolation";
  rawValue: string;
  value: string;
}
```

### WXText
```ts
interface WXText extends Position {
  type: "WXText";
  value: string;
}
```

### WXComment
> \<!-- I am a WXComment Node --\>
```ts
interface WXComment extends Position {
  type: "WXComment";
  value: string;
}
```
