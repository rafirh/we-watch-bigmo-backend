import { z } from "zod";

export const registerInputSchema = z.object({
  fullName: z.string().min(1).max(100),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.email().min(1),
  password: z.string().min(8).max(100),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  username: z.string(),
  email: z.email().min(1),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userResponseSchema,
});

export const userListResponseSchema = z.object({
  data: z.array(userResponseSchema),
  total: z.number(),
});

export const userIdParamSchema = z.object({
  id: z.string(),
});
