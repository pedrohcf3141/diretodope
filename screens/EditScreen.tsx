import * as React from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native'
import * as Location from 'expo-location'

import { FontAwesome5 } from '@expo/vector-icons'
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import FruitsList, { FruitGroups } from '../constants/Fruits'

import { useEditingTree } from '../context/EditingTreeContext'
import { useMapData } from '../context/MapDataContext'

import { BottomTabParamList, ListParamList } from '../types'

import { getFullAddress } from '../utils/treeUtils'
import * as imagePicker from '../utils/imagePicker'

import Picker from '../components/Picker'

const isIOS = Platform.OS === 'ios'

type EditScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'List'>,
  StackNavigationProp<ListParamList, 'EditScreen'>
>

type EditScreenProps = {
  navigation: EditScreenNavigationProp
  route: RouteProp<ListParamList, 'EditScreen'>
}

const getStreetAddress = (address: Location.LocationGeocodedAddress) => {
  if (address.name && address.street) {
    // if address.name is a number, it is the address number
    return Number.isNaN(Number(address.name))
      ? address.name
      : `${address.street}, ${address.name}`
  }

  return address.name
}

export default function EditScreen(props: EditScreenProps) {
  const { navigation, route } = props
  // @ts-ignore
  const { id, pickedImage } = route?.params || {}

  const {
    editingId,
    setEditingId,
    data,
    setData,
    changeField,
    saveData,
    deleteData,
  } = useEditingTree()

  const { userLocation, reverseGeocodeUserLocation } = useMapData()

  const goBack = () => navigation.navigate('ListScreen')

  React.useEffect(() => {
    if (data.address || id) return

    if (!userLocation?.addressComponents) {
      reverseGeocodeUserLocation(() => goBack())
    } else {
      const address = userLocation.addressComponents
      setData({
        ...data,
        address: getStreetAddress(address),
        neighborhood: address.district,
        postalCode: address.postalCode,
        city: address.city || address.subregion,
        state: address.region,
        country: address.country,
        coordinate: {
          latitude: userLocation?.coords.latitude,
          longitude: userLocation?.coords.longitude,
        },
      })
    }
  }, [userLocation, data])

  React.useEffect(() => {
    if (id !== editingId) {
      setEditingId(id || null)
    }
  }, [id, editingId])

  React.useEffect(() => {
    if (isIOS && pickedImage && pickedImage !== data.image) {
      changeField('image', pickedImage)
    }
  }, [pickedImage, data.image])

  const handleImagePicker = (photoMode: string) => {
    const goBackOnIOS = isIOS ? goBack : () => {}
    const comeBack = () => {
      // @ts-ignore
      isIOS && navigation.navigate(route.name, { id })
    }
    const saveImage = (pickedImage: string) => {
      if (isIOS) {
        // @ts-ignore
        navigation.navigate(route.name, { id, pickedImage })
      } else {
        changeField('image', pickedImage)
      }
    }

    if (photoMode.startsWith('Tirar')) {
      imagePicker.takePhoto(goBackOnIOS, saveImage, comeBack)
    } else {
      imagePicker.pickImage(goBackOnIOS, saveImage, comeBack)
    }
  }

  const isDataValid = !!data.address && !!data.fruit && !!data.fruitGroup

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Endereço da árvore</Text>
        <Text style={[styles.description, styles.italic]}>
          Sua localização atual
        </Text>
        <View style={styles.addressContainer}>
          <View>
            <FontAwesome5
              name='location-arrow'
              size={14}
              color='rgba(0,0,0,0.5)'
            />
          </View>
          <Text style={[styles.description, styles.address]}>
            {!!data.address
              ? getFullAddress(data)
              : 'Carregando sua localização atual...'}
          </Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Fruta</Text>
        <Picker
          data={FruitsList}
          initialValue={data.fruit}
          value={data.fruit}
          onChange={(fruit) => {
            // @ts-ignore
            changeField('fruit', fruit)
          }}
          placeholder='Escolha uma fruta'
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Grupo da Fruta</Text>
        <Picker
          data={FruitGroups}
          initialValue={data.fruitGroup}
          value={data.fruitGroup}
          onChange={(fruitGroup) => {
            // @ts-ignore
            changeField('fruitGroup', fruitGroup)
          }}
          placeholder='Escolha um grupo de frutas'
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Foto da árvore</Text>
        {!!data.image && (
          <Image
            source={{ uri: data.image }}
            resizeMode='cover'
            style={styles.image}
          />
        )}
        <Picker
          data={['Tirar foto...', 'Selecionar foto...']}
          initialValue={''}
          value={''}
          onChange={handleImagePicker}
          placeholder='Tirar ou selecionar foto'
          inputIcon='camera'
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (!isDataValid) {
            Alert.alert('Erro', 'Por favor preencha todos os campos')
            return
          }

          saveData(() => {
            Alert.alert('Sucesso', 'Árvore salva!', [
              { text: 'OK', onPress: () => goBack() },
            ])
          })
        }}
        style={styles.saveButton}
      >
        <FontAwesome5 name='save' size={16} color={Colors.offwhite} />
        <Text style={styles.saveButtonText}>SALVAR</Text>
      </TouchableOpacity>

      {!!data.id && (
        <TouchableOpacity
          onPress={() => {
            deleteData(() => {
              goBack()
              Alert.alert('Sucesso', 'Árvore deletada!')
            })
          }}
          style={styles.deleteButton}
        >
          <FontAwesome5 name='trash-alt' size={16} color='rgba(0,0,0,0.3)' />
          <Text style={styles.deleteButtonText}>DELETAR</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 48,
  },
  inputIcon: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.offblack,
  },
  italic: {
    fontStyle: 'italic',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  address: {
    paddingLeft: 16,
  },
  image: {
    width: Layout.window.width - 32,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: Colors.tint,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },

  deleteButton: {
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  deleteButtonText: {
    color: Colors.offblack,
    fontWeight: '600',
    marginLeft: 8,
  },
})
