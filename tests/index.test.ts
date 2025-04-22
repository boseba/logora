import { describe, it, expect } from "vitest";
import { createLogora } from "../src";
import { LogLevel } from "../src/enums/level.enum";
import { ILogora } from "../src/models/logora.interface";
import { Logora } from "../src/services/logora";

describe("createLogora", () => {
  it("should return an instance of Logora", () => {
    const logger = createLogora();
    expect(logger).toBeInstanceOf(Logora);
  });

  it("should respect the provided config", () => {
    const logger = createLogora({ level: LogLevel.Debug }) as Logora;
    expect(logger["config"].level).toBe(LogLevel.Debug); // or logger['_config'].level if private
  });

  it("should return an object implementing ILogora", () => {
    const logger: ILogora = createLogora();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.clear).toBe("function");
  });
});
