'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Phone, Navigation } from 'lucide-react'
import { useState } from 'react'
import { type Branch } from '@/lib/types'

interface BranchSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  branches: Branch[]
  selectedBranchId?: string
  onSelectBranch: (branch: Branch) => void
}

export default function BranchSelectorModal({
  isOpen,
  onClose,
  branches,
  selectedBranchId,
  onSelectBranch
}: BranchSelectorModalProps) {
  const [selectedId, setSelectedId] = useState(selectedBranchId)

  const handleSelectBranch = (branch: Branch) => {
    setSelectedId(branch.id)
    onSelectBranch(branch)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              if (selectedId) onClose()
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-muted rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden border">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Seleccionar Sucursal</h2>
                </div>
                {selectedId && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    aria-label="Cerrar modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-4 max-h-[calc(90vh-140px)] overflow-y-auto">
                <div className="space-y-3">
                  {branches.map((branch) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedId === branch.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }`}
                      onClick={() => { handleSelectBranch(branch) }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{branch.name}</h3>
                        <div className="flex items-center gap-2">
                          {/* {branch.distance && (
                            <Badge variant="outline" className="text-xs">
                              {branch.distance}
                            </Badge>
                          )} */}
                          {/* {branch.isOpen !== undefined && (
                            <Badge variant={branch.isOpen ? 'default' : 'secondary'} className="text-xs">
                              {branch.isOpen ? 'Abierto' : 'Cerrado'}
                            </Badge>
                          )} */}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Navigation className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{branch.address}</span>
                        </div>

                        {branch.hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{branch.hours}</span>
                          </div>
                        )}

                        {branch.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{branch.phone}</span>
                          </div>
                        )}
                      </div>

                      {selectedId === branch.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-3 flex items-center gap-2 text-primary text-sm font-medium"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          Sucursal seleccionada
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Selecciona la sucursal más cercana para ver productos y precios específicos
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
