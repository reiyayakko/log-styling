
# log-styling

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/log-styling/latest.svg?logo=npm)](https://www.npmjs.com/package/log-styling)
[![TypeDoc](https://img.shields.io/badge/document-TypeDoc-green.svg)](https://typedoc.org)

Tiny utility for formatting console output.

It provides an easier-to-use interface than the printf-like console.log.

See also <https://rizzzse.github.io/log-styling>.

## example

```js
import { styled, style, resetStyle, object, generic, log } from "log-styling";

const heading = (text) => styled(`
    font-size: 1.1em;
    font-weight: bold;
    text-decoration: underline;
`, `# ${text}\n`);

const bold = (text) => styled("font-weight: bold", text);

log(console.log, [
    heading("Styled text (styles can be nested)"),
    styled("color: lightgreen", [
        "Lightgreen letters.\n",
        style("color: yellow"),
        "Yellow letters.\n",
        style("background: black"),
        "Lightgreen letters on a black background.\n",
        resetStyle,
        "Lightgreen letters.\n",
        bold("Bold lightgreen letters.\n"),
    ]),
    "Unstyled letters.",
    heading("Any values"),
    object({ answer: 42, bool: true }),
    "\n",
    object(Symbol.toPrimitive),
    "\n",
    generic(/[Rr]egexp?/),
]);
```
