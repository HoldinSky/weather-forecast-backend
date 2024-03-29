import { Catch, ExceptionFilter, Inject } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { ArgumentsHost } from "@nestjs/common/interfaces/features/arguments-host.interface";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res = {
      error: exception.message,
      status,
      timestamp: new Date().toISOString(),
      path: request.url
    };

    response.status(status).json(res);
  }
}
