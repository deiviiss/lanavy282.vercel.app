import { z } from 'zod'

export const orderSchema = z.object({
  id: z
    .string()
    .uuid()
    .optional(),
  address: z
    .string()
    .optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  totalPrice: z.number().min(0, 'El total no puede ser negativo'),
  comment: z.string().optional(),
  items: z.array(
    z.object({
      itemId: z.string(),
      categoryId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0)
    })
  ).min(1, 'Debe haber al menos un producto en el pedido')
})
