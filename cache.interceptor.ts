import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map();
  private cacheLifetime: number = 30;
  private whiteList: string[] = [
    'api/'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || !this.whiteList.some(item => req.url.includes(item))) {
      return next.handle(req);
    }

    const cachedResponse: HttpResponse<any> = this.cache.get(req.url);

    return this.checkCacheNoExpired(cachedResponse)
      ? of(cachedResponse.clone())
      : next.handle(req).pipe(
        map(stateEvent => this.addExpHeader(stateEvent)),
        tap(stateEvent => this.setCache(stateEvent, req.url)),
        share()
      );
  }

  setCache(stateEvent: any, url: string) {
    if (!(stateEvent instanceof HttpResponse)) {
      return;
    }

    this.cache.set(url, stateEvent.clone());
  }

  addExpHeader(handleReq) {
    if (!(handleReq instanceof HttpResponse)) {
      return;
    }

    const expDateUTC = moment()
      .add(this.cacheLifetime, 'minutes')
      .toDate()
      .toUTCString();

    return handleReq.clone({
      headers: new HttpHeaders({ 'Expires': expDateUTC })
    });
  }

  checkCacheNoExpired(resp: HttpResponse<any> | null): boolean {
    return !!resp && moment() < moment(resp.headers.get('Expires'));
  }
}
