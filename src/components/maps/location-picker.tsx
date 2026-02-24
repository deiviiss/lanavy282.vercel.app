'use client'

import { MapPin, Navigation } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { GoogleMaps } from './google-maps'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'

interface LocationPickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirmLocation: (address: string, area: string, lat: number, lng: number) => void
  initialAddress: {
    lat: number
    lng: number
    address: string
    area: string
  }
}

export function LocationPicker({ isOpen, onClose, onConfirmLocation, initialAddress }: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const hasLocation = initialAddress.lat !== 0 && initialAddress.lng !== 0

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
    area: string
  } | null>(hasLocation ? { ...initialAddress } : null)

  const [moveToLocation, setMoveToLocation] = useState<{ lat: number, lng: number } | null>(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no disponible', { position: 'top-right' })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setMoveToLocation({ lat: latitude, lng: longitude })
        setIsLoading(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsLoading(false)
        toast.error('No se pudo obtener la ubicación actual', { position: 'top-right' })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const handleMapLocationChange = (address: string, area: string, lat: number, lng: number) => {
    setSelectedLocation({ address, area, lat, lng })
    // Clear the trigger after processing
    setMoveToLocation(null)
    toast.success('Ubicación encontrada', { position: 'top-right' })
  }

  const handleSave = () => {
    if (selectedLocation) {
      onConfirmLocation(selectedLocation.address, selectedLocation.area, selectedLocation.lat, selectedLocation.lng)
      toast.success('Ubicación guardada', { position: 'top-right' })
      onClose()
    } else {
      toast.error('Selecciona una ubicación en el mapa', { position: 'top-right' })
    }
  }

  const handleCancel = () => {
    setSelectedLocation(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-muted rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar ubicación
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-left">
            Selecciona la ubicación donde quieres que se entregue tu pedido.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Map container */}
          <div className="relative">
            <div className="w-full h-64 rounded-lg border bg-muted-foreground/10 overflow-hidden">
              <GoogleMaps
                isOpen={isOpen}
                onLocationChange={handleMapLocationChange}// Callback to receive data
                moveToLocation={moveToLocation} // Tells you where to move
                initialLocation={{
                  lat: initialAddress.lat,
                  lng: initialAddress.lng
                }}
              />
            </div>

            {/* Current location button */}
            <Button
              size="sm"
              className="absolute top-2 right-2 shadow-md"
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              <Navigation className="h-4 w-4" />
              {isLoading ? 'Buscando...' : 'Mi ubicación'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Arrastra el marcador o toca en el mapa para seleccionar la ubicación exacta
          </p>

          {/* Selected address display */}
          {selectedLocation && (
            <div className="p-3 bg-background rounded-lg border">
              <p className="text-sm font-medium">Dirección seleccionada:</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedLocation.address}</p>
              {selectedLocation.area && <p className="text-xs text-muted-foreground"></p>}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="destructive" onClick={handleCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedLocation}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            Guardar ubicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
