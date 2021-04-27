import * as React from 'react'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import { Alert } from 'react-native'

export type UserLocationType = Location.LocationObject & {
  addressComponents?: Location.LocationGeocodedAddress
}

type MapDataContextType = {
  mapRef: React.RefObject<MapView> | null
  userLocation: UserLocationType | null
  setUserLocation: (location: Location.LocationObject) => void
  reverseGeocodeUserLocation: (onError?: () => void) => void
  isMapReady: boolean
  setMapReady: (state: boolean) => void
  selectedMarkerId: string | null
  setSelectedMarkerId: (id: string | null) => void
}

const MapDataContext = React.createContext<MapDataContextType>({
  mapRef: null,
  userLocation: null,
  setUserLocation: () => null,
  reverseGeocodeUserLocation: () => null,
  isMapReady: false,
  setMapReady: () => null,
  selectedMarkerId: null,
  setSelectedMarkerId: () => {},
})

export function useMapData() {
  return React.useContext(MapDataContext)
}

export function MapDataProvider({ children }: any) {
  const [isMapReady, setMapReady] = React.useState(false)
  const mapRef = React.useRef<MapView>(null)
  const [
    userLocation,
    setUserLocation,
  ] = React.useState<UserLocationType | null>(null)

  const [selectedMarkerId, setSelectedMarkerId] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    let positionWatcher = { remove: () => {} }

    ;(async () => {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Erro',
          'Precisamos da sua localização para mostrar árvores próximas a você'
        )
        return
      }

      if (!isMapReady || !mapRef.current) return

      // set initial map center to user's location
      const { coords: center } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      })

      setTimeout(() => {
        mapRef.current?.setCamera({ center, zoom: 12 })
      }, 300)

      positionWatcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest },
        (location) => setUserLocation(location)
      )
    })()

    return () => positionWatcher.remove()
  }, [isMapReady, mapRef.current])

  const reverseGeocodeUserLocation = React.useCallback(
    async (onError?: () => void) => {
      if (!userLocation?.addressComponents && userLocation?.coords.latitude) {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Erro',
            'Precisamos da sua localização para saber onde esta árvore se encontra',
            [{ text: 'OK', onPress: () => onError && onError() }]
          )

          return
        }

        const addressComponents = await Location.reverseGeocodeAsync({
          latitude: userLocation?.coords.latitude,
          longitude: userLocation?.coords.longitude,
        })

        setUserLocation({
          ...userLocation,
          addressComponents: addressComponents[0],
        })
      }
    },
    [userLocation]
  )

  const contextValue = React.useMemo(
    () => ({
      mapRef,
      isMapReady,
      setMapReady,
      selectedMarkerId,
      setSelectedMarkerId,
      userLocation,
      setUserLocation,
      reverseGeocodeUserLocation,
    }),
    [
      mapRef,
      userLocation,
      setUserLocation,
      isMapReady,
      setMapReady,
      selectedMarkerId,
      setSelectedMarkerId,
      reverseGeocodeUserLocation,
    ]
  )

  return (
    <MapDataContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </MapDataContext.Provider>
  )
}
