import pluralize from 'pluralize'

import { RankedTreeType } from '../types'

export const getFullAddress = (tree: RankedTreeType) =>
  `${tree.address} - ${tree.neighborhood}, ${tree.city} - ${tree.state}, ${tree.postalCode}`


export const getTreeTitle = (tree: RankedTreeType) =>
  `${pluralize(tree.fruit)} no ${tree.neighborhood}`