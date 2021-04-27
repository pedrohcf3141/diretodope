import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../constants/Colors'

import { RankNumberType } from '../context/TreesDataContext'

type RatingStarsProps = {
  showRating?: boolean
  rating: number
  totalReviews?: number
  theme?: 'light' | 'dark'
  onStarPress?: (star: RankNumberType) => void
  starSize?: number
}

export default function RatingStars({
  showRating = true,
  rating,
  onStarPress,
  totalReviews,
  theme,
  starSize = 14,
}: RatingStarsProps) {
  const stars = [...Array(5)].map((_, index) => {
    const starIndex = index + 1
    const half = !Number.isInteger(rating) && Math.floor(rating) === starIndex
    const star = (
      <FontAwesome
        name={half ? 'star-half-full' : rating >= starIndex ? 'star' : 'star-o'}
        size={starSize}
        color={theme === 'light' ? '#ffde70' : '#ffc400'}
      />
    )

    if (onStarPress) {
      return (
        <TouchableOpacity
          // @ts-ignore
          onPress={() => onStarPress(starIndex)}
          key={starIndex}
          style={{ marginRight: 2 }}
        >
          {star}
        </TouchableOpacity>
      )
    }

    return (
      <View key={index} style={{ marginRight: 2 }}>
        {star}
      </View>
    )
  })

  return (
    <View style={styles.container}>
      {showRating && !!rating && (
        <Text style={[styles.text, theme === 'light' && styles.lightText]}>
          {rating}
        </Text>
      )}
      {stars}
      {!!totalReviews && (
        <Text style={[styles.text, theme === 'light' && styles.lightText]}>
          ({totalReviews})
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginHorizontal: 4,
    color: Colors.offblack,
  },
  lightText: {
    color: Colors.offwhite,
    fontWeight: '600',
  },
})
