import * as React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

import { TreesDataContextType } from '../context/TreesDataContext'

import { TreeWithRefType } from '../types'
import { getTreeTitle, getFullAddress } from '../utils/treeUtils'

import RatingStars from './RatingStars'
import RatingModal from './RatingModal'

type CalloutProps = {
  marker: TreeWithRefType
  onDirectionsPress: () => void
  onClosePress: () => void
  addTreeRating: TreesDataContextType['addTreeRating']
}

export const CALLOUT_HEIGHT = 300

export default function MarkerCallout(props: CalloutProps) {
  const { marker, onDirectionsPress, onClosePress, addTreeRating } = props

  const [ratingModalVisible, setRatingModalVisible] = React.useState(false)

  return (
    <>
      <View style={styles.callout}>
        <View style={[styles.imageContainer, styles.image]}>
          <Image
            style={[styles.image, StyleSheet.absoluteFill]}
            resizeMode='cover'
            source={
              marker.image
                ? { uri: marker.image }
                : require('../assets/images/cover-placeholder.png')
            }
          />
          <View style={styles.imageInfo}>
            <TouchableOpacity onPress={onClosePress} style={styles.closeButton}>
              <FontAwesome5
                name='times-circle'
                size={24}
                color={Colors.white}
              />
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>

            <View style={styles.ratings}>
              <View style={styles.ratingCol}>
                <Text style={[styles.ratingText, { marginBottom: 4 }]}>
                  Segurança:
                </Text>
                <Text style={styles.ratingText}>Qualidade:</Text>
              </View>
              <View style={styles.ratingCol}>
                <View style={{ marginBottom: 4 }}>
                  <RatingStars theme='light' rating={marker.security} />
                </View>
                <RatingStars theme='light' rating={marker.quality} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.titleContainer]}>
            <Text style={styles.title}>{getTreeTitle(marker)}</Text>
            <RatingStars
              rating={marker.averageRating}
              totalReviews={marker.totalReviews}
            />
          </View>

          <Text style={styles.description}>{getFullAddress(marker)}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onDirectionsPress}
              style={[styles.button, styles.directionsButton]}
            >
              <FontAwesome5
                name='directions'
                size={14}
                color={Colors.offwhite}
              />
              <Text style={[styles.buttonText, styles.directionsButtonText]}>
                ROTA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRatingModalVisible(true)}
              style={[styles.button, styles.reviewButton]}
            >
              <FontAwesome5 name='star' size={14} color={Colors.tint} />
              <Text style={[styles.buttonText, styles.reviewButtonText]}>
                ESTIVE AQUI
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <RatingModal
        modalVisible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        saveRating={(data) => addTreeRating(marker.id, data)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  callout: {
    width: Layout.window.width,
    height: CALLOUT_HEIGHT,
    alignItems: 'center',
  },
  content: {
    width: Layout.window.width,
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.white,
    alignItems: 'flex-start',
  },

  imageContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: Layout.window.width,
    height: 150,
  },
  imageInfo: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  closeButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },

  ratings: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  ratingCol: {
    flexDirection: 'column',
    marginRight: 8,
  },
  ratingText: {
    color: Colors.white,
    fontWeight: '600',
  },

  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 4,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },

  description: {
    fontSize: 14,
    color: Colors.offblack,
    paddingLeft: 4,
    marginBottom: 10,
  },

  actions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  directionsButton: {
    backgroundColor: Colors.tint,
    marginRight: 16,
  },
  directionsButtonText: {
    color: Colors.white,
  },

  reviewButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  reviewButtonText: {
    color: Colors.tint,
  },
})
