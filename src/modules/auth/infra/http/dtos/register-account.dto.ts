import z from 'zod';

export const registerAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterAccountBodySchema = z.infer<
  typeof registerAccountBodySchema
>;
