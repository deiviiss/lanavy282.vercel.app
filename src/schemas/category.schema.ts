import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }).max(100),
  image: z.string().url({ message: 'La URL de la imagen no es válida' }).optional().nullable()
})
