import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);
  private readonly excludedPaths = [
    '/dev/api/v1/health/readiness',
    '/dev/api/v1/health/liveness',
  ];
  private readonly excludedHeaders = [
    'user-agent',
    'accept-language',
    'accept-encoding',
    'connection',
    'upgrade-insecure-requests',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'sec-fetch-user',
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-forwarded-host',
    'x-forwarded-port',
    'if-none-match',
    'sec-gpc',
    'dnt',
    'cache-control',
    'cookie',
    'priority',
    'host',
    'accept',
    'cloudfront-forwarded-proto',
    'cloudfront-is-android-viewer',
    'cloudfront-is-desktop-viewer',
    'cloudfront-is-ios-viewer',
    'cloudfront-is-mobile-viewer',
    'cloudfront-is-smarttv-viewer',
    'cloudfront-is-tablet-viewer',
    'cloudfront-viewer-address',
    'cloudfront-viewer-asn',
    'cloudfront-viewer-city',
    'cloudfront-viewer-country',
    'cloudfront-viewer-country-name',
    'cloudfront-viewer-country-region',
    'cloudfront-viewer-country-region-name',
    'cloudfront-viewer-http-version',
    'cloudfront-viewer-latitude',
    'cloudfront-viewer-longitude',
    'cloudfront-viewer-time-zone',
    'cloudfront-viewer-tls',
    'content-type',
    'origin',
    'referer',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'x-amz-cf-id',
    'x-amzn-trace-id',
    'x-amzn-apigateway-api-id',
    'content-length',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, params, query, headers } = req;

    if (this.shouldExcludePath(originalUrl)) {
      next();
      return;
    }

    const sanitizedHeaders = { ...headers };
    this.excludedHeaders.forEach((header) => {
      if (sanitizedHeaders[header]) {
        delete sanitizedHeaders[header];
      }
    });

    if (sanitizedHeaders['authorization']) {
      sanitizedHeaders['authorization'] = '***';
    }

    this.logger.log(
      `[${method}] ${originalUrl} - Body: ${JSON.stringify(
        body,
      )}, Params: ${JSON.stringify(params)}, Query: ${JSON.stringify(
        query,
      )}, Headers: ${JSON.stringify(sanitizedHeaders)}`,
    );

    next();
  }

  private shouldExcludePath(url: string): boolean {
    return this.excludedPaths.some((path) => url.startsWith(path));
  }
}
