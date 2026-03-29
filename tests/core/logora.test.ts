import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LogEntry } from "../../src/core/log-entry";
import { LogoraCore } from "../../src/core/logora";
import { LogLevel, LogType } from "../../src/enums";
import type { ILogoraOutput } from "../../src/models";

// Helper to wait for queueMicrotask flush
const waitMicrotask = (): Promise<void> =>
  new Promise<void>((resolve) => queueMicrotask(resolve));

describe("LogoraCore", () => {
  let logs: LogEntry[];
  let mockOutput: ILogoraOutput;

  beforeEach(() => {
    logs = [];

    mockOutput = {
      name: "test",
      options: {
        level: LogLevel.Debug,
      },
      writer: {
        log: vi.fn((entry: LogEntry) => logs.push(entry)),
        title: vi.fn(),
        empty: vi.fn(),
        clear: vi.fn(),
        print: vi.fn(),
      },
    };
  });

  it("should enqueue and dispatch info log", async () => {
    const logger = new LogoraCore({ outputs: [mockOutput] });

    logger.info("Hello {0}", "World");

    await waitMicrotask();

    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe("Hello {0}");
    expect(logs[0].args[0]).toBe("World");
    expect(logs[0].type).toBe(LogType.Info);
  });

  it("should respect log level filtering", async () => {
    mockOutput.options.level = LogLevel.Error;

    const logger = new LogoraCore({ outputs: [mockOutput] });

    logger.info("Should not be logged");
    await waitMicrotask();

    expect(logs.length).toBe(0);

    logger.error("Should be logged");
    await waitMicrotask();

    expect(logs.length).toBe(1);
  });

  it("should log highlight regardless of level", async () => {
    mockOutput.options.level = LogLevel.Error;

    const logger = new LogoraCore({ outputs: [mockOutput] });

    logger.highlight("Attention!");

    await waitMicrotask();

    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe(LogType.Highlight);
  });

  it("should correctly scope logs", async () => {
    const logger = new LogoraCore({ outputs: [mockOutput] }).getScoped("DB");

    logger.info("Query OK");

    await waitMicrotask();

    expect(logs[0].scope).toBe("DB");
  });

  it("should call writer.title, empty, clear, and print", async () => {
    const logger = new LogoraCore({ outputs: [mockOutput] });

    logger.title("Start");
    logger.empty(2);
    logger.clear();
    logger.print("Raw log");

    await waitMicrotask();

    expect(mockOutput.writer.title).toHaveBeenCalledWith("Start");
    expect(mockOutput.writer.empty).toHaveBeenCalledWith(2);
    expect(mockOutput.writer.clear).toHaveBeenCalled();
    expect(mockOutput.writer.print).toHaveBeenCalledWith("Raw log");
  });

  it("should call onDrop if queue is full", () => {
    const onDrop = vi.fn();

    const logger = new LogoraCore({
      outputs: [mockOutput],
      queueLimit: 1,
      onDrop,
    });

    logger["flushing"] = true;
    logger.debug("First");
    logger.debug("Second");

    expect(logs.length).toBe(0);
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop.mock.calls[0][0].message).toBe("Second");
  });

  it("should call onError if output throws", async () => {
    const onError = vi.fn();

    mockOutput.writer.log = vi.fn(() => {
      throw new Error("Output failed");
    });

    const logger = new LogoraCore({ outputs: [mockOutput], onError });

    logger.info("Test error");

    await waitMicrotask();

    expect(onError).toHaveBeenCalled();

    const [error, entry] = onError.mock.calls[0];

    expect(error).toBeInstanceOf(Error);
    expect(entry.message).toBe("Logora flush error");
  });

  it("should handle errors during flush and call onError with fallback entry", async () => {
    const onError = vi.fn();

    mockOutput.writer.log = vi.fn(() => {
      throw new Error("Output failed");
    });

    const logger = new LogoraCore({ outputs: [mockOutput], onError });

    logger.info("This will fail");

    await waitMicrotask();

    expect(onError).toHaveBeenCalledTimes(1);

    const [error, fallbackEntry] = onError.mock.calls[0];

    expect(error).toBeInstanceOf(Error);
    expect(fallbackEntry.message).toBe("Logora flush error");
    expect(fallbackEntry.type).toBe(LogType.Error);
  });

  it("should fallback to print when given invalid numeric type", async () => {
    const logger = new LogoraCore({ outputs: [mockOutput] });

    logger.log(999 as LogType, "Invalid numeric type fallback");

    await waitMicrotask();

    expect(mockOutput.writer.print).toHaveBeenCalledWith(
      "Invalid numeric type fallback",
    );
  });
});

describe("LogoraCore log level behavior", () => {
  let logs: LogEntry[];
  let mockOutput: ILogoraOutput;

  beforeEach(() => {
    logs = [];

    mockOutput = {
      name: "test-output",
      options: {},
      writer: {
        log: vi.fn((entry: LogEntry) => logs.push(entry)),
        title: vi.fn(),
        empty: vi.fn(),
        clear: vi.fn(),
        print: vi.fn(),
      },
    };
  });

  it("should use output-specific level if defined", async () => {
    mockOutput.options.level = LogLevel.Error;

    const logger = new LogoraCore({
      level: LogLevel.Debug,
      outputs: [mockOutput],
    });

    logger.info("This should be ignored");
    logger.error("This should be logged");

    await waitMicrotask();

    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe(LogType.Error);
  });

  it("should fallback to global level if output level is undefined", async () => {
    const logger = new LogoraCore({
      level: LogLevel.Info,
      outputs: [mockOutput],
    });

    logger.debug("This should be ignored");
    logger.info("This should be logged");

    await waitMicrotask();

    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe(LogType.Info);
  });
});
