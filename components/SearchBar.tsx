import * as React from 'react'
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

import { useTreesData } from '../context/TreesDataContext'

export default function SearchBar({ position = 'absolute' }) {
  const {
    isSearching,
    setIsSearching,
    searchTerm,
    setSearchTerm,
  } = useTreesData()
  if (!isSearching) return null
  return (
    <View
      style={[
        styles.container,
        position === 'absolute' && styles.containerAbsolute,
      ]}
    >
      <View style={styles.row}>
        <FontAwesome5 name='search' size={16} color={'rgba(0,0,0,0.3)'} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder='Buscar frutas'
          placeholderTextColor='rgba(0,0,0,0.4)'
          style={styles.input}
          autoFocus
          returnKeyType='search'
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          setIsSearching(false)
          setSearchTerm('')
        }}
        style={styles.closeButton}
      >
        <FontAwesome5 name='times-circle' size={14} color={Colors.offblack} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width,
    height: 40,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    paddingLeft: 16,
  },
  containerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 16,
  },
  closeButton: {
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
