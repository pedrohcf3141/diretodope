import * as React from 'react'
import { LatLng } from 'react-native-maps'

import { GOOGLE_MAP_KEY } from '../constants/Keys'

export type TravelMode = 'driving' | 'walking' | 'bicycling'
type DirectionsType = { from: LatLng; to: LatLng, mode: TravelMode }
type DirectionsResponseType = {
  distance: string
  duration: string
  steps: LatLng[]
  mode: TravelMode
}

// @ts-ignore
const latLngToString = ({ latitude, longitude }) => `${latitude},${longitude}`

const getCacheKey = ({ from, to, mode }: DirectionsType) =>
  `${mode}|${latLngToString(from)}|${latLngToString(to)}`

export default function useMapDirections() {
  const [directionsCache, setDirectionsCache] = React.useState({})
  const [directionsLoading, setDirectionsLoading] = React.useState(false)
  const [currentDirections, setCurrentDirections] = React.useState<DirectionsResponseType | null>(null)
  const [
    requestedDirections,
    setRequestedDirections,
  ] = React.useState<DirectionsType | null>(null)

  const getDirections = React.useCallback(
    async ({ from, to, mode }: DirectionsType) => {
      const cacheKey = getCacheKey({ from, to, mode })

      // @ts-ignore
      const cachedResponse = directionsCache[cacheKey]
      if (cachedResponse) {
        return cachedResponse
      }

      setDirectionsLoading(true)
      const origin = latLngToString(from)
      const destination = latLngToString(to)
      const response = await fetchDirections(origin, destination, mode)

      setDirectionsCache({
        ...directionsCache,
        [cacheKey]: response,
      })

      setDirectionsLoading(false)
      return response
    },
    [directionsCache]
  )

  React.useEffect(() => {
    if (!requestedDirections) return
    ;(async () => {
      const response = await getDirections(requestedDirections)
      setCurrentDirections(response)
      setRequestedDirections(null)
    })()
  }, [requestedDirections])

  const requestDirections = React.useCallback(
    ({ from, to, mode }: DirectionsType) => {
      setRequestedDirections({ from, to, mode })
    },
    []
  )

  const hideDirections = React.useCallback(() => {
    setCurrentDirections(null)
    setRequestedDirections(null)
    setDirectionsLoading(false)
  }, [])
  
  return { directionsLoading, currentDirections, requestDirections, hideDirections }
}


async function fetchDirections(origin: string, destination: string, mode: TravelMode = 'driving') {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${GOOGLE_MAP_KEY}`
    )
    const data = await response.json()

    if (data.routes.length > 0) {
      const route = data.routes[0].legs[0]

      const distance = route.distance.text
      const duration = route.duration.text
      const steps = decodePolyline(route.steps)
      
      return {
        distance,
        duration,
        steps,
        mode,
      }
    }
    return
  } catch (error) {
    console.error('error fetching directions -\n')
  }
}

// @ts-ignore
function decodePolyline(t) {
  let points = [];
  for (let step of t) {
    let encoded = step.polyline.points;
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
  }
  return points;
}
