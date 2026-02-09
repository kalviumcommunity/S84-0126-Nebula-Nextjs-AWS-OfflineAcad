/**
 * Structured Logger for CloudWatch/Azure Monitor Integration
 * Provides JSON-formatted logging with correlation IDs for distributed tracing
 * 
 * Features:
 * - Structured JSON format for searchability in CloudWatch/Azure Monitor
 * - Correlation IDs for tracing requests across services
 * - Log levels: debug, info, warn, error
 * - Performance metrics tracking
 * - Automatic timestamp and environment info
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  requestId?: string;
  service: string;
  environment: string;
  [key: string]: any;
}

interface LoggerConfig {
  requestId?: string;
  environment?: string;
}

class StructuredLogger {
  private config: LoggerConfig;

  constructor(config?: LoggerConfig) {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      ...config,
    };
  }

  /**
   * Set or update the correlation ID for request tracking
   */
  setRequestId(requestId: string): void {
    this.config.requestId = requestId;
  }

  /**
   * Get the current request ID
   */
  getRequestId(): string | undefined {
    return this.config.requestId;
  }

  /**
   * Format log entry with all required fields
   */
  private formatLog(
    level: LogLevel,
    message: string,
    meta?: Record<string, any>
  ): LogEntry {
    const logEntry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      service: 'nextjs-offline-academy',
      environment: this.config.environment as string,
    };

    // Add correlation ID if available
    if (this.config.requestId) {
      logEntry.requestId = this.config.requestId;
    }

    // Merge additional metadata
    if (meta) {
      Object.assign(logEntry, meta);
    }

    return logEntry;
  }

  /**
   * Log at DEBUG level
   */
  debug(message: string, meta?: Record<string, any>): void {
    try {
      const logEntry = this.formatLog('debug', message, meta);
      console.log(JSON.stringify(logEntry));
    } catch (error) {
      console.log(`[DEBUG] ${message}`, meta);
    }
  }

  /**
   * Log at INFO level
   */
  info(message: string, meta?: Record<string, any>): void {
    try {
      const logEntry = this.formatLog('info', message, meta);
      console.log(JSON.stringify(logEntry));
    } catch (error) {
      console.log(`[INFO] ${message}`, meta);
    }
  }

  /**
   * Log at WARN level
   */
  warn(message: string, meta?: Record<string, any>): void {
    try {
      const logEntry = this.formatLog('warn', message, meta);
      console.warn(JSON.stringify(logEntry));
    } catch (error) {
      console.warn(`[WARN] ${message}`, meta);
    }
  }

  /**
   * Log at ERROR level
   */
  error(message: string, meta?: Record<string, any>): void {
    try {
      const logEntry = this.formatLog('error', message, meta);
      console.error(JSON.stringify(logEntry));
    } catch (error) {
      console.error(`[ERROR] ${message}`, meta);
    }
  }

  /**
   * Log with performance metrics (duration in ms)
   */
  logPerformance(
    message: string,
    duration: number,
    meta?: Record<string, any>
  ): void {
    this.info(message, {
      duration_ms: duration,
      ...meta,
    });
  }

  /**
   * Create a child logger with an inherited request ID
   */
  child(meta?: Record<string, any>): StructuredLogger {
    const childLogger = new StructuredLogger({
      requestId: this.config.requestId,
      environment: this.config.environment,
    });
    return childLogger;
  }
}

// Export singleton logger instance
export const logger = new StructuredLogger();

/**
 * Helper function to create a logger instance for a request
 * @param requestId - Unique request identifier
 */
export function createRequestLogger(requestId: string): StructuredLogger {
  return new StructuredLogger({ requestId });
}
