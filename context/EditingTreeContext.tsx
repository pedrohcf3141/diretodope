import * as React from 'react'

import { useTreesData } from './TreesDataContext'

type EditingTreeContextType = {
  data: any
  setData: (data: any) => void
  changeField: (field: string, value: any) => void
  editingId: string | null
  setEditingId: (id: string) => void
  saveData: (onSave?: () => void) => void
  deleteData: (onDelete?: () => void) => void
}

const EditingTreeContext = React.createContext<EditingTreeContextType>({
  data: {},
  setData: () => {},
  changeField: () => {},
  editingId: null,
  setEditingId: () => {},
  saveData: () => {},
  deleteData: () => {},
})

export function useEditingTree() {
  return React.useContext(EditingTreeContext)
}

export function EditingTreeProvider({ children }: any) {
  const [data, setData] = React.useState(buildInitialData())
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const { trees, createTree, updateTree, removeTree } = useTreesData()

  const cleanupData = () => {
    setData(buildInitialData())
  }

  const item = trees.find((t) => t.id === editingId)
  const dataId = data.id
  React.useEffect(() => {
    if (item && item.id !== dataId) {
      // @ts-ignore
      setData(buildInitialData(item))
    } else if (!item) {
      cleanupData()
    }
  }, [item, dataId])

  const changeField = React.useCallback(
    (field, value) => {
      setData({ ...data, [field]: value })
    },
    [data]
  )

  const saveData = React.useCallback(
    (onSave?: () => void) => {
      const dataToSave = data
      cleanupData()

      if (editingId) {
        updateTree(editingId, dataToSave)
        onSave && onSave()
        return
      }

      createTree(dataToSave)
      onSave && onSave()
    },
    [data, editingId, createTree, updateTree]
  )

  const deleteData = React.useCallback(
    (onDelete?: () => void) => {
      if (data?.id) {
        removeTree(data.id)
        cleanupData()
        onDelete && onDelete()
      }
    },
    [data, removeTree]
  )

  const contextValue = React.useMemo(
    () => ({
      data,
      setData,
      changeField,
      editingId,
      setEditingId,
      saveData,
      deleteData,
    }),
    [data, setData, changeField, editingId, setEditingId, saveData, deleteData]
  )

  return (
    <EditingTreeContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </EditingTreeContext.Provider>
  )
}

function buildInitialData(item = {}) {
  return {
    id: '',
    image: '',
    fruit: '',
    fruitGroup: '',
    coordinate: { latitude: 0, longitude: 0 },
    address: '',
    neighborhood: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    ...item,
  }
}
