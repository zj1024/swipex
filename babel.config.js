module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ]
  const plugins = ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-dynamic-import']

  return {
    presets,
    plugins,
  }
}
