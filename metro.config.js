const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    assetExts: [
      ...defaultConfig.resolver.assetExts,
      'obj',
      'mtl',
      'vrx',
      'gltf',
      'glb',
      'bin',
      'arobject',
      'gif',
    ],
  },
});
