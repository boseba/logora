<p align="center">
<a href="https://www.npmjs.com/package/logora">
<img src="./assets/logora.png" height="150">
</a>
</p>

<h1 align="center">
Logora
</h1>
<p align="center">
Minimal, type-safe logging built for Node.js developers: modular, modern, and lightweight.
<p>

# Logora

[![NPM version](https://img.shields.io/npm/v/logora?style=flat-square)](https://www.npmjs.com/package/logora)
[![Coverage Status](https://coveralls.io/repos/github/boseba/logora/badge.svg?branch=main)](https://coveralls.io/github/boseba/logora?branch=main)

Logora is a lightweight, flexible, and modular logging core written in TypeScript.

It is designed to handle structured log entries asynchronously, and dispatch them to one or multiple independent output modules (such as logora-console, logora-file, or custom outputs).

## Table of Contents

- Key Principles
- Installation
- Usage
- Configuration Options
- Supported Outputs
- Creating Custom Outputs
- Philosophy
- License

## Key Principles

- Lightweight: Core logic only, no rendering or output code included.
- Flexible: Supports attaching multiple simultaneous outputs.
- Extensible: Simple interfaces for writing custom outputs.
- Non-blocking: Asynchronous dispatch using a microtask queue.
- Structured Logging: Consistent log entry format across outputs.

## Installation

```bash
npm install logora
```

Important:
Logora itself does not display anything.
You must install and configure at least one output module to see or persist logs.

Example for console output:

```bash
npm install logora-console
```

## Usage

### Basic Setup

```ts
import { createLogger } from "logora";
import { consoleOutput } from "logora-console";

const logger = createLogger({
  outputs: [consoleOutput()]
});

logger.success("Application started successfully.");
logger.info("Listening on port {0}", 3000);
```

### Scoped Logging

```ts
const dbLogger = logger.getScoped("Database");

dbLogger.warning("Connection retry {0}", 3);
dbLogger.error("Unable to connect to {0}", "primary-db");
```

Each scoped logger automatically prefixes log entries with the provided scope.

## Configuration Options

You can configure logora by passing a partial LogoraConfig object to createLogger:

```ts
import { LogLevel } from "logora";

const logger = createLogger({
  level: LogLevel.Info,
  queueLimit: 1000,
  onDrop: (entry) => {
    console.warn("Log dropped:", entry.message);
  },
  onError: (error, entry) => {
    console.error("Failed to flush log:", entry.message, error);
  },
  outputs: [ /* your output instances */ ]
});
```

### Available Log Levels

| Level    | Description                      |
|----------|----------------------------------|
| Debug    | Diagnostic details for developers |
| Info     | General application events       |
| Success  | Positive events                  |
| Warning  | Potential issues, recoverable    |
| Error    | Serious problems or failures     |
| Highlight| Emphasis-only messages           |

Highlight logs are always displayed regardless of log level.

## Supported Outputs

Logora itself is output-agnostic. You can plug in any number of output modules, for example:

- logora-console (console output with colors and timestamps)
- logora-file (file system output for logs)
- logora-remote (send logs to a remote server)

Each output module implements the ILogoraOutput interface.

You can use multiple outputs at once.

## Creating Custom Outputs

To create your own output module:

1. Implement ILogoraOutput (providing a name, options, and writer).
2. Implement the ILogoraWriter methods: log, title, empty, clear, print.

Example:

```ts
import type { ILogoraOutput, ILogoraWriter } from "logora";
import { LogLevel } from "logora";

export const customOutput = (): ILogoraOutput => ({
  name: "custom",
  options: {
    level: LogLevel.Info,
    timestampFormat: "HH:mm:ss"
  },
  writer: {
    log: (entry) => { /* render or store the entry */ },
    title: (title) => { /* handle titles */ },
    empty: (count) => { /* handle spacing */ },
    clear: () => { /* clear output if needed */ },
    print: (message) => { /* raw message */ }
  }
});
```

Outputs can filter logs individually based on their configured level.

## Philosophy

Logora was created to provide a minimal yet powerful foundation for logging ecosystems.

- No forced choices: you decide where and how logs are rendered.
- Small and efficient: optimized for performance and simplicity.
- Structured first: outputs receive fully structured log entries.
- Extensible by design: designed to grow with your project’s needs.

## License

MIT License

© Sébastien Bosmans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...
