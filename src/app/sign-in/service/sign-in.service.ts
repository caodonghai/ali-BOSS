import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../../config';
import {Response} from '../../interface';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private http: HttpClient) {
  }

  // 登录
  signIn(params: any) {
    // return this.http.post<Response>(BASE_URL+'/login/login', null, {params: params});
    return this.http.post<Response>('http://10.0.9.201:8080/api/uip/login/login', null, {params: params});
  }

  // 获取图片验证码
  getVerificationCodeUrl(uuid: string): string {
    // return BASE_URL + '/uip/randImage/imageCode?imageCodeId=' + uuid;
    return 'http://10.0.9.201:8080/api/uip/randImage/imageCode?imageCodeId=' + uuid;
  }

  // 获取uuid
  getUuid(): string {
    const len = 32;
    let radix = 16;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    let i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
}
