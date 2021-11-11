import Router from 'koa-router';
import { healthCheck } from './health.controller';
import { monitorQuote, monitorTransfer, replyQuote } from './app.controller';

const router = new Router();

// health checks
router.get('/', healthCheck);
router.get('/health', healthCheck);

// execute the service
router.post('/execute', monitorQuote);
router.post('/quoteReply', replyQuote);
// router.post('/transfer', monitorTransfer);
export default router;
