import * as React from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

import { UpdateRatingType, RankNumberType } from '../context/TreesDataContext'

import RatingStars from './RatingStars'

type RatingModalProps = {
  modalVisible: boolean
  onClose: () => void
  saveRating: (data: UpdateRatingType) => void
}

export default function RatingModal(props: RatingModalProps) {
  const { modalVisible, onClose, saveRating } = props

  // @ts-ignore
  const [security, setSecurity] = React.useState<RankNumberType>(0)
  // @ts-ignore
  const [quality, setQuality] = React.useState<RankNumberType>(0)

  return (
    <Modal
      animationType='slide'
      transparent
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Dê uma nota para esta árvore</Text>

          <View style={styles.col}>
            <Text style={styles.text}>Segurança</Text>
            <RatingStars
              rating={security}
              showRating={false}
              onStarPress={setSecurity}
              starSize={40}
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.text}>Qualidade</Text>
            <RatingStars
              rating={quality}
              showRating={false}
              onStarPress={setQuality}
              starSize={40}
            />
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => onClose()}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                CANCELAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                saveRating({ security, quality })
                onClose()
              }}
              style={[styles.button, styles.sendButton]}
            >
              <Text style={[styles.buttonText, styles.sendButtonText]}>
                ENVIAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Layout.window,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  col: {
    marginBottom: 20,
  },
  text: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: Colors.tint,
    marginLeft: 16,
  },
  sendButtonText: {
    color: Colors.white,
  },

  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  cancelButtonText: {
    color: Colors.tint,
  },
})
