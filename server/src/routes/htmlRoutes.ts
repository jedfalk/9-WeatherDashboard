import { Router } from 'express';
import path from 'node:path';

const router = Router();

router.get('*', (_req, res) => {
  res.sendFile(path.resolve('../client/dist/index.html'));
});

export default router;
