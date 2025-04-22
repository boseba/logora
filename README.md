# @boseba/logora

[![NPM version](https://img.shields.io/npm/v/@boseba/logora?style=flat-square)](https://www.npmjs.com/package/@boseba/logora)

A lightweight and customizable logger service written in TypeScript, with support for log levels, color formatting, message templating, and timestamped output.

## Features

- Log levels: `error`, `warning`, `success`, `info`, `debug`, `highlight`
- Templated messages with placeholders (`{0}`, `{1}`, ...)
- Colored console output with customizable color schemes
- Date and time formatting per message
- Optional log filtering by level

## Installation

```bash
npm install @boseba/logora
```

Or link it locally during development:

```bash
npm install /path/to/logora
```

## 🔧 Usage

### Basic instantiation

You can create an instance of the logger using the `createLogora()` factory function:

```ts
import { createLogora, LogLevel } from '@boseba/logora';

const logger = createLogora({ level: LogLevel.Debug });

logger.success("Server is ready");
logger.debug("Debugging data: {0}", someObject);
```

Or instantiate the class directly if preferred:

```ts
import { Logora, LogLevel } from '@boseba/logora';

const logger = new Logora({ level: LogLevel.Warning });
```

### Configuration

You can pass a partial configuration object to customize the logger behavior:

```ts
const logger = createLogora({
  level: LogLevel.Info,
  colors: {
    success: ConsoleColor.Green,
    error: ConsoleColor.Red,   // red
  }
});
```

---

## Getting Started Example

Here’s a simple real-world usage of the logger in a Node.js server:

```ts
import http from 'http';
import { createLogora, LogLevel } from '@boseba/logora';

const logger = createLogora({ level: LogLevel.Debug });

const server = http.createServer((req, res) => {
  logger.info("Incoming request: {0} {1}", req.method, req.url);
  res.writeHead(200);
  res.end("Hello World");
});

server.listen(4000, () => {
  const environment = process.env.NODE_ENV || 'development';
  logger.success("Server running in {0} on port {1}...", environment, 4000);
});
```

---

## Log Levels

| Level   | Value | Description                  |
|---------|-------|------------------------------|
| `error` | 0     | Serious errors               |
| `warning` | 1   | Caution-worthy situations    |
| `success` | 2   | Positive events              |
| `info` | 3     | General info messages         |
| `debug` | 4     | Detailed internal logs       |
| `highlight` | N/A | Emphasis-only (always shown) |

You can configure the default level using:

```ts
createLogora({ level: LogLevel.Warning });
```

Only `warning` and more critical messages will be displayed.

---

## Formatting and Templates

You can use numbered placeholders (`{0}`, `{1}`, etc.) in your log messages:

```ts
logger.debug("Process took {0}ms for file {1}", 132, "report.pdf");
```

---

## Colors

Each log level outputs a colored label and message. You can override colors in the config.

---

## Structure

- `ILogora` — the interface for the logger
- `Logora` — the logger implementation
- `LogoraConfig` — default logger configuration
- `createLogora()` — factory method to build an instance

---

## License

MIT © [Sébastien Bosmans](https://github.com/boseba)
