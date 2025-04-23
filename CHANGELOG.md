# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2025-04-23

### Added

- New feature: `useColors` option in `LogoraConfig`  
  Allows disabling ANSI color codes in all log output. Useful in CI pipelines or log file exports where raw text is preferred.

  ```ts
  const logger = createLogora({ useColors: false });
  logger.info("Hello {0}", "world"); // No color codes
  ```

- Internal method `colorize()` to centralize ANSI color application based on config.
- Unit tests for both `useColors: true` and `false`.

### Behavior

- Color output is enabled by default (backward compatible)
- No breaking changes

---

## [1.0.0] - 2025-04-20

### Added

- Initial release of `Logora`
- Console logger with color support and templated messages
- Log levels: info, warning, success, error, debug, highlight
- Custom formatting with placeholders `{0}`, `{1}`, etc.
- Time-stamped output with configurable date and time formats
