module.exports = function (api) {
  api.cache(true);
  return {
    plugins: ["@babel/plugin-proposal-export-namespace-from"],
    presets: [
      "babel-preset-expo",
      "module:metro-react-native-babel-preset",
      "@babel/preset-typescript",
    ],
  };
};
