'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { cn, getProductTotal } from '@/lib/utils'
import { useUiStore, useCartStore, useBranchStore } from '@/store'

export function SidebarCart() {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery' | null>(null)
  const [pickupForm, setPickupForm] = useState({
    name: '',
    paymentMethod: ''
  })

  const [deliveryForm, setDeliveryForm] = useState({
    address: '',
    area: '',
    reference: '',
    receiverName: '',
    receiverPhone: '',
    paymentMethod: ''
  })

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const [showSafariModal, setShowSafariModal] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const { isSideCartOpen, closeSideCart } = useUiStore()
  const { cart, removeFromCart, updateQuantity, clearCart, getSubtotal, getCartItemTotal } = useCartStore()
  const { selectedBranch } = useBranchStore()

  // Close sidebar with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSideCart()
        setShowDeliveryModal(false)
        setShowSafariModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [closeSideCart, showDeliveryModal, showSafariModal])

  const generateAndSendWhatsApp = async (option: 'pickup' | 'delivery') => {
    if (!selectedBranch) {
      toast.error('Selecciona una sucursal antes de hacer tu pedido')
      setShowDeliveryModal(false)
      closeSideCart()
      return
    }

    const phoneNumber = selectedBranch.phone
    let messageOrder = '🛒 *Nuevo Pedido*\n\n'

    cart.forEach((item) => {
      const productName = item.product.name
      const quantity = item.quantity
      const unitTotal = getProductTotal(item.product) // already includes options
      const lineTotal = unitTotal * quantity

      messageOrder += `*${quantity}x* ${productName} - $${lineTotal.toFixed(2)}\n`

      // Only show options if they exist
      if (item.product.options && item.product.options.length > 0) {
        // Group by ID to avoid duplicates (if they come from error)
        const printed = new Set()
        item.product.options.forEach((opt) => {
          if (!printed.has(opt.id)) {
            messageOrder += `   - ${opt.name}\n`
            printed.add(opt.id)
          }
        })
      }

      messageOrder += '\n' // Separador entre productos
    })

    messageOrder += `*Total:* $${getSubtotal().toFixed(2)}\n
------------------------------------------------\n`
    messageOrder += `*Tipo de pedido:* ${option === 'pickup' ? 'Para pasar a recoger' : 'Domicilio'}\n\n`

    if (option === 'pickup') {
      messageOrder += `👤 *Cliente:* ${pickupForm.name}\n`
      messageOrder += `💳 *Pago:* ${pickupForm.paymentMethod}\n\n`
      messageOrder += '¡Gracias por tu pedido! Por favor, presiona el botón de enviar mensaje para continuar.\n\n'
    }

    if (option === 'delivery') {
      messageOrder += `📍 *Dirección:* ${deliveryForm.address}\n`

      if (deliveryForm.area) messageOrder += `🏢 *Área:* ${deliveryForm.area}\n`

      if (deliveryForm.reference) messageOrder += `🗺️ *Referencia:* ${deliveryForm.reference}\n`

      messageOrder += `👤 *Recibe:* ${deliveryForm.receiverName}\n`
      messageOrder += `📞 *Teléfono:* ${deliveryForm.receiverPhone}\n`
      messageOrder += `💳 *Pago:* ${deliveryForm.paymentMethod}\n\n`

      messageOrder += '¡Gracias por tu pedido! Por favor, presiona el botón de enviar mensaje para continuar y, seguido compártenos tu ubicación para que podamos enviarte tu pedido.'
    }

    const encodedMessage = encodeURIComponent(messageOrder)

    if (!isSafari) {
      window.open(`https://wa.me/+521${phoneNumber}?text=${encodedMessage}`, '_blank')
      setDeliveryType(null)
      setPickupForm({ name: '', paymentMethod: '' })
      setDeliveryForm({
        address: '',
        area: '',
        reference: '',
        receiverName: '',
        receiverPhone: '',
        paymentMethod: ''
      })

      closeSideCart()
    } else {
      setShowSafariModal(true)
      setPendingMessage(`https://wa.me/+521${phoneNumber}?text=${encodedMessage}`)
    }
  }

  const handleSendOrder = () => {
    if (deliveryType === 'pickup') {
      if (!pickupForm.name || !pickupForm.paymentMethod) {
        toast.error('Completa todos los campos')
        return
      }
      generateAndSendWhatsApp('pickup')
    }

    if (deliveryType === 'delivery') {
      const { address, receiverName, receiverPhone, paymentMethod } = deliveryForm

      if (!address || !receiverName || !receiverPhone || !paymentMethod) {
        toast.error('Faltan datos para el envío')
        return
      }

      generateAndSendWhatsApp('delivery')
    }

    setShowDeliveryModal(false)
    closeSideCart()
  }

  const handleWhatsAppCheckout = () => {
    setShowDeliveryModal(true)
  }

  const handleRemoveItem = (cartItemId: string, productName: string) => {
    removeFromCart(cartItemId)
    toast.error(`${productName} eliminado del carrito`)
  }

  const handleClearCart = () => {
    clearCart()
    toast.error('Carrito vaciado', {
      position: 'bottom-right'
    })
  }

  return (
    <>
      {/* Background overlay */}
      <AnimatePresence>
        {isSideCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeSideCart}
          />
        )}
      </AnimatePresence>

      {/* Cart sidebar */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[350px] bg-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          isSideCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold">Tu Carrito</h2>
            </div>
            <button
              onClick={closeSideCart}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart content */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0
              ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="h-16 w-16 mb-4 opacity-30" />
                  <p className="text-center">Tu carrito está vacío</p>
                  <Button variant="link" className="mt-2 text-primary" onClick={closeSideCart}>
                    Continuar comprando
                  </Button>
                </div>)
              : (
                <ul className="space-y-4">
                  {cart.map((item) => {
                    const hasOptions = item.product.options && item.product.options.length > 0
                    return (
                      <motion.li
                        key={item.cartItemId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-3 border-b pb-4"
                      >
                        {/* Product image */}
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || '/placeholder.svg?height=64&width=64'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {
                          hasOptions
                            ? (
                              <>
                                {/* Products details with options */}
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                                  <div className="flex items-center mt-1">
                                    <div className="flex flex-col">
                                      {
                                        item.product.name === 'Comandante' && (
                                          <div className="flex items-start gap-2 text-xs">
                                            <span className="font-medium pl-2">Cantidad: </span>
                                            <button
                                              onClick={() => { updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1)) }}
                                              className="text-muted-foreground  hover:text-primary w-5 h-5 flex items-center justify-center"
                                            >
                                              -
                                            </button>
                                            <span className="ml-1 text-muted-foreground">{item.quantity}</span>
                                            <button
                                              onClick={() => { updateQuantity(item.cartItemId, Math.max(1, item.quantity + 1)) }}
                                              className="text-muted-foreground  hover:text-primary w-5 h-5 flex items-center justify-center"
                                            >
                                              +
                                            </button>
                                          </div>
                                        )
                                      }
                                      {
                                        item.product.options?.map((option) => (
                                          <div
                                            key={option.id}
                                            className="flex gap-4 items-center mr-2 px-2 py-1 rounded text-xs"
                                          >
                                            <span className="font-medium">{option.name}</span>
                                            {
                                              option.type === 'size' && (
                                                <div className="flex items-center justify-around gap-2">
                                                  <button
                                                    onClick={() => { updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1)) }}
                                                    className="text-muted-foreground  hover:text-primary w-5 h-5 flex items-center justify-center"
                                                  >
                                                    -
                                                  </button>
                                                  <span className="ml-1 text-muted-foreground">{item.quantity}</span>
                                                  <button
                                                    onClick={() => { updateQuantity(item.cartItemId, Math.max(1, item.quantity + 1)) }}
                                                    className="text-muted-foreground  hover:text-primary w-5 h-5 flex items-center justify-center"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              )
                                            }
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </div>
                                </div>

                                {/* Price and remove button */}
                                <div className="flex flex-col items-end">
                                  <span className="font-medium text-sm">
                                    ${getCartItemTotal(item.cartItemId).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => { handleRemoveItem(item.cartItemId, item.product.name) }}
                                    className="text-destructive/70 hover:text-destructive mt-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </>)
                            : (
                              <>
                                {/* Product details */}
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                                  <div className="flex items-center mt-1">
                                    <button
                                      onClick={() => { updateQuantity(item.product.id, Math.max(1, item.quantity - 1)) }}
                                      className="text-muted-foreground  hover:text-primary w-6 h-6 flex items-center justify-center"
                                    >
                                      -
                                    </button>
                                    <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
                                    <button
                                      onClick={() => { updateQuantity(item.product.id, item.quantity + 1) }}
                                      className="text-muted-foreground hover:text-primary w-6 h-6 flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Price and remove button */}
                                <div className="flex flex-col items-end">
                                  <span className="font-medium text-sm">
                                    {(item.product.price) === 0 ? 'Pendiente' : `$${((item.product.price) * item.quantity).toFixed(2)}`}
                                  </span>
                                  <button
                                    onClick={() => { handleRemoveItem(item.product.id, item.product.name) }}
                                    className="text-destructive/70 hover:text-destructive mt-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </>)
                        }
                      </motion.li>
                    )
                  })}
                </ul>)
            }
          </div>

          {/* Summary and action buttons */}
          {cart.length > 0 && (
            <div className="border-t p-4">
              {/* Summary */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  *No incluye envío
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  **El precio final se confirmará por WhatsApp
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button onClick={handleWhatsAppCheckout} className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Hacer pedido
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full text-destructive border-destructive bg-background hover:bg-destructive/10 hover:text-black dark:hover:text-destructive"
                >
                  Vaciar carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safari modal */}
      {showSafariModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-muted p-6 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirmar pedido</h3>
            <p className="text-sm text-muted-foreground">
              Tu pedido fue creado. Presiona el botón para abrir WhatsApp y enviarlo.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (pendingMessage) window.open(pendingMessage, '_blank')
                  setShowSafariModal(false)
                  setPendingMessage(null)
                  setDeliveryType(null)
                  setPickupForm({ name: '', paymentMethod: '' })
                  setDeliveryForm({
                    address: '',
                    area: '',
                    reference: '',
                    receiverName: '',
                    receiverPhone: '',
                    paymentMethod: ''
                  })
                  closeSideCart()
                }}
              >
                Enviar por WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowSafariModal(false) }}
                className="w-full text-destructive border-destructive bg-background hover:bg-destructive/10 hover:text-black dark:hover:text-destructive"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Delivery Modal */}
      <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
        <DialogContent className="max-w-sm bg-muted rounded-lg">
          <DialogHeader>
            <DialogTitle>Completar pedido</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Por favor, proporciona los datos necesarios para procesar tu pedido.
            </DialogDescription>
          </DialogHeader>

          {!deliveryType && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => { setDeliveryType('pickup') }}
              >
                Recoger en sucursal
              </Button>
              <Button
                onClick={() => { setDeliveryType('delivery') }}
                className="bg-green-600 hover:bg-green-700"
              >
                A domicilio
              </Button>
            </div>
          )}

          {deliveryType === 'pickup' && (
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Nombre completo"
                value={pickupForm.name}
                onChange={(e) => { setPickupForm({ ...pickupForm, name: e.target.value }) }}
                className="w-full p-2 rounded border text-muted-foreground text-sm"
              />
              <Select
                value={pickupForm.paymentMethod}
                onValueChange={(value) => { setPickupForm({ ...pickupForm, paymentMethod: value }) }}
              >
                <SelectTrigger className='w-full p-2 rounded border text-muted-foreground text-sm'>
                  <SelectValue placeholder="Forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {deliveryType === 'delivery' && (
            <div className="space-y-3 mt-4">
              <Input placeholder="Nombre de quien recibe" value={deliveryForm.receiverName} onChange={(e) => { setDeliveryForm({ ...deliveryForm, receiverName: e.target.value }) }} className="w-full p-2 rounded border text-sm" />
              <Input placeholder="Dirección completa" value={deliveryForm.address} onChange={(e) => { setDeliveryForm({ ...deliveryForm, address: e.target.value }) }} className="w-full p-2 rounded border text-sm" />
              <Input placeholder="Área o dependencia (opcional)" value={deliveryForm.area} onChange={(e) => { setDeliveryForm({ ...deliveryForm, area: e.target.value }) }} className="w-full p-2 rounded border text-sm" />
              <Input placeholder="Referencia del domicilio" value={deliveryForm.reference} onChange={(e) => { setDeliveryForm({ ...deliveryForm, reference: e.target.value }) }} className="w-full p-2 rounded border text-sm" />
              <Input placeholder="Teléfono de contacto" value={deliveryForm.receiverPhone} onChange={(e) => { setDeliveryForm({ ...deliveryForm, receiverPhone: e.target.value }) }} className="w-full p-2 rounded border text-sm" />
              <Select
                value={deliveryForm.paymentMethod}
                onValueChange={(value) => { setDeliveryForm({ ...deliveryForm, paymentMethod: value }) }}
              >
                <SelectTrigger className='w-full p-2 rounded border text-muted-foreground text-sm'>
                  <SelectValue placeholder="Forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(deliveryType === 'pickup' || deliveryType === 'delivery') && (
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeliveryModal(false)
                  setTimeout(() => {
                    setDeliveryType(null)
                    setPickupForm({ name: '', paymentMethod: '' })
                    setDeliveryForm({
                      address: '',
                      area: '',
                      reference: '',
                      receiverName: '',
                      receiverPhone: '',
                      paymentMethod: ''
                    })
                  }, 1000)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSendOrder} className="bg-green-600 hover:bg-green-700">
                Enviar pedido
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
