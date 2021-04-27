import firebase from 'firebase/app';
import 'firebase/database';
import { useEffect } from 'react';
import { LogBox } from 'react-native'

import { TreeType } from '../types'

import { FIREBASE_CONFIG } from '../constants/Keys'

// firebase makes RN throw this unnecessary error that can be safely ignored
// https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs(['Setting a timer']);

export function useInitializeDatabase () {
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
  }, [])
}


export default () => firebase.database()

export function listenForTrees (callback: (trees: TreeType[]) => void) {
  firebase.database().ref('trees/').on('value', (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => firebase.database().ref('trees/').off()
}

export function createTree (data: Omit<TreeType, 'id'>) {
  const newTreeKey = firebase.database().ref().child('trees').push().key;
  return firebase
    .database()
    .ref('/trees/' + newTreeKey)
    .update({...data, id: newTreeKey});
}

export function updateTree (id: string, data: Omit<TreeType, 'id'>) {
  return firebase
    .database()
    .ref('/trees/' + id)
    .update(data);
}

export function removeTree (id: string) {
  return firebase.database().ref('/trees/' + id).remove();
}

export function batchCreateTrees (data: Omit<TreeType, 'id'>[]) {
  const updates = {}

  data.forEach(tree => {
    const newTreeKey = firebase.database().ref().child('trees').push().key;
    const treeData = {...tree, id: newTreeKey}
    // @ts-ignore
    updates['/trees/' + newTreeKey] = treeData
  })
  
  return firebase.database().ref().update(updates);
}