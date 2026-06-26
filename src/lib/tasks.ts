import { prisma } from '@/lib/prisma';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations';

const DEMO_EMAIL = 'demo@notionpulse.app';

/**
 * Resolves the current user id.
 *
 * Until real Google authentication is wired up with credentials, we fall back
 * to a single persisted demo user so tasks can be created and read locally.
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    const email = session?.user?.email;
    if (email) {
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name: session?.user?.name ?? undefined,
          image: session?.user?.image ?? undefined,
        },
        create: {
          email,
          name: session?.user?.name ?? undefined,
          image: session?.user?.image ?? undefined,
        },
      });
      return user.id;
    }
  } catch {
    // Auth not configured / no session — fall through to demo user.
  }

  const demo = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { email: DEMO_EMAIL, name: 'Demo' },
  });
  return demo.id;
}

export async function listTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      userId,
    },
  });
}

export async function updateTask(userId: string, id: string, input: UpdateTaskInput) {
  // Scope the update to the owner so users can't mutate others' tasks.
  const result = await prisma.task.updateMany({
    where: { id, userId },
    data: input,
  });
  if (result.count === 0) return null;
  return prisma.task.findUnique({ where: { id } });
}

export async function deleteTask(userId: string, id: string) {
  const result = await prisma.task.deleteMany({ where: { id, userId } });
  return result.count > 0;
}
