import { Router } from 'express';
import * as storyController from '../controllers/story.controller';
import { requireAuth } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimiter';

export const storyRouter = Router();

storyRouter.use(requireAuth);

storyRouter.get('/', storyController.list);
storyRouter.post('/', aiRateLimiter, storyController.create);
storyRouter.get('/:id', storyController.getOne);
storyRouter.post('/:id/refine', aiRateLimiter, storyController.refine);
storyRouter.delete('/:id', storyController.remove);
