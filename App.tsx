import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import { useInitializeDatabase } from './utils/database'
import Navigation from './navigation'

import { MapDataProvider } from './context/MapDataContext'
import { TreesDataProvider } from './context/TreesDataContext'
import { EditingTreeProvider } from './context/EditingTreeContext'

export default function App() {
  useInitializeDatabase()
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <MapDataProvider>
          <TreesDataProvider>
            <EditingTreeProvider>
              <Navigation />
            </EditingTreeProvider>
          </TreesDataProvider>
        </MapDataProvider>

        <StatusBar style='dark' />
      </SafeAreaProvider>
    )
  }
}
