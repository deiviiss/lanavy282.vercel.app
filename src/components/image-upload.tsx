'use client'

import { Upload, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  nameImage: string
  value?: string
  previewFile: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
  className?: string
}

export default function ImageUpload({ value, onChange, disabled, className, previewFile, nameImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate preview URL
  const getPreviewUrl = () => {
    if (previewFile instanceof File) {
      return URL.createObjectURL(previewFile)
    }
    if (typeof value === 'string' && value) {
      return value
    }
    return preview
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande. Máximo 2MB permitido')
        return
      }

      onChange(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }

  // const handleRemove = () => {
  //   onChange(null)
  //   setPreview(null)
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""
  //   }
  // }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const previewUrl = getPreviewUrl()

  return (
    <div className={cn('space-y-2', className)}>
      <Label>Imagen {nameImage} *</Label>

      {/* Preview Area */}
      <div className="relative">
        {previewUrl
          ? (
            <div className="relative group">
              <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
                <Image
                  src={previewUrl || '/placeholder.svg'}
                  alt="Vista previa"
                  fill
                  className="object-cover"
                  onError={() => {
                    setPreview(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                />
              </div>

              {/* Remove button */}
              {/* <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button> */}

              {/* Change image overlay */}
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                onClick={handleClick}
              >
                <div className="text-white text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Cambiar imagen</p>
                </div>
              </div>
            </div>)
          : (
            /* Upload Area */
            <div
              className={cn(
                'relative h-48 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={handleClick}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p className="text-sm font-medium mb-1">Subir imagen</p>
                <p className="text-xs text-center px-2">Haz clic para seleccionar</p>
                <p className="text-xs text-muted-foreground/70 mt-2">PNG, JPG, WEBP hasta 2MB</p>
              </div>
            </div>)
        }
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Upload button (alternative) */}
      {!previewUrl && (
        <Button type="button" variant="outline" onClick={handleClick} disabled={disabled} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar imagen
        </Button>
      )}
    </div>
  )
}
