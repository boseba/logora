import { ILogoraOutputOptions } from "./logora-output-options.interface";
import { ILogoraWriter } from "../core/logora-writer.interface";

/**
 * Represents a log output transport in the Logora system.
 * Outputs are responsible for receiving log entries from the core logger,
 * applying their own filtering and formatting logic, and rendering the result.
 */
export interface ILogoraOutput {
  /**
   * Unique name identifying the output (e.g., "console", "file", "remote").
   * Useful for debugging or selecting outputs programmatically.
   */
  name: string;

  /**
   * Output-specific configuration including log level and timestamp format.
   * These settings override global defaults for this particular transport.
   */
  options: ILogoraOutputOptions;

  /**
   * Implementation of the writer interface used to render log events.
   * The writer handles formatting, title sections, clearing, and printing.
   */
  writer: ILogoraWriter;
}
