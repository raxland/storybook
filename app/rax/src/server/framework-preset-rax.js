const webpack = require('webpack');
const path = require('path');

export function babelDefault(config) {
  return {
    ...config,
    presets: [
      ...config.presets,
      [
        require.resolve('babel-preset-rax'),
        { development: process.env.BABEL_ENV === 'development' },
      ],
    ],
  };
}

export function webpackFinal(config) {
  // Remove rule for /\.css$/
  const rules = config.module.rules.filter(rule => {
    return !rule.test.test('index.css');
  });
  const polyfills = path.resolve(__dirname, '../client/polyfills.js');
  const entry = config.entry.filter(_entry => {
    return _entry.includes('config.js');
  });
  const plugins = config.plugins.filter(plugin => {
    return !(plugin instanceof webpack.HotModuleReplacementPlugin);
  });

  return {
    ...config,
    entry: entry.concat(polyfills),
    plugins,
    module: {
      ...config.module,
      rules: [
        ...rules,
        {
          test: /\.css$/,
          use: [require.resolve('stylesheet-loader')],
        },
      ],
    },
    optimization: {
      minimizer: config.minimizer,
    },
  };
}
