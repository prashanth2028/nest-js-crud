import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    ForbiddenException,
  } from '@nestjs/common';
  import { MongoError } from 'mongodb';
  import { Response } from 'express';
  import { Error } from 'mongoose';
  
  @Catch()
  export class ExceptionHandler implements ExceptionFilter {
    catch(exception: unknown | any, host: ArgumentsHost) {
      console.log(exception);
  
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      console.log({response});
      
      let status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let errorResponse: any = {
        status_code: status,
        message: 'Internal Server Error',
      };
  
      // MongoDB error handling
      if (exception instanceof MongoError) {
        switch (exception.code) {
          case 11000: // Duplicate key error
            errorResponse['status_code'] = HttpStatus.CONFLICT;
            errorResponse['message'] =
              'Duplicate key error: Record already exists.';
            errorResponse.error = exception.message;
            break;
  
          case 121: // Document validation failure
            errorResponse['status_code'] = HttpStatus.BAD_REQUEST;
            errorResponse['message'] =
              'Document validation error: Schema validation failed.';
            errorResponse.error = exception.message;
            break;
  
          case 26: // Namespace not found
            errorResponse['status_code'] = HttpStatus.NOT_FOUND;
            errorResponse['message'] =
              'Namespace error: Requested collection or database does not exist.';
            errorResponse.error = exception.message;
            break;
  
          case 50: // Exceeded time limit
            errorResponse['status_code'] = HttpStatus.REQUEST_TIMEOUT;
            errorResponse['message'] = 'Operation exceeded time limit.';
            errorResponse.error = exception.message;
            break;
  
          case 13: // Unauthorized error
            errorResponse['status_code'] = HttpStatus.UNAUTHORIZED;
            errorResponse['message'] =
              'Unauthorized: You do not have permission to perform this operation.';
            errorResponse.error = exception.message;
            break;
  
          case 48: // Collection already exists
            errorResponse['status_code'] = HttpStatus.CONFLICT;
            errorResponse['message'] = 'Collection already exists.';
            errorResponse.error = exception.message;
            break;
  
          case 59: // Command not found
            errorResponse['status_code'] = HttpStatus.NOT_IMPLEMENTED;
            errorResponse['message'] =
              'Command not found: Operation is not supported.';
            errorResponse.error = exception.message;
            break;
  
          default: // Generic MongoDB error
            errorResponse['status_code'] = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse['message'] =
              `An unexpected MongoDB error occurred: ${exception.message}`;
            errorResponse.error = exception.message;
            break;
        }
      }
  
      // Mongoose validation error handling
      if (exception instanceof Error.ValidationError) {
        status = HttpStatus.BAD_REQUEST;
        errorResponse = {
          status_code: HttpStatus.BAD_REQUEST,
          message: `Validation Error: ${exception.message}`,
          error: exception.errors,
        };
      }
  
      // ForbiddenException handling
      if (exception instanceof ForbiddenException) {
        status = HttpStatus.FORBIDDEN;
        errorResponse = {
          status_code: HttpStatus.FORBIDDEN,
          message: 'Access Forbidden: You do not have permission to access this resource.',
          error: exception.message,
        };
      }
  
      // Handle other HttpException types
      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        errorResponse = {
          status_code: status,
          ...(typeof exceptionResponse === 'string'
            ? { message: exceptionResponse }
            : exceptionResponse),
        };
      }
  
      delete errorResponse['statusCode']
      console.log({errorResponse});
      
      // Send the response
      response.status(errorResponse.status_code).json(errorResponse);
    }
  }
  