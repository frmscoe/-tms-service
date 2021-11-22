import Router from 'koa-router';
import { healthCheck } from './health.controller';
import { monitorQuote, monitorTransfer, replyQuote, transferResponse } from './app.controller';

const router = new Router();

// health checks
router.get('/', healthCheck);
router.get('/health', healthCheck);

// execute the service Pain001
router.post('/execute', monitorQuote);
// ReplyQuote Pain013
router.post('/quoteReply', replyQuote);
// Transfer Pacs008
router.post('/transfer', monitorTransfer);

// transfer response
router.post('/transfer-response', transferResponse);

export default router;
