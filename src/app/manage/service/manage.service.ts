import {Injectable} from '@angular/core';
import {BASE_URL} from '../../../config';
import {Response} from '../../interface';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  constructor(private http: HttpClient) {
  }

  getTenantList(params: HttpParams) {
    this.http.get<Response>(BASE_URL + 'list', {params: params});
  }

  getProductList() {
    return this.http.get<Response>(BASE_URL + '/ttSpecification/list');
  }
}
