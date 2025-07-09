import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type ProductOption } from '@/lib/types'
import { isRefrescoNatural } from '@/lib/utils'

interface ProductSelectorProps {
  options: ProductOption[]
  selectedOptionId: string
  productName: string
  setSelectedOptionId: React.Dispatch<React.SetStateAction<string>>
}

const ProductSelector = ({
  options,
  selectedOptionId,
  setSelectedOptionId,
  productName
}: ProductSelectorProps) => {
  return (
    <div className="space-y-4">
      {/* Options Select */}
      <div>
        <h4 className="font-medium mb-2">{isRefrescoNatural(productName) ? 'Selecciona un tamaño' : 'Selecciona un pan'}:</h4>
        <Select value={selectedOptionId} onValueChange={setSelectedOptionId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elige una opción..." />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id || ''}>
                <div className="flex justify-between items-center w-full">
                  <span>{option.name}</span>
                  <span className="text-muted-foreground ml-4">
                    {option.price > 0 ? `$${option.price.toFixed(2)}` : ''}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ProductSelector
