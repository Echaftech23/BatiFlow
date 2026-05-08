import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export type ApiErrorItem = { field: string; message: string };

export type ApiErrorResponse = {
  statusCode: number;
  message: string;
  errors?: ApiErrorItem[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const excResponse = exception.getResponse();

      if (typeof excResponse === 'string') {
        response.status(statusCode).json({
          statusCode,
          message: excResponse,
        } satisfies ApiErrorResponse);
        return;
      }

      const body = excResponse as Record<string, unknown>;
      const message = body.message;
      const errors = body.errors as ApiErrorItem[] | undefined;

      if (Array.isArray(message)) {
        response.status(statusCode).json({
          statusCode,
          message: 'Validation failed',
          errors: message.map((m) => ({
            field: '',
            message: String(m),
          })),
        } satisfies ApiErrorResponse);
        return;
      }

      const msg =
        typeof message === 'string'
          ? message
          : message != null
            ? JSON.stringify(message)
            : 'Error';

      const payload: ApiErrorResponse = {
        statusCode,
        message: msg,
      };
      if (errors?.length) {
        payload.errors = errors;
      }
      response.status(statusCode).json(payload);
      return;
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(statusCode).json({
      statusCode,
      message: 'Internal server error',
    } satisfies ApiErrorResponse);
  }
}
