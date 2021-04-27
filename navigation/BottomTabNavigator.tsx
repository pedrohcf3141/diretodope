import * as React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import MapScreen from '../screens/MapScreen'
import ListScreen from '../screens/ListScreen'
import EditScreen from '../screens/EditScreen'
import { BottomTabParamList, MapParamList, ListParamList } from '../types'

import HeaderLeft from '../components/HeaderLeft'
import HeaderRight from '../components/HeaderRight'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName='Map'
      tabBarOptions={{ activeTintColor: '#2f95dc', showLabel: false }}
    >
      <BottomTab.Screen
        name='Map'
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='map-marked-alt' color={color} />
          ),
          tabBarLabel: 'Mapa',
        }}
      />
      <BottomTab.Screen
        name='List'
        component={ListNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name='list' color={color} />,
          tabBarLabel: 'Lista',
        }}
      />
    </BottomTab.Navigator>
  )
}

// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name']
  color: string
}) {
  return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />
}

const MapStack = createStackNavigator<MapParamList>()

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name='MapScreen'
        component={MapScreen}
        options={{
          headerTitle: 'Mapa de frutas',
          headerRight: HeaderRight,
        }}
      />
    </MapStack.Navigator>
  )
}

const ListStack = createStackNavigator<ListParamList>()

function ListNavigator() {
  return (
    <ListStack.Navigator>
      <ListStack.Screen
        name='ListScreen'
        component={ListScreen}
        options={{
          headerLeft: HeaderLeft,
          headerTitle: 'Lista de frutas',
          headerRight: HeaderRight,
        }}
      />
      <ListStack.Screen
        name='AddScreen'
        component={EditScreen}
        options={{
          headerTitle: 'Adicionar árvore frutífera',
          headerBackTitle: 'Voltar',
        }}
      />
      <ListStack.Screen
        name='EditScreen'
        component={EditScreen}
        options={{
          headerTitle: 'Editar árvore frutífera',
          headerBackTitle: 'Voltar',
        }}
      />
    </ListStack.Navigator>
  )
}
