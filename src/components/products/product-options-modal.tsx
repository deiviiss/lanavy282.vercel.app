'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Minus, Plus, Info, MessageCircle, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { ProductOptionsLimited } from '@/components/products/product-options-limited'
import { ProductOptionsMultiple } from '@/components/products/product-options-multiple'
import ProductSelector from '@/components/products/product-selector'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/store'

interface ProductOptionsModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductOptionsModal({ product, isOpen, onClose }: ProductOptionsModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('') // Size
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]) // Ingredients
  const [specialNote, setSpecialNote] = useState<string>('') // Note
  const [selectedLimitedOptionIds, setSelectedLimitedOptionIds] = useState<string[]>([]) // Limited ingredients

  const [quantity, setQuantity] = useState<number>(1)
  const { addToCart } = useCartStore()

  const selectedOption = product.options?.find((option) => option.id === selectedOptionId) || null // Size
  const selectedOptions = product.options?.filter((option) => selectedOptionIds.includes(option.id || '')) || [] // Ingredients
  const selectedLimitedOptions = product.options?.filter(
    (option) => selectedLimitedOptionIds.includes(option.id || '')
  ) || []

  const handleAddToCart = () => {
    if (!isReadyToAdd) return

    const noteOptionDefaultValues = {
      id: crypto.randomUUID(),
      name: specialNote,
      price: 0,
      quantity: 1,
      isAvailable: true,
      type: 'note'
    }

    const noteOption = specialNote
      ? [noteOptionDefaultValues]
      : []

    const options = [
      ...(selectedOption ? [selectedOption] : []),
      ...(selectedOptions || []),
      ...(selectedLimitedOptions || []),
      ...noteOption
    ]

    const productWithSelectedOption = {
      ...product,
      options
    }

    // Add the specified quantity to the cart
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithSelectedOption as Product)
    }

    const quantityText = quantity === 1 ? '' : ` (${quantity} unidades)`
    toast.success(`${product.name} ${quantityText} agregado al carrito`)

    setSpecialNote('')
    onClose()
    setSelectedOptionId('')
    setSelectedOptionIds([])
    setSelectedLimitedOptionIds([])
    setQuantity(1)
  }

  const handleClose = () => {
    onClose()
    setSelectedOptionId('')
    setSelectedOptionIds([])
    setQuantity(1)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const sizeOptions = product.groupedOptions?.size || []
  const noteOptions = product.options?.filter((option) => option.type === 'note') || []
  const limitedIngredientOptions = product.groupedOptions?.['limited-ingredient'] || []

  const hasNoteOptions = noteOptions.length > 0
  const hasSizeOptions = sizeOptions.length > 0
  const hasLimitedIngredientOptions = limitedIngredientOptions.length > 0

  const sizeSelected = hasSizeOptions ? !!selectedOption : true
  const limitedIngredientSelected = hasLimitedIngredientOptions ? selectedLimitedOptionIds.length > 0 : true

  const isReadyToAdd = sizeSelected && limitedIngredientSelected
  const showQuantitySelector = isReadyToAdd

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-muted rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden border">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Personaliza tu pedido</h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[calc(90vh-140px)] overflow-y-auto">
                {/* Product Info */}
                <div className="flex gap-3 mb-6">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || '/placeholder.svg?height=80&width=80'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    {product.description && <p className="text-muted-foreground text-sm mt-1">{product.description}</p>}
                    <div className="mt-2">
                      <span className="text-lg font-bold">{`${product.price ? `$ ${product.price}` : ''}`}</span>
                    </div>
                  </div>
                </div>

                {/* Options for variable price */}
                {
                  product.groupedOptions?.variable &&
                  <>
                    <Alert className="mb-6 border-orange-200 bg-orange-50">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-orange-800">
                        <div className="space-y-2">
                          <p className="font-medium">💰 Precio variable según tamaño</p>
                          <p className="text-sm">
                            El precio de este producto varía dependiendo del tamaño y disponibilidad del día.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* How it works */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-900">¿Cómo funciona?</h4>
                          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Agrega el producto a tu carrito</li>
                            <li>Realiza tu pedido por WhatsApp</li>
                            <li>Te confirmaremos precio y disponibilidad</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </>
                }

                <div className="flex flex-col gap-5">
                  {
                    hasLimitedIngredientOptions && (
                      <ProductOptionsLimited
                        options={limitedIngredientOptions}
                        selectedOptionIds={selectedLimitedOptionIds}
                        setSelectedOptionIds={setSelectedLimitedOptionIds}
                        maxSelected={3}
                        productName={product.name}
                      />
                    )
                  }

                  {/* Options Selector for sizes */}
                  {
                    product.groupedOptions?.size &&
                    <ProductSelector
                      options={product.groupedOptions?.size}
                      selectedOptionId={selectedOptionId}
                      setSelectedOptionId={setSelectedOptionId}
                      productName={product.name}
                    />
                  }

                  {/* Option Selector for ingredients */}
                  {
                    product.groupedOptions?.ingredient &&
                    <ProductOptionsMultiple
                      options={product.groupedOptions?.ingredient}
                      selectedOptionIds={selectedOptionIds}
                      setSelectedOptionIds={setSelectedOptionIds}
                    />
                  }

                  {/* Quantity Selector */}
                  {showQuantitySelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <h4 className="font-medium">Cantidad:</h4>
                      <div className="flex items-center justify-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => { handleQuantityChange(-1) }}
                          disabled={quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center justify-center min-w-[3rem]">
                          <span className="text-lg font-semibold">{quantity}</span>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => { handleQuantityChange(1) }}
                          disabled={quantity >= 99}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Special Instructions Section */}
                  {hasNoteOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">Instrucciones especiales</h4>
                      </div>
                      <div className="bg-muted border border-primary/20 rounded-lg p-3">
                        <Textarea
                          value={specialNote}
                          onChange={(e) => { setSpecialNote(e.target.value) }}
                          placeholder="Ej: sin cebolla, con doble queso, bien cocido, etc."
                          className="min-h-[80px] resize-none border-primary focus:border-secondary focus:ring-secondary"
                          maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>
                            Opcional - Comparte cualquier preferencia especial
                          </span>
                          <span>{specialNote.length}/200</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isReadyToAdd}
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar al carrito {quantity > 1 && `(${quantity})`}
                </Button>

                {
                  product.groupedOptions?.variable &&
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    El precio final se confirmará por WhatsApp
                  </p>
                }
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
