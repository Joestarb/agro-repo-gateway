import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogsService } from './logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userId = request.user?.id || null;

    console.log('Before...');
    const now = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const responseTime = Date.now() - now;
        console.log(`After... ${responseTime}ms ${Date.now()}`);

        // Guardar log exitoso
        try {
          await this.logsService.create({
            level: 'info',
            message: `${method} ${url} - ${responseTime}ms`,
            context: 'HTTP_REQUEST',
            userId,
            ip,
          });
        } catch (error) {
          console.error('Error saving log:', error);
        }
      }),
      catchError(async (error) => {
        const responseTime = Date.now() - now;

        // Guardar log de error
        try {
          await this.logsService.create({
            level: 'error',
            message: `${method} ${url} - Error: ${error.message}`,
            context: 'HTTP_ERROR',
            userId,
            ip,
            stack: error.stack,
          });
        } catch (logError) {
          console.error('Error saving error log:', logError);
        }

        return throwError(() => error);
      }),
    );
  }
}
