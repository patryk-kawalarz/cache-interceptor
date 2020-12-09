# Angular cache interceptor

This interceptor caches are all http requests for 60 minutes and stores them in IndexedDB using [localForage](https://github.com/localForage/localForage).

## Installation

Add ```cache.interceptor.ts``` to your project. Put this in your ```app.module.ts``` file:
```javascript
import { CacheInterceptor } from './services/cache.interceptor'

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
```

### Dependencies
[MomentJS](https://github.com/moment/moment), [localForage](https://github.com/localForage/localForage)
