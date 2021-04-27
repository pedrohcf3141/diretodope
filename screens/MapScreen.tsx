import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/stack'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

import { useMapData } from '../context/MapDataContext'
import { useTreesData } from '../context/TreesDataContext'
import useMapDirections, { TravelMode } from '../hooks/useMapDirections'
import { getTreeTitle } from '../utils/treeUtils'
import { TreeWithRefType } from '../types'

import MarkerCallout, { CALLOUT_HEIGHT } from '../components/MarkerCallout'
import DirectionsModeTab from '../components/DirectionsModeTab'
import SearchBar from '../components/SearchBar'

const scaleHeight = (ratio: number) => Math.round(Layout.window.height / ratio)
const scaleWidth = (ratio: number) => Math.round(Layout.window.width / ratio)

export default function MapScreen() {
  const {
    mapRef,
    isMapReady,
    setMapReady,
    userLocation,
    selectedMarkerId,
    setSelectedMarkerId,
  } = useMapData()

  const { trees, addTreeRating, searchTerm } = useTreesData()

  const tabBarHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()
  const mapHeight = Layout.window.height - tabBarHeight - headerHeight

  const markersWithRef = React.useMemo(
    () => trees.map((tree) => ({ ...tree, ref: React.createRef<Marker>() })),
    [trees]
  )

  const selectedMarker: TreeWithRefType | undefined = React.useMemo(
    () => markersWithRef.find((tree) => tree.id === selectedMarkerId),
    [selectedMarkerId, markersWithRef]
  )

  React.useEffect(() => {
    if (selectedMarkerId && !selectedMarker) {
      setSelectedMarkerId(null)
    }
  }, [selectedMarkerId, selectedMarker])

  const {
    directionsLoading,
    currentDirections,
    requestDirections,
    hideDirections,
  } = useMapDirections()

  React.useEffect(() => {
    if (currentDirections) {
      mapRef?.current?.fitToCoordinates(currentDirections?.steps, {
        edgePadding: {
          top: scaleHeight(9),
          bottom: scaleHeight(15),
          left: scaleWidth(7),
          right: scaleWidth(7),
        },
      })
    }
  }, [currentDirections])

  React.useEffect(() => {
    if (selectedMarker) {
      // if marker gets selected, center map to it
      setTimeout(() => {
        mapRef?.current?.setCamera({ center: selectedMarker.coordinate })
        selectedMarker.ref.current?.showCallout()
        hideDirections()
      }, 100)
    }
  }, [selectedMarker])

  React.useEffect(() => {
    if (searchTerm && markersWithRef.length) {
      const coordinates = markersWithRef.map((m) => m.coordinate)
      mapRef?.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: scaleHeight(9),
          bottom: scaleHeight(30),
          left: scaleWidth(14),
          right: scaleWidth(14),
        },
      })
    }
  }, [searchTerm, markersWithRef])

  const getDirectionsToMarker = (mode: TravelMode = 'driving') => {
    if (userLocation && selectedMarker) {
      const userLatLng = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      }

      requestDirections({
        from: userLatLng,
        to: selectedMarker.coordinate,
        mode,
      })
    }
  }

  const restoreMap = () => {
    selectedMarker?.ref.current?.hideCallout()
    setSelectedMarkerId(null)
  }

  const showCallout = selectedMarker && !currentDirections?.mode

  return (
    <View style={styles.container}>
      <MapView
        onMapReady={() => setMapReady(true)}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={[
          styles.map,
          isMapReady && {
            // set height only after map is ready so that the user location button appears
            // bug: https://github.com/react-native-maps/react-native-maps/issues/2010
            height: showCallout ? mapHeight - CALLOUT_HEIGHT : mapHeight,
          },
        ]}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
        onPress={(event) => {
          // @ts-ignore - action does exist in nativeEvent
          const { action } = event.nativeEvent
          if (!action || action !== 'marker-press') {
            restoreMap()
          }
        }}
      >
        {markersWithRef.map((marker) => (
          <Marker
            key={marker.id}
            ref={marker.ref}
            coordinate={marker.coordinate}
            onPress={() => {
              marker.id !== selectedMarkerId && hideDirections()
              setSelectedMarkerId(marker.id)
            }}
            title={getTreeTitle(marker)}
            description={
              currentDirections
                ? `${currentDirections?.duration} (${currentDirections?.distance})`
                : undefined
            }
            pinColor={selectedMarker?.id === marker.id ? 'indigo' : undefined}
          />
        ))}

        {selectedMarker && currentDirections?.steps && (
          <Polyline
            coordinates={currentDirections.steps}
            strokeWidth={5}
            strokeColor={Colors.tint}
          />
        )}
      </MapView>

      {selectedMarker && (directionsLoading || currentDirections?.mode) && (
        <DirectionsModeTab
          directionsLoading={directionsLoading}
          currentMode={currentDirections?.mode}
          changeMode={getDirectionsToMarker}
          hideDirections={hideDirections}
        />
      )}

      <SearchBar />

      {showCallout && (
        <MarkerCallout
          // @ts-ignore
          marker={selectedMarker}
          onDirectionsPress={() => getDirectionsToMarker()}
          onClosePress={() => restoreMap()}
          addTreeRating={addTreeRating}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  map: {
    ...Layout.window,
  },
})
