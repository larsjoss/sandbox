import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../app';

function notFound(): AppError {
  const err: AppError = new Error('Story nicht gefunden');
  err.status = 404;
  return err;
}

export async function createStory(
  userId: string,
  title: string,
  rawInput: string,
  generatedStory: string,
  refinementHints: string,
) {
  return prisma.story.create({
    data: { userId, title, rawInput, generatedStory, refinementHints },
  });
}

export async function getStories(
  userId: string,
  q: string | undefined,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  if (q && q.trim()) {
    const sanitized = q.trim();
    const stories = await prisma.$queryRaw<
      Array<{
        id: string;
        userId: string;
        title: string;
        rawInput: string;
        generatedStory: string;
        refinementHints: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >(Prisma.sql`
      SELECT id, "userId", title, "rawInput", "generatedStory", "refinementHints", "createdAt", "updatedAt"
      FROM "Story"
      WHERE "userId" = ${userId}
        AND to_tsvector('german', title || ' ' || "rawInput") @@ plainto_tsquery('german', ${sanitized})
      ORDER BY "updatedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `);

    const countResult = await prisma.$queryRaw<[{ count: bigint }]>(Prisma.sql`
      SELECT COUNT(*) as count
      FROM "Story"
      WHERE "userId" = ${userId}
        AND to_tsvector('german', title || ' ' || "rawInput") @@ plainto_tsquery('german', ${sanitized})
    `);

    return { stories, total: Number(countResult[0].count) };
  }

  const [stories, total] = await prisma.$transaction([
    prisma.story.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.story.count({ where: { userId } }),
  ]);

  return { stories, total };
}

export async function getStoryWithRefinements(storyId: string, userId: string) {
  const story = await prisma.story.findFirst({
    where: { id: storyId, userId },
    include: { refinements: { orderBy: { createdAt: 'asc' } } },
  });
  if (!story) throw notFound();
  return story;
}

export async function updateStory(
  storyId: string,
  generatedStory: string,
  refinementHints: string,
  title: string,
) {
  return prisma.story.update({
    where: { id: storyId },
    data: { generatedStory, refinementHints, title, updatedAt: new Date() },
  });
}

export async function deleteStory(storyId: string, userId: string) {
  await prisma.story.deleteMany({ where: { id: storyId, userId } });
}

export async function createRefinementLog(
  storyId: string,
  instruction: string,
  resultStory: string,
) {
  return prisma.refinementLog.create({
    data: { storyId, instruction, resultStory },
  });
}
