import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Logora } from "../../src/services/logora";
import { LogLevel } from "../../src/enums/level.enum";

describe("Logora", () => {
  let logger: Logora;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let clearSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new Logora({ level: LogLevel.Debug });
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    clearSpy = vi.spyOn(console, "clear").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    clearSpy.mockRestore();
  });

  it("should log an info message with formatted values", () => {
    logger.info("User {0} logged in at {1}", "John", "10:00");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("John"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("10:00"));
  });

  it("should log a warning message", () => {
    logger.warning("Low disk space on {0}", "Drive C");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Warning"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Drive C"));
  });

  it("should always log an error message, regardless of log level", () => {
    logger = new Logora({ level: LogLevel.Error });
    logger.error("Unhandled exception: {0}", "NullReferenceError");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("NullReferenceError"));
  });

  it("should not log a debug message if level is set to Info", () => {
    logger = new Logora({ level: LogLevel.Info });
    logger.debug("This should not appear");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should log a success message", () => {
    logger.success("Process {0} completed successfully", "Backup");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Success"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Backup"));
  });

  it("should log a highlight message", () => {
    logger.highlight("!!! {0} !!!", "CRITICAL");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("CRITICAL"));
  });

  it("should print a title with correct styling", () => {
    logger.title("APP STARTED");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("APP STARTED"));
  });

  it("should print an empty line", () => {
    logger.empty(2);
    expect(logSpy).toHaveBeenCalledWith("\n");
  });

  it("should clear the console", () => {
    logger.clear();
    expect(clearSpy).toHaveBeenCalled();
  });

  it("should print a raw formatted message with print()", () => {
    logger.print("Hello {0}", "world");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Hello"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("world"));
  });

  it("should include timestamp and format on log", () => {
    logger = new Logora({ level: LogLevel.Info, useColors: false }); // désactive les couleurs
    logger.info("Test timestamp");
  
    const logCall = logSpy.mock.calls.find(call => (call[0] as string).includes("Test timestamp"));
    expect(logCall?.[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/); // [HH:mm:ss]
  });
});
