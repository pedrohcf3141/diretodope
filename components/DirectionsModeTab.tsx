import * as React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

import { TravelMode } from '../hooks/useMapDirections'

type DirectionsModeTabProps = {
  currentMode?: TravelMode
  changeMode: (mode: TravelMode) => void
  hideDirections: () => void
  directionsLoading: boolean
}

export default function DirectionsModeTab(props: DirectionsModeTabProps) {
  const { currentMode, changeMode, hideDirections, directionsLoading } = props

  const currentColor = (mode: TravelMode) =>
    currentMode === mode ? Colors.tint : Colors.offblack

  return (
    <View style={styles.container}>
      {directionsLoading && !changeMode && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
          <Text style={{ marginLeft: 16 }}>Carregando...</Text>
        </View>
      )}

      {(!directionsLoading || changeMode) && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.changeModeButton}
            onPress={() => changeMode('driving')}
          >
            <FontAwesome5
              name='car'
              size={16}
              color={currentColor('driving')}
            />
            <Text style={[{ marginLeft: 8, color: currentColor('driving') }]}>
              Carro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.changeModeButton, styles.middleButton]}
            onPress={() => changeMode('walking')}
          >
            <FontAwesome5
              name='walking'
              size={16}
              color={currentColor('walking')}
            />
            <Text style={[{ marginLeft: 8, color: currentColor('walking') }]}>
              A pé
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeModeButton}
            onPress={() => changeMode('bicycling')}
          >
            <FontAwesome5
              name='biking'
              size={16}
              color={currentColor('bicycling')}
            />
            <Text style={[{ marginLeft: 8, color: currentColor('bicycling') }]}>
              Bicicleta
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => hideDirections()}
        style={styles.hideButton}
      >
        {directionsLoading && changeMode ? (
          <ActivityIndicator />
        ) : (
          <FontAwesome5 name='times-circle' size={14} color={Colors.offblack} />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: Layout.window.width,
    height: 40,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  changeModeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  middleButton: {
    borderLeftColor: 'rgba(0,0,0,0.1)',
    borderRightColor: 'rgba(0,0,0,0.1)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  hideButton: {
    borderLeftColor: 'rgba(0,0,0,0.1)',
    borderLeftWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
