import { getPrisma } from '@/lib/prisma';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations';

const DEMO_EMAIL = 'demo@notionpulse.app';
const DEMO_ID = 'demo-user';

export type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// In-memory fallback store (used when no database is configured — e.g. a
// no-DB Vercel deploy). Seeded so a shared link shows something right away.
const memTasks: TaskRecord[] = [
  {
    id: 'seed-1',
    title: 'Revisar proposta do cliente',
    description: null,
    completed: false,
    userId: DEMO_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'seed-2',
    title: 'Preparar reunião de equipe',
    description: null,
    completed: false,
    userId: DEMO_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Resolves the current user id. With a real session (Google configured) the
 * user is upserted by email; otherwise we use a single persisted demo user.
 */
export async function getCurrentUserId(): Promise<string> {
  const prisma = await getPrisma();
  if (!prisma) return DEMO_ID;

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

export async function listTasks(userId: string): Promise<TaskRecord[]> {
  const prisma = await getPrisma();
  if (!prisma) {
    return [...memTasks]
      .filter((t) => t.userId === userId)
      .sort((a, b) =>
        a.completed === b.completed
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : Number(a.completed) - Number(b.completed),
      );
  }
  return prisma.task.findMany({
    where: { userId },
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<TaskRecord> {
  const prisma = await getPrisma();
  if (!prisma) {
    const now = new Date();
    const task: TaskRecord = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? null,
      completed: false,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    memTasks.push(task);
    return task;
  }
  return prisma.task.create({
    data: { title: input.title, description: input.description, userId },
  });
}

export async function updateTask(
  userId: string,
  id: string,
  input: UpdateTaskInput,
): Promise<TaskRecord | null> {
  const prisma = await getPrisma();
  if (!prisma) {
    const task = memTasks.find((t) => t.id === id && t.userId === userId);
    if (!task) return null;
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description ?? null;
    if (input.completed !== undefined) task.completed = input.completed;
    task.updatedAt = new Date();
    return task;
  }
  const result = await prisma.task.updateMany({ where: { id, userId }, data: input });
  if (result.count === 0) return null;
  return prisma.task.findUnique({ where: { id } });
}

export async function deleteTask(userId: string, id: string): Promise<boolean> {
  const prisma = await getPrisma();
  if (!prisma) {
    const idx = memTasks.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) return false;
    memTasks.splice(idx, 1);
    return true;
  }
  const result = await prisma.task.deleteMany({ where: { id, userId } });
  return result.count > 0;
}
