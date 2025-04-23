import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConsoleColor, LogLevel } from "../../src/enums";
import { Logora } from "../../src/services/logora";
import { LogoraConfig } from "../../src/models/logora.config";
import { ILogora } from "../../src/models/logora.interface";

describe("scoped logger with useColors = false", () => {
  let baseLogger: Logora;
  let scopedLogger: ILogora;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    baseLogger = new Logora({ level: LogLevel.Info, useColors: false });
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should return a new logger instance with the given scope", () => {
    scopedLogger = baseLogger.getScoped("Auth");
    scopedLogger.info("User {0} logged in", "Alice");

    const output = logSpy.mock.calls.map(call => call[0]).join("\n");
    expect(output).toContain("[Auth]");
    expect(output).toContain("Info: User Alice logged in");
  });
});

describe("scoped logger with useColors = true", () => {
  let baseLogger: Logora;
  let scopedLogger: ILogora;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    baseLogger = new Logora({ level: LogLevel.Info, useColors: true });
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should apply custom color if provided", () => {
    scopedLogger = baseLogger.getScoped("DB", ConsoleColor.Yellow);
    scopedLogger.info("Query executed");
  
    const logLine = logSpy.mock.calls
      .map(call => call[0])
      .find(line => typeof line === "string" && line.includes("Query executed"));
  
    expect(logLine).toContain(`${ConsoleColor.Yellow}[DB]${ConsoleColor.Reset}`);
  });

  it("should fallback to default scope color if none is provided", () => {
    const base = new LogoraConfig();
    const configWithCustomScopeColor = {
      ...base,
      colors: {
        ...base.colors,
        scope: ConsoleColor.Magenta
      }
    };
    baseLogger = new Logora({ ...configWithCustomScopeColor, level: LogLevel.Info, useColors: true });
    scopedLogger = baseLogger.getScoped("System");

    scopedLogger.info("System event");

    const output = logSpy.mock.calls.map(call => call[0]).join("\n");
    expect(output).toContain(`${ConsoleColor.Magenta}[System]`);
  });
});