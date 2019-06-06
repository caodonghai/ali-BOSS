import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/operators';


@Injectable()
export class BaseInterceptor implements HttpInterceptor {

  constructor(private msg: NzMessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = sessionStorage.getItem('Access-Token') ? sessionStorage.getItem('Access-Token') : '';
    const newReq = req.clone({
      headers: req.headers.set('Access-Token', accessToken),
    });
    return next.handle(newReq);
  }

}
