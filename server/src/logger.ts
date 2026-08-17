import pino from "pino"

const environment = process.env.NODE_ENV || "development"

function resolveLevel(): string {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL
    }

    return environment === "test" ? "silent" : "info"
}

export const logger = pino({
    level: resolveLevel(),
    // Never emit the bearer token verbatim into logs.
    redact: {
        paths: ["req.headers.authorization", "*.password", "*.password_hash"],
        censor: "[REDACTED]",
    },
    // Pretty, colorized output is a dev convenience only — production emits
    // raw JSON to stdout for the platform/log aggregator to capture and parse.
    ...(environment === "development"
        ? {
              transport: {
                  target: "pino-pretty",
                  options: { colorize: true, translateTime: "SYS:standard" },
              },
          }
        : {}),
})
