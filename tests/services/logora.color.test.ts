import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConsoleColor, LogLevel } from "../../src/enums";
import { Logora } from "../../src/services/logora";

describe("Logora with useColors = false", () => {
  let logger: Logora;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new Logora({ level: LogLevel.Debug, useColors: false });
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should not include ANSI color codes in output", () => {
    logger.info("User {0} logged in", "Bob");
    const logged = logSpy.mock.calls.map(call => call[0]).join("\n");

    // Check for absence of ANSI escape characters
    // eslint-disable-next-line no-control-regex
    const hasAnsi = /\x1b\[[0-9;]*m/.test(logged);
    expect(hasAnsi).toBe(false);
  });

  it("should still inject values correctly", () => {
    logger.success("Operation {0} completed with status {1}", "Sync", "OK");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Sync"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("OK"));
  });

  it("should print raw title without color codes", () => {
    logger.title("LOG START");
    const output = logSpy.mock.calls[0][0];
    expect(output).toBe("LOG START");
  });
});

describe("Logora with useColors = true (default)", () => {
  let logger: Logora;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new Logora({ level: LogLevel.Info }); // useColors defaults to true
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should include ANSI color codes in output", () => {
    logger.info("Server {0} ready", "localhost");
    const logged = logSpy.mock.calls.map(call => call[0]).join("\n");

    // Look for ANSI escape sequences like \x1b[36m or \x1b[0m
    // eslint-disable-next-line no-control-regex
    const hasAnsi = /\x1b\[[0-9;]*m/.test(logged);
    expect(hasAnsi).toBe(true);
  });

  it("should wrap dynamic values in color", () => {
    logger.info("Listening on port {0}", 4000);
  
    const output = logSpy.mock.calls
      .map(call => call[0])
      .find(line => (line as string).includes("Listening"));
  
    expect(output).toContain(ConsoleColor.Cyan);
    expect(output).toContain(ConsoleColor.Reset);
  });
});