import * as React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import Colors from '../constants/Colors'

import { useTreesData } from '../context/TreesDataContext'

export default function HeaderRight() {
  const { isSearching, setIsSearching } = useTreesData()
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      {!isSearching && (
        <TouchableOpacity
          onPress={() => setIsSearching(true)}
          style={styles.button}
        >
          <FontAwesome5 name='search' size={18} color={Colors.offblack} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('List', {
            screen: 'AddScreen',
            initial: false,
          })
        }
        style={styles.button}
      >
        <FontAwesome5 name='plus-circle' size={24} color={Colors.tint} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 16,
  },
})
