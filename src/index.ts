import Koa, { Next } from 'koa';

import { Context } from 'vm';
const app: Koa = new Koa();

app.use(function* (next: Next) {
  // do something before yielding to next generator function

  // in line which will be 1st event in downstream
  console.log('1');
  yield next;

  // do something when the execution returns upstream,
  // this will be last event in upstream
  console.log('2');
});
app.use(function* (next: Next) {
  // This shall be 2nd event downstream
  console.log('3');

  yield next;

  // This would be 2nd event upstream
  console.log('4');
});
app.listen(3002);
