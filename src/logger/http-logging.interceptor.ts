import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Request, Response } from 'express';
import { httpLogger, logger } from '../logger/logger.config';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || 'unknown';
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Request logini yozish
    const requestLog = {
      requestId,
      type: 'HTTP_REQUEST',
      method,
      url,
      ip,
      userAgent,
      query,
      params,
      body: this.sanitizeRequestBody(body),
      headers: this.sanitizeHeaders(headers),
      timestamp: new Date().toISOString(),
    };

    httpLogger.info('HTTP Request', requestLog);
    logger.debug(`HTTP ${method} ${url} started`, { requestId, ip });

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;

        const responseLog = {
          requestId,
          type: 'HTTP_RESPONSE',
          method,
          url,
          statusCode,
          duration,
          responseSize: JSON.stringify(data).length,
          success: statusCode < 400,
          timestamp: new Date().toISOString(),
        };

        httpLogger.info('HTTP Response', responseLog);
        logger.debug(`HTTP ${method} ${url} completed`, {
          requestId,
          statusCode,
          duration: `${duration}ms`,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        const errorLog = {
          requestId,
          type: 'HTTP_ERROR',
          method,
          url,
          statusCode,
          duration,
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        };

        httpLogger.error('HTTP Error', errorLog);
        logger.error(`HTTP ${method} ${url} failed`, {
          requestId,
          statusCode,
          duration: `${duration}ms`,
          error: error.message,
        });

        return throwError(() => error);
      }),
    );
  }

  private generateRequestId(): string {
    return `http_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = [
      'password',
      'secret',
      'key',
      'token',
      'cardNumber',
      'cvv',
      'pin',
      'authorization',
    ];

    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '*'.repeat(sanitized[field].toString().length);
      }
    }

    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = [
      'authorization',
      'x-api-key',
      'x-auth-token',
      'cookie',
    ];

    const sanitized = { ...headers };

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
