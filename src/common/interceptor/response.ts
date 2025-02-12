import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 응답 데이터를 가로챕니다.
    return next.handle().pipe(
      map((result) => {
        // 만약 응답 데이터가 배열 형태인 경우
        if (Array.isArray(result)) {
          return {
            count: result.length, // 총 갯수
            data: result, // 데이터
          };
        }
        // 기타 형태의 응답 데이터는 그대로 반환합니다.
        return result;
      }),
    );
  }
}
