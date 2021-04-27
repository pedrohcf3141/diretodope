import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import ModalSelector from 'react-native-modal-selector'

import Colors from '../constants/Colors'

import { useTreesData } from '../context/TreesDataContext'

const sortOptions = [
  { key: 'title', label: 'Ordernar lista', section: true },
  { key: 'distance', label: 'Distância' },
  { key: 'averageRating', label: 'Nota média' },
  { key: 'quality', label: 'Qualidade' },
  { key: 'security', label: 'Segurança' },
]

export default function HeaderLeft() {
  const { sortParam, setSortParam } = useTreesData()

  return (
    <View style={styles.container}>
      <ModalSelector
        data={sortOptions.map((option) => {
          if (option.key !== sortParam) return option
          // add checkmark to display selected option
          return { ...option, label: `✓ ${option.label}` }
        })}
        selectedKey={sortParam}
        onChange={(item) => setSortParam(item.key)}
        cancelText='cancelar'
        selectedItemTextStyle={styles.selectedSort}
      >
        <View style={styles.button}>
          <FontAwesome5
            name='sort-amount-down'
            size={18}
            color={Colors.offblack}
          />
        </View>
      </ModalSelector>
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

  selectedSort: {
    fontWeight: '600',
  },
})
