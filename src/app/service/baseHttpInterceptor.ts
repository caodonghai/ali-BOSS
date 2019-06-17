import {Injectable} from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {of, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


@Injectable()
export class BaseInterceptor implements HttpInterceptor {

  constructor(private msg: NzMessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 添加请求头
    const accessToken = sessionStorage.getItem('Access-Token') ? sessionStorage.getItem('Access-Token') : '';
    const newReq = req.clone({
      headers: req.headers.set('Access-Token', accessToken)
    });
    return next.handle(newReq).pipe(
      (tap((event: any) => {
        // 正常返回，处理具体返回参数
        if (event instanceof HttpResponse) {
          if (event.status === 200 && event.body.resCode !== 1) {
            this.handleError(event);
          }
        }
      })),
      catchError((event: HttpErrorResponse) => {
        this.msg.error('服务器异常，请稍后再试');
        return of(null);
      })
    );
  }


  handleError(event) {
    const body = event.body;
    this.msg.error(body.resMsg);
  }

}
