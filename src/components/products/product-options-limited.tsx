'use client'

import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { type ProductOption } from '@/lib/types'

interface ProductOptionsLimitedProps {
  options: ProductOption[]
  selectedOptionIds: string[]
  setSelectedOptionIds: React.Dispatch<React.SetStateAction<string[]>>
  maxSelected: number
}

export const ProductOptionsLimited = ({
  options,
  selectedOptionIds,
  setSelectedOptionIds,
  maxSelected
}: ProductOptionsLimitedProps) => {
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptionIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId)
      } else if (prev.length < maxSelected) {
        return [...prev, optionId]
      } else {
        return prev
      }
    })
  }

  const isMaxReached = selectedOptionIds.length >= maxSelected

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-3">Elige hasta 3 guisos:</h4>
        <div className="space-y-1">
          {options?.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id || '')
            const isDisabled = !option.isAvailable || (!isSelected && isMaxReached)

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${selectedOptionIds.includes(option.id || '')
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
              >
                <Checkbox
                  id={`option-${option.id}`}
                  checked={isSelected}
                  onCheckedChange={() => { handleOptionToggle(option.id || '') }}
                  disabled={isDisabled}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className={`flex-1 cursor-pointer ${!option.isAvailable ? 'text-muted-foreground line-through' : ''
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-muted-foreground">
                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Incluido'}
                    </span>
                  </div>
                </Label>
                {!option.isAvailable && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    No disponible
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
