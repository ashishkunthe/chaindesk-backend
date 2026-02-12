import { z } from "zod";

export const signupTypes = z.object({
  username: z.string().min(3).max(10),
  email: z.email(),
  password: z.string().min(8).max(16),
});

export const signinTypes = z.object({
  email: z.email(),
  password: z.string().min(8).max(16),
});
