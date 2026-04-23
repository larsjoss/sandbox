import { Router } from 'express';
import { authRouter } from './auth.routes';
import { storyRouter } from './story.routes';

export const router = Router();

router.use('/auth', authRouter);
router.use('/stories', storyRouter);
