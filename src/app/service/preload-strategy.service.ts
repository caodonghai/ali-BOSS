import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, flatMap} from 'rxjs/operators';
import {Route} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreloadStrategyService {

  constructor() {
  }

  preload(route: Route, load: () => Observable<boolean>): Observable<boolean> {
    return of(true).pipe(
      delay(3000),
      flatMap((_: boolean) => load())
    );
  }
}
