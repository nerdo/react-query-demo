import { z } from 'zod'

export const contact = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email().min(5).optional(),
  avatarUrl: z.string().url().optional(),
  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(5).max(2),
      zip: z.string().min(5).max(5).regex(/\d{5}/, { message: 'Zip code can only contain numbers' }),
    })
    .optional(),
})

export type Contact = z.infer<typeof contact>

export type ContactUpdate = Omit<Contact, 'address'> & { address?: Partial<Contact['address']> }
