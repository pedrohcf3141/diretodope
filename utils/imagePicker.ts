import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

const imagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
  base64: true,
}

export async function takePhoto(
  onLaunchCamera: () => void,
  saveImage: (uri: string) => void,
  onCancel: () => void
) {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  if (status !== 'granted') {
    Alert.alert('Oops', 'Precisamos de permissão para você tirar uma foto')
    return
  }

  onLaunchCamera()

  const result = await ImagePicker.launchCameraAsync(imagePickerOptions)

  if (result.cancelled) {
    onCancel()
    return
  }

  const image = result.base64
    ? 'data:image/jpeg;base64,' + result.base64
    : result.uri

  saveImage(image)
}

export async function pickImage(
  onLaunchLibrary: () => void,
  saveImage: (uri: string) => void,
  onCancel: () => void
) {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') {
    Alert.alert('Oops', 'Precisamos de permissão para você escolher uma foto')
    return
  }

  onLaunchLibrary()

  const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions)

  if (result.cancelled) {
    onCancel()
    return
  }

  const image = result.base64
    ? 'data:image/jpeg;base64,' + result.base64
    : result.uri

  saveImage(image)
}