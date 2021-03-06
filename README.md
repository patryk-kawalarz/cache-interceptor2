# Angular cache interceptor

This interceptor caches http requests from white list for x minutes.

## Installation

Add ```cache.interceptor.ts``` to your project. Put this in your ```app.module.ts``` file:
```javascript
import { CacheInterceptor } from './services/cache.interceptor'

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
```

### Dependencies
[MomentJS](https://github.com/moment/moment), [rxjs](https://github.com/ReactiveX/rxjs)
