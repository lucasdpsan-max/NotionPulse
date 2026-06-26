import { NextRequest, NextResponse } from 'next/server';
import { createTaskSchema } from '@/lib/validations';
import { createTask, getCurrentUserId, listTasks } from '@/lib/tasks';

export async function GET() {
  const userId = await getCurrentUserId();
  const tasks = await listTasks(userId);
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const userId = await getCurrentUserId();
  const task = await createTask(userId, parsed.data);
  return NextResponse.json({ task }, { status: 201 });
}
