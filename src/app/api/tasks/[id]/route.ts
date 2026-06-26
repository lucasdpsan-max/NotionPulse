import { NextRequest, NextResponse } from 'next/server';
import { updateTaskSchema } from '@/lib/validations';
import { deleteTask, getCurrentUserId, updateTask } from '@/lib/tasks';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const userId = await getCurrentUserId();
  const task = await updateTask(userId, id, parsed.data);
  if (!task) {
    return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const deleted = await deleteTask(userId, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
