import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from '../services/api.service';
import { CacheInterceptor } from './cache.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe(`CacheInterceptor`, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: CacheInterceptor,
        multi: true,
      }],
    });
  });

  describe(`intercept HTTP requests`, () => {
    it('should be only one call the same request',
      inject([HttpClient, HttpTestingController],
        (http: HttpClient, mock: HttpTestingController) => {
          http.get('/api/inter_test/1/2').subscribe(response => expect(response).toBeTruthy());
          let request = mock.expectOne(`/api/inter_test/1/2`);
          request.flush({ data: 'test' });
          mock.verify();

          http.get('/api/inter_test/1/2').subscribe(response => expect(response).toBeTruthy());
          mock.expectNone(`/api/inter_test/1/2`);
          mock.verify();
        }));
  });

  afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
    mock.verify();
  }));
});
