/**
 * Simple structured logger with level filtering.
 *
 * Usage:
 *   import { logger } from "./utils/logger.js";
 *   logger.info("Starting discovery…");
 *   logger.warn(`Rate limit low: ${remaining} remaining`);
 *   logger.debug("Parsed response:", data);
 *
 * Control via LOG_LEVEL env var (error | warn | info | debug).
 * Default is "info". Set to "debug" for verbose CLI output.
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function currentLevel(): number {
  const env = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  return LEVELS[env ?? "info"] ?? LEVELS.info;
}

function prefix(level: LogLevel): string {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}]`;
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (LEVELS[level] > currentLevel()) return;
  const label = prefix(level);
  if (args.length > 0) {
    // eslint-disable-next-line no-console
    console.log(label, message, ...args);
  } else {
    // eslint-disable-next-line no-console
    console.log(label, message);
  }
}

export const logger = {
  error: (message: string, ...args: unknown[]) => log("error", message, ...args),
  warn: (message: string, ...args: unknown[]) => log("warn", message, ...args),
  info: (message: string, ...args: unknown[]) => log("info", message, ...args),
  debug: (message: string, ...args: unknown[]) => log("debug", message, ...args),
};
