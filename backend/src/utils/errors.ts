/**
 * Error Handling & Logging
 */

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

/**
 * Logger class
 */
export class Logger {
  private name: string;
  private level: LogLevel;

  constructor(name: string, level: LogLevel = LogLevel.INFO) {
    this.name = name;
    this.level = level;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const levelValue = Object.values(LogLevel).indexOf(level);
    const minLevelValue = Object.values(LogLevel).indexOf(this.level);

    if (levelValue >= minLevelValue) {
      const logMessage = `[${timestamp}] [${this.name}] [${level}] ${message}`;
      const logData = data ? JSON.stringify(data, null, 2) : '';

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, logData);
          break;
        case LogLevel.INFO:
          console.info(logMessage, logData);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, logData);
          break;
        case LogLevel.ERROR:
          console.error(logMessage, logData);
          break;
        case LogLevel.FATAL:
          console.error(logMessage, logData);
          break;
      }
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  fatal(message: string, data?: any): void {
    this.log(LogLevel.FATAL, message, data);
  }
}

/**
 * Custom Error Classes
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, true);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, false);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Result class for success/failure handling
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly value?: T;
  public readonly error?: Error;

  private constructor(isSuccess: boolean, value?: T, error?: Error) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.value = value;
    this.error = error;

    Object.freeze(this);
  }

  public static success<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  public static failure<U>(error: Error): Result<U> {
    return new Result<U>(false, undefined, error);
  }

  public static try<U>(fn: () => U): Result<U> {
    try {
      return Result.success(fn());
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  public getValueOrThrow(): T {
    if (this.isSuccess && this.value !== undefined) {
      return this.value;
    }
    throw this.error;
  }

  public getValueOrDefault(defaultValue: T): T {
    return this.isSuccess && this.value !== undefined ? this.value : defaultValue;
  }
}

/**
 * Error handler middleware for Express
 */
export const errorHandler = (
  err: Error,
  req: any,
  res: any,
  next: any
) => {
  const logger = new Logger('ErrorHandler');

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
    });
  }
};

export default {
  Logger,
  LogLevel,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  Result,
  errorHandler,
};
