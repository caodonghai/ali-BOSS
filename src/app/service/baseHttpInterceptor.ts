import {Injectable} from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse, HttpResponse, HttpParams
} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {

  constructor(private msg: NzMessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const newReq = this.addHttpHeaderAndParams(req);
    return next.handle(newReq).pipe(
      (tap((event: any) => {
        // 正常返回，处理具体返回参数
        if (event instanceof HttpResponse) {
          if (event.status === 200 && event.body.resCode !== 1 && !(event.body instanceof Blob)) {
            this.handleBusinessError(event);
          }
        }
      })),
      catchError((event: HttpErrorResponse) => {
        this.handleHttpError(event);
        return of(event);
      })
    );
  }

  /**
   * 添加请求头'Access-Token'
   * 修改请求参数，将undefined，null转换成空字符串
   */
  private addHttpHeaderAndParams(oldRequest: HttpRequest<any>): HttpRequest<any> {
    const accessToken = sessionStorage.getItem('Access-Token') ? sessionStorage.getItem('Access-Token') : '';
    const oldParams = oldRequest.params;
    const paramsKeys = oldParams.keys();
    let newHttpParams = new HttpParams();
    paramsKeys.forEach(key => {
      let value = oldParams.get(key);
      if (value === undefined || value === null) {
        value = '';
      }
      newHttpParams = newHttpParams.set(key, value);
    });
    return oldRequest.clone({
      headers: oldRequest.headers.set('Access-Token', accessToken),
      params: newHttpParams
    });
  }

  /**
   * 处理业务上的错误
   */
  private handleBusinessError(event) {
    const body = event.body;
    this.msg.error(body.resMsg);
  }

  /**
   * 处理http请求错误
   */
  private handleHttpError(error: HttpErrorResponse) {
    this.msg.error('服务器异常，请稍后再试');
  }

}
