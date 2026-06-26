import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório').max(280),
  description: z.string().trim().max(2000).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(280).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Nenhum campo para atualizar',
  });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
