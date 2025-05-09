// Simple logger implementation for consistent logging throughout the application

// Log levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Current log level - can be set via environment variable
const currentLogLevel = process.env.LOG_LEVEL 
  ? parseInt(process.env.LOG_LEVEL) 
  : LogLevel.INFO;

// Logger functions
export const logger = {
  error: (message: string, ...args: any[]) => {
    if (currentLogLevel >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (currentLogLevel >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (currentLogLevel >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};