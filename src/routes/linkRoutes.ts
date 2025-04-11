import { Router } from 'express';
import { createLink, getLinks } from '../controllers/linkController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createLink);
router.get('/', authenticate, getLinks);

export default router;