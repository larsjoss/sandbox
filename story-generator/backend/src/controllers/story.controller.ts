import { Request, Response, NextFunction } from 'express';
import * as storyService from '../services/story.service';
import * as claudeService from '../services/claude.service';
import { AppError } from '../app';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { rawInput } = req.body as { rawInput?: string };
    if (!rawInput?.trim()) {
      return res.status(400).json({ error: 'Anforderungsbeschreibung erforderlich' });
    }

    const userId = res.locals.userId as string;
    const { generatedStory, refinementHints } = await claudeService.generateStory(rawInput);
    const title = claudeService.extractTitle(generatedStory, rawInput);
    const story = await storyService.createStory(
      userId,
      title,
      rawInput,
      generatedStory,
      refinementHints,
    );

    res.status(201).json({ story });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId as string;
    const q = req.query.q as string | undefined;
    const page = Math.max(1, parseInt((req.query.page as string) ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) ?? '20', 10)));

    const result = await storyService.getStories(userId, q, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId as string;
    const story = await storyService.getStoryWithRefinements(req.params.id, userId);
    res.json({ story, refinements: story.refinements });
  } catch (err) {
    next(err);
  }
}

export async function refine(req: Request, res: Response, next: NextFunction) {
  try {
    const { instruction } = req.body as { instruction?: string };
    if (!instruction?.trim()) {
      return res.status(400).json({ error: 'Refinement-Anweisung erforderlich' });
    }

    const userId = res.locals.userId as string;
    const storyWithRefinements = await storyService.getStoryWithRefinements(
      req.params.id,
      userId,
    );

    const conversationHistory: claudeService.ConversationMessage[] = [
      { role: 'user', content: storyWithRefinements.rawInput },
      {
        role: 'assistant',
        content:
          storyWithRefinements.generatedStory +
          (storyWithRefinements.refinementHints
            ? '\n\n**Refinement Hinweise**\n' + storyWithRefinements.refinementHints
            : ''),
      },
      ...storyWithRefinements.refinements.flatMap((r) => [
        { role: 'user' as const, content: r.instruction },
        { role: 'assistant' as const, content: r.resultStory },
      ]),
      { role: 'user', content: instruction },
    ];

    const { generatedStory, refinementHints } =
      await claudeService.refineStory(conversationHistory);
    const title = claudeService.extractTitle(generatedStory, storyWithRefinements.rawInput);

    await storyService.createRefinementLog(storyWithRefinements.id, instruction, generatedStory);
    const story = await storyService.updateStory(
      storyWithRefinements.id,
      generatedStory,
      refinementHints,
      title,
    );

    res.json({ story });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.userId as string;
    await storyService.deleteStory(req.params.id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
