import { z } from "zod";

export const transcriptTypes = z.object({
  transcript: z.string().min(16),
});

export const actionTypes = z.object({
  task: z.string().min(1),

  owner: z
    .string()
    .nullable()
    .transform((val) => val ?? "Not mentioned"),

  dueDate: z
    .string()
    .nullable()
    .transform((val) => val ?? "Not mentioned"),

  summary: z.string().min(1),
});

export const updateActionTypes = z.object({
  task: z.string().optional(),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  summary: z.string().optional(),
  status: z.enum(["open", "done"]).optional(),
});

export const actionArrayTypes = z.array(actionTypes);
