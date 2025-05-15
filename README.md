[![](https://img.shields.io/npm/v/loganite/latest?style=flat-square)](http://npmjs.com/package/loganite)

# `new Logger( context, level )`
This micro-package provides a minimalist logging solution with support for node, typescript, and the browser.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/loganite?style=flat-square)](https://github.com/mjbrisebois/loganite/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/loganite?style=flat-square)](https://github.com/mjbrisebois/loganite/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/loganite?style=flat-square)](https://github.com/mjbrisebois/loganite/pulls)


## Install

```bash
npm i loganite
```

## Usage

### Basic
```javascript
import { Logger } from 'loganite';

const log = new Logger("main", "debug");

log.fatal("Testing");
log.error("Testing");
log.warn("Testing");
log.normal("Testing");
log.info("Testing");
log.debug("Testing");
log.trace("Testing"); // would not log
```

### Browser console control

```javascript
window.localStorage.setItem("LOG_COLOR", "false"); // turn off coloring
window.localStorage.setItem("LOG_LEVEL", "debug"); // set default level to "debug"
```

## Planned features

- Avoid expensive arg computations
  - Short-circuit using logical operators
  - Callback function for args that only evaluate when a message will be logged
