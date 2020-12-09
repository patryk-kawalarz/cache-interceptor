import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as localForage from 'localforage';
import * as moment from 'moment';

@Injectable()
export abstract class CacheInterceptor implements HttpInterceptor {
  private cacheTime: number = 60;
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url.replace('https://', '').replace(/[^0-9a-z]/g, '');

    return from(localForage.keys()).pipe(
      switchMap((keys) => this.getFromCache(keys, url)),
      switchMap((cache) => cache
        ? of(cache)
        : next.handle(request).pipe(switchMap((data) => this.addToCache(data, url)))),
    );
  }

  getFromCache(keys, url): Observable<any> | null {
    if (!keys.includes(url)) {
      return of(null);
    }

    return from(localForage.getItem(url)).pipe(
      switchMap((item) => this.isExpired(item))
    )
  }

  addToCache(data, url) {
    const value = {
      body: data.body,
      date: moment().format(),
    };

    return of(localForage.setItem(url, value)).pipe(map(() => data));
  }

  isExpired(item: any) {
    const outOfDate = moment().diff(moment(item.date), 'minutes') > this.cacheTime;
    const resp = new HttpResponse({ body: item.body });

    return of(outOfDate ? null : resp);
  }
}
