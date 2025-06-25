import { z } from 'zod'

export const promotionSchema = z.object({
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
    .max(200, {
      message: 'La descripción debe tener un máximo de 200 caracteres.'
    }),
  discountPercentage: z
    .number({
      message: 'El porcentaje de descuento es requerido.'
    })
    .int({ message: 'Debe ser un número entero.' })
    .positive({ message: 'Debe ser mayor a 0.' })
    .max(100, { message: 'Debe ser menor o igual a 100.' }),
  originalPrice: z
    .number({
      message: 'El precio es requerido.'
    })
    .positive({
      message: 'El precio debe ser mayor a 0.'
    })
    .transform(val => Number(val.toFixed(2))),
  promoPrice: z
    .number({
      message: 'El precio es requerido.'
    })
    .positive({
      message: 'El precio debe ser mayor a 0.'
    })
    .transform(val => Number(val.toFixed(2))),
  image: z
    .union([
      z
        .string()
        .url('La imagen es requerida')
        .min(1, 'La imagen es obligatoria'),
      z
        .literal('upload_pending') // string dummy value to pass validation
    ]),
  categoryId: z
    .string({
      required_error: 'La categoría es requerida.'
    }).uuid('Selecciona una categoría válida.'),
  createdAt: z
    .coerce.date(),
  isActive: z
    .boolean().default(true)
})
