'use client'

import { useEffect, useRef } from 'react'

interface GoogleMapsProps {
  isOpen: boolean
  onLocationChange?: (address: string, area: string, lat: number, lng: number) => void
  moveToLocation: { lat: number, lng: number } | null
  initialLocation: { lat: number, lng: number }
}

export const GoogleMaps = ({ isOpen, onLocationChange, moveToLocation, initialLocation }: GoogleMapsProps) => {
  const hasMoveToLocation = !!moveToLocation && moveToLocation.lat !== 0 && moveToLocation.lng !== 0
  const mapRef = useRef<HTMLDivElement>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)

  // Function to reverse geocode coordinates to address
  // reverse geocode helper
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!geocoderRef.current) return

    try {
      const response = await geocoderRef.current.geocode({
        location: { lat, lng }
      })

      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        const address = result.formatted_address

        // Extract area/neighborhood from address components
        let area = ''
        for (const component of result.address_components) {
          if (
            component.types.includes('sublocality') ||
            component.types.includes('neighborhood') ||
            component.types.includes('locality')
          ) {
            area = component.long_name
            break
          }
        }

        // Call callback
        if (onLocationChange) {
          onLocationChange(address, area, lat, lng)
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  // Move to location handler
  useEffect(() => {
    if (hasMoveToLocation && mapInstanceRef.current && markerRef.current) {
      reverseGeocode(moveToLocation.lat, moveToLocation.lng)

      mapInstanceRef.current.setCenter(moveToLocation)
      markerRef.current.position = moveToLocation
    }
  }, [moveToLocation])

  // Initialize Google Maps
  useEffect(() => {
    if (!isOpen || !mapRef.current) return

    const initMap = async () => {
      try {
        // Load Google Maps API
        const { Loader } = await import('@googlemaps/js-api-loader')

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geocoding']
        })

        const { Map } = await loader.importLibrary('maps')
        const { AdvancedMarkerElement } = await loader.importLibrary('marker')

        // Initialize geocoder
        const geocoder = new google.maps.Geocoder()
        geocoderRef.current = geocoder

        const hasInitialLocation = initialLocation?.lat !== 0 && initialLocation?.lng !== 0

        // location Londres
        const defaultLocation = { lat: 51.507351, lng: -0.127758 }

        // Set initial location
        // If moveToLocation → priority
        // If not, use initialLocation if it exists
        // If not, use default
        const location = hasMoveToLocation
          ? { lat: moveToLocation.lat, lng: moveToLocation.lng }
          : hasInitialLocation
            ? { lat: initialLocation.lat, lng: initialLocation.lng }
            : defaultLocation
        const options: google.maps.MapOptions = {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapId: 'map'
        }

        const map = new Map(mapRef.current as HTMLElement, options)
        mapInstanceRef.current = map

        const draggableMarker = new AdvancedMarkerElement({
          map,
          position: location,
          gmpDraggable: true,
          title: 'Arrastra para seleccionar ubicación'
        })

        markerRef.current = draggableMarker

        // Handle marker drag end
        draggableMarker.addListener('dragend', () => {
          const position = draggableMarker.position
          if (position) {
            // Access lat and lng as properties (they are getters)
            const lat = position.lat as number
            const lng = position.lng as number
            reverseGeocode(lat, lng)
          }
        })

        // Handle map click
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            draggableMarker.position = event.latLng
            reverseGeocode(event.latLng.lat(), event.latLng.lng())
          }
        })
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current)
      }
      if (markerRef.current) {
        google.maps.event.clearInstanceListeners(markerRef.current)
      }
    }
  }, [isOpen])

  return (
    <div ref={mapRef} className='w-full h-full' />
  )
}
