import { LucideArrowDownNarrowWide, PlusCircle } from 'lucide-react'
import { type Product } from '@/lib/types'

interface ProductOptionButtonProps {
  product: Product
}

export function ProductOptionButton({ product }: ProductOptionButtonProps) {
  const hasOptions = product.options && product.options.length > 0

  const getOptionText = () => {
    if (!product.options?.length) return 'Agregar'

    // Assuming the first option's name indicates the type
    const firstOption = product.options[0]

    if (firstOption.type.toLowerCase().includes('size')) {
      return 'Agregar'
    }

    if (firstOption.type.toLowerCase().includes('ingredient')) {
      return 'Ingredientes'
    }

    return 'Elegir opción'
  }

  return (
    <>
      <span className="mr-1">
        {
          hasOptions
            ? <LucideArrowDownNarrowWide className="h-4 w-4" />
            : <PlusCircle className="h-4 w-4" />
        }
      </span>
      {getOptionText()}
    </>
  )
}
