import { describe, it, expect } from "vitest";
import { createLogger } from "../src";
import { LogLevel } from "../src/enums";

describe("createLogger", () => {
  it("should create a logger instance", () => {
    const logger = createLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.getScoped).toBe("function");
  });

  it("should accept a custom configuration", () => {
    const logger = createLogger({ level: LogLevel.Debug });
    expect(logger).toBeDefined();
    // Bonus: tu peux vérifier indirectement en utilisant un niveau de log plus bas ensuite
    expect(typeof logger.debug).toBe("function");
  });

  it("should create independent scoped instances", () => {
    const logger = createLogger();
    const scopedLogger = logger.getScoped("TEST_SCOPE");

    expect(scopedLogger).toBeDefined();
    expect(typeof scopedLogger.info).toBe("function");
  });
});
