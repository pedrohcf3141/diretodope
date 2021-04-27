import * as React from 'react'

import { TreeType, RankedTreeType } from '../types'

import * as db from '../utils/database'
import calculateDistance from '../utils/calculateDistance'

import { useMapData, UserLocationType } from './MapDataContext'

type UpdateTreeData = Omit<
  TreeType,
  'id' | 'qualityRatings' | 'securityRatings'
>

export type RankNumberType = 1 | 2 | 3 | 4 | 5
export type UpdateRatingType = {
  quality: RankNumberType
  security: RankNumberType
}

export type TreesDataContextType = {
  trees: RankedTreeType[]
  createTree: (data: UpdateTreeData) => void
  removeTree: (id: string) => void
  updateTree: (id: string, data: UpdateTreeData) => void
  addTreeRating: (id: string, data: UpdateRatingType) => void
  isSearching: boolean
  setIsSearching: (state: boolean) => void
  searchTerm: string
  setSearchTerm: (search: string) => void
  sortParam: string
  setSortParam: (sort: string) => void
}

const TreesDataContext = React.createContext<TreesDataContextType>({
  trees: [],
  createTree: () => {},
  removeTree: () => {},
  updateTree: () => {},
  addTreeRating: () => {},
  isSearching: false,
  setIsSearching: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  sortParam: '',
  setSortParam: () => {},
})

export function useTreesData() {
  return React.useContext(TreesDataContext)
}

export function TreesDataProvider({ children }: any) {
  const [trees, setTrees] = React.useState<TreeType[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [sortParam, setSortParam] = React.useState('distance')
  const { userLocation } = useMapData()

  React.useEffect(() => {
    const unlisten = db.listenForTrees((treesData) => {
      setTrees(Object.values(treesData))
    })

    return () => unlisten()
  }, [])

  const createTree = React.useCallback(
    (data) => {
      db.createTree(data)
    },
    [trees]
  )

  const updateTree = React.useCallback(
    (id, data) => {
      db.updateTree(id, data)
    },
    [trees]
  )

  const removeTree = React.useCallback(
    (id) => {
      db.removeTree(id)
    },
    [trees]
  )

  const addTreeRating = React.useCallback(
    (id, data) => {
      const tree = trees.find((tree) => tree.id === id)
      if (tree) {
        const treeData = {
          ...tree,
          qualityRatings: tree?.qualityRatings?.concat(data.quality) || [
            data.quality,
          ],
          securityRatings: tree?.securityRatings?.concat(data.security) || [
            data.security,
          ],
        }
        db.updateTree(id, treeData)
      }
    },
    [trees]
  )

  const contextValue = React.useMemo(
    () => ({
      trees: processTreesData(trees, searchTerm, sortParam, userLocation),
      createTree,
      removeTree,
      updateTree,
      addTreeRating,
      isSearching,
      setIsSearching,
      searchTerm,
      setSearchTerm,
      sortParam,
      setSortParam,
    }),
    [
      trees,
      userLocation,
      createTree,
      removeTree,
      updateTree,
      addTreeRating,
      isSearching,
      setIsSearching,
      searchTerm,
      setSearchTerm,
      sortParam,
      setSortParam,
    ]
  )

  return (
    <TreesDataContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </TreesDataContext.Provider>
  )
}

// strip accents
const normalize = (str: string) =>
  (str &&
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()) ||
  ''

function processTreesData(
  trees: TreeType[],
  searchTerm: string,
  sortParam: string,
  userLocation: UserLocationType | null
): RankedTreeType[] {
  return trees
    .filter((tree) => {
      if (!searchTerm) return tree
      const reg = new RegExp(normalize(searchTerm), 'gi')
      return (
        normalize(tree.fruit).match(reg) ||
        normalize(tree?.fruitGroup?.replace(/Frutas/gi, '')).match(reg)
      )
    })
    .map(
      (tree): RankedTreeType => {
        const quality = calculateAverage(tree?.qualityRatings || 0)
        const security = calculateAverage(tree?.securityRatings || 0)
        return {
          ...tree,
          quality,
          security,
          averageRating: calculateWeightedAverage([
            [security, 6],
            [quality, 4],
          ]),
          totalReviews: tree?.qualityRatings?.length || 0,
        }
      }
    )
    .sort((a, b) => {
      switch (sortParam) {
        case 'averageRating':
          return b.averageRating - a.averageRating
        case 'quality':
          return b.quality - a.quality
        case 'security':
          return b.security - a.security
        case 'distance':
        default:
          // if no user location, default to average rating
          if (!userLocation?.coords) {
            return b.averageRating - a.averageRating
          }

          return (
            calculateDistance(userLocation?.coords, a.coordinate) -
            calculateDistance(userLocation?.coords, b.coordinate)
          )
      }
    })
}

function calculateWeightedAverage(n: [number, number][]) {
  const sum = n.reduce((acc, [num, weight]) => acc + num * weight, 0)
  if (sum === 0) return 0

  const weight = n.reduce((acc, [_, weight]) => acc + weight, 0)
  return Number((sum / weight).toPrecision(2))
}

function calculateAverage(n: number[] | number): number {
  if (typeof n === 'number') return n

  const sum = n.reduce((acc, num) => acc + num, 0)
  if (sum === 0) return 0

  const average = sum / n.length
  return Number(average.toPrecision(2))
}
