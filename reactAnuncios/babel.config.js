module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      // (opcional) si usas Reanimated:
      'react-native-reanimated/plugin',
    ],
  };
};
