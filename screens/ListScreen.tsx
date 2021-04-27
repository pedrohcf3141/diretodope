import * as React from 'react'
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RankedTreeType, BottomTabParamList, ListParamList } from '../types'

import SearchBar from '../components/SearchBar'
import RatingStars from '../components/RatingStars'

import { useTreesData } from '../context/TreesDataContext'
import { useMapData } from '../context/MapDataContext'
import { getTreeTitle, getFullAddress } from '../utils/treeUtils'

type ItemProps = {
  item: RankedTreeType
  openMap: () => void
  editItem: () => void
}

const Item = ({ item, openMap, editItem }: ItemProps) => (
  <View key={item.id} style={styles.itemContainer}>
    <Image
      style={styles.image}
      resizeMode='cover'
      source={
        item.image
          ? { uri: item.image }
          : require('../assets/images/cover-placeholder.png')
      }
    />
    <View style={styles.content}>
      <Text style={styles.title}>{getTreeTitle(item)}</Text>
      <RatingStars
        rating={item.averageRating}
        totalReviews={item.totalReviews}
      />

      <Text style={styles.description} numberOfLines={3}>
        {getFullAddress(item)}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openMap()} style={styles.button}>
          <FontAwesome5 name='map-marker-alt' size={14} color={Colors.tint} />
          <Text style={[styles.buttonText]}>Mostrar no mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editItem()} style={styles.button}>
          <FontAwesome5 name='edit' size={14} color={Colors.tint} />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

const Separator = () => <View style={styles.separator} />

type ListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'List'>,
  StackNavigationProp<ListParamList, 'ListScreen'>
>

export default function ListScreen({
  navigation,
}: {
  navigation: ListScreenNavigationProp
}) {
  const { trees, searchTerm } = useTreesData()
  const { setSelectedMarkerId } = useMapData()

  const renderItem = ({ item }: { item: RankedTreeType }) => (
    <Item
      item={item}
      openMap={() => {
        setSelectedMarkerId(item.id)
        navigation.navigate('Map')
      }}
      // @ts-ignore
      editItem={() => navigation.navigate('EditScreen', { id: item.id })}
    />
  )

  return (
    <View style={styles.container}>
      <SearchBar position='relative' />

      {!trees.length && (
        <View style={styles.notFound}>
          <Text>Nenhum resultado encontrado para "{searchTerm}"</Text>
        </View>
      )}

      <FlatList
        data={trees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
      />
    </View>
  )
}

const imageSize = Math.round(Layout.window.width / 3.2)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  notFound: {
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },

  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.offblack,
    paddingLeft: 4,
    marginTop: 10,
    marginBottom: 10,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  buttonText: {
    color: Colors.tint,
    marginLeft: 8,
  },

  separator: {
    backgroundColor: '#eee',
    height: 1,
    width: Layout.window.width - 32,
    alignSelf: 'center',
  },
})
