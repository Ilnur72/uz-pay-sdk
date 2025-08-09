import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

const logDir = join(process.cwd(), 'logs');

// Umumiy log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (Object.keys(metadata).length > 0) {
      msg += ` | ${JSON.stringify(metadata)}`;
    }

    if (stack) {
      msg += `\n${stack}`;
    }

    return msg;
  }),
);

// Console format (development uchun)
const consoleFormat = format.combine(
  format.colorize(),
  format.simple(),
  format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }),
);

// Logger yaratish
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'uz-pay-sdk' },
  transports: [
    // Console transport (development uchun)
    new transports.Console({
      format:
        process.env.NODE_ENV === 'development' ? consoleFormat : logFormat,
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),

    // Error logs - alohida fayl
    new DailyRotateFile({
      filename: join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      maxSize: '20m',
      format: logFormat,
    }),

    // Barcha loglar
    new DailyRotateFile({
      filename: join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '20m',
      format: logFormat,
    }),

    // Payment operations - alohida tracking
    new DailyRotateFile({
      filename: join(logDir, 'payments-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '90d', // To'lov loglarini ko'proq saqlaymiz
      maxSize: '20m',
      format: logFormat,
    }),
  ],
});

// Request/Response logger uchun alohida instance
export const httpLogger = createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'uz-pay-http' },
  transports: [
    new DailyRotateFile({
      filename: join(logDir, 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '50m',
      format: logFormat,
    }),
  ],
});

// Payment operations uchun specialized logger
export const paymentLogger = createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'uz-pay-payments' },
  transports: [
    new DailyRotateFile({
      filename: join(logDir, 'payment-operations-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '180d', // 6 oy saqlash
      maxSize: '100m',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf(({ timestamp, level, message, ...metadata }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...metadata,
          });
        }),
      ),
    }),
  ],
});

// Development vs Production optimizations
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
