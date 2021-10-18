## VSCode Debug

Special folder for single issue fast debug with vscode

### step 1

```bash
# create a test.ts file
touch test.ts

```

```typescript
// write a simple parse issue case
import { parse, parseForESLint } from "../src";

const ast = parse(`
<wxs module="ss">
  var stylesToStr = require("./style.wxs");
  modules.exports = { s: stylesToStr };
</wxs>`);
ast; // add a break point here
```

### step 2

click VSCode's left-bottom status bar `Debug wxml-parser`, then happy debuging
