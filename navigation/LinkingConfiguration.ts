import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Map: {
            screens: {
              MapScreen: 'map',
            },
          },
          List: {
            screens: {
              ListScreen: 'list',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
