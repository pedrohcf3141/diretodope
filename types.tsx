import { LatLng } from 'react-native-maps'
import { Marker } from 'react-native-maps'

export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  Map: undefined
  List: undefined
}

export type MapParamList = {
  MapScreen: undefined
}

export type ListParamList = {
  ListScreen: undefined
  AddScreen: undefined
  EditScreen: undefined
}

export type TreeType = {
  id: string
  image?: string
  fruit: string
  fruitGroup: string
  coordinate: LatLng
  address: string
  neighborhood: string
  postalCode: string
  city: string
  state: string
  country: string
  qualityRatings?: number[]
  securityRatings?: number[]
}

export type RankedTreeType = Omit<
  TreeType,
  'qualityRatings' | 'securityRatings'
> & {
  quality: number
  security: number
  averageRating: number
  totalReviews: number
}

export type TreeWithRefType = RankedTreeType & { ref: React.RefObject<Marker> }
