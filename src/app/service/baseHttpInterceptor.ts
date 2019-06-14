import {Injectable} from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


@Injectable()
export class BaseInterceptor implements HttpInterceptor {

  constructor(private msg: NzMessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = sessionStorage.getItem('Access-Token') ? sessionStorage.getItem('Access-Token') : '';
    // const paramsKeys = req.params.keys();
    // const newParams = new HttpParams();
    // paramsKeys.forEach(item => {
    //   newParams.set(item, req.params.get(item) === null ? newParams.get(item) : '');
    // });
    const newReq = req.clone({
      headers: req.headers.set('Access-Token', accessToken)
    });
    return next.handle(newReq).pipe(
      (tap((event: any) => {
        // 正常返回，处理具体返回参数
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            if (event.body.resCode !== 1) {
              this.handleError(event);
            }
          } else {
            this.msg.error('服务器异常，请稍后再试');
          }
        }
      })),
      catchError((event: HttpErrorResponse) => {
        return throwError(event);
      })
    );
  }


  handleError(event) {
    const body = event.body;
    this.msg.error(body.resMsg);
  }

}
