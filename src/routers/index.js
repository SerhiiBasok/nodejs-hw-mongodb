import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/api/contacts', contactsRouter);

export default router;
