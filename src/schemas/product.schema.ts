import { z } from 'zod'

export const optionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  price: z.coerce.number().nonnegative(),
  isAvailable: z.boolean().default(true),
  type: z.enum(['size', 'ingredient', 'variable', 'note', 'limited-ingredient']),
  quantity: z.number().int().nonnegative().optional().default(0)
})

export const productSchema = z.object({
  id: z
    .string()
    .uuid()
    .optional(),
  name: z
    .string({
      required_error: 'El nombre es requerido.',
      message: 'El nombre debe tener entre 3 y 50 caracteres.'
    })
    .min(3, {
      message: 'El nombre debe tener al menos 3 caracteres.'
    }
    )
    .max(50, {
      message: 'El nombre debe tener máximo 50 caracteres.'
    }),
  description: z
    .string({
      required_error: 'La descripción es requerida.',
      message: 'La descripción debe tener entre 3 y 200 caracteres.'
    })
    .min(3, {
      message: 'La descripción debe tener al menos 3 caracteres.'
    })
    .max(200),
  price: z
    .number({
      message: 'El precio es requerido.'
    })
    .transform(val => Number(val.toFixed(2))),
  image: z
    .union([
      z.string().url('La imagen es requerida').min(1, 'La imagen es obligatoria'),
      z.literal('upload_pending') // string dummy value to pass validation
    ]),
  categoryId: z
    .string({
      required_error: 'La categoría es requerida.'
    })
    .uuid('Selecciona una categoría válida.'),
  options: z
    .array(optionSchema).optional(),
  isAvailable: z
    .coerce.boolean().optional().default(true)
})
