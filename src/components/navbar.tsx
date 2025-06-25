'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, List, MapPin, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense, useState, useEffect } from 'react'
import { toast } from 'sonner'
import BranchSelectorModal from './branch-selector-modal'
import { getBranches } from '@/actions/branches/get-branches'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type Branch } from '@/lib/types'
import { useUiStore, useCartStore, useBranchStore } from '@/store'

export function Navbar() {
  const { cart, clearCart } = useCartStore()
  const { openSideCart, toggleCategories } = useUiStore()
  const totalItems = useCartStore((state) => state.getTotalItems())

  const { selectedBranch, setSelectedBranch } = useBranchStore()
  const [branches, setBranches] = useState<Branch[]>([])

  const [showChangeBranchModal, setShowChangeBranchModal] = useState(false)
  const [pendingBranch, setPendingBranch] = useState<Branch | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      const branches = await getBranches()
      setBranches(branches)

      if (!selectedBranch && branches.length > 0) {
        setIsBranchModalOpen(true)
      }
    }

    fetchBranches()
  }, [])

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false)

  const handleChangeBranch = () => {
    setIsBranchModalOpen(true)
  }

  const handleSelectBranch = (branch: Branch) => {
    const isSameBranch = selectedBranch?.id === branch.id

    if (!isSameBranch && cart.length > 0) {
      setPendingBranch(branch)
      setShowChangeBranchModal(true)
      return
    }

    setSelectedBranch(branch)
    setIsBranchModalOpen(false) // Close the modal after selecting a branch
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto pl-1 pr-3 sm:px-4 relative">

        <div className="flex justify-between items-center h-20 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1"
          >
            <Link href="/" className="flex items-center gap-2 dark:bg-muted-foreground p-2 rounded-3xl transition-colors">
              <Image
                src="/images/logo.webp"
                alt="la navy logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </Link>
          </motion.div>

          {/* Center section - Branch info */}
          <div className="hidden md:flex items-center">
            {selectedBranch
              ? (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleChangeBranch}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <div className="text-left flex gap-2 items-center">
                    <div className="text-xs text-muted-foreground">Sucursal</div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {selectedBranch.name}
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>)
              : (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleChangeBranch}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Seleccionar sucursal</span>
                </motion.button>)
            }
          </div>
          {/* Navigation buttons */}
          <div className="flex items-center space-x-3">

            {/* Category button */}
            <Button variant="ghost" size="sm" onClick={toggleCategories} className="flex items-center md:hidden">
              <List className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Categorías</span>
            </Button>

            {/* Cart button */}
            <Button variant="ghost" size="sm" onClick={openSideCart} className="flex items-center relative">
              <ShoppingCart className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-1.5 py-0.5 text-xs rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Branch selector for mobile */}
        <div className="md:hidden absolute right-0 sm:right-1/3 -bottom-1">
          {selectedBranch
            ? (
              <Button variant="link" size="sm" onClick={handleChangeBranch} className="flex items-center gap-1 px-2 transition-colors dark:text-primary-foreground ">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-medium truncate">{selectedBranch.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>)
            : (
              <Button variant="ghost" size="sm" onClick={handleChangeBranch} className="flex items-center gap-1 px-2">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Sucursal</span>
              </Button>)
          }
        </div>
      </div>

      <Suspense fallback={<div className="p-4">Cargando sucursales...</div>}>
        <BranchSelectorModal isOpen={isBranchModalOpen} onClose={() => { setIsBranchModalOpen(false) }} branches={branches} selectedBranchId={selectedBranch?.id} onSelectBranch={handleSelectBranch} />
      </Suspense>

      <Dialog open={showChangeBranchModal} onOpenChange={setShowChangeBranchModal}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle>¿Cambiar de sucursal?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Esto eliminará los productos que tienes en tu carrito actual.
            </DialogDescription>
          </DialogHeader>

          <div className="text-center my-4">
            <p className="font-semibold text-lg">{pendingBranch?.name}</p>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowChangeBranchModal(false)
                setPendingBranch(null)
              }}

            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingBranch) {
                  clearCart()
                  setSelectedBranch(pendingBranch)
                  setPendingBranch(null)
                  setShowChangeBranchModal(false)
                  setIsBranchModalOpen(false)
                  toast.success(`Sucursal cambiada a ${pendingBranch.name}`)
                }
              }}
            >
              Cambiar sucursal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </header>
  )
}
