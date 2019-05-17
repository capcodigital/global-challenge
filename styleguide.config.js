/* eslint-disable global-require */

module.exports = {
  webpackConfig: require('./config/webpack.dev.babel.js'),
  sections: [
    {
      name: 'UI Components',
      components: 'app/components/**/*.component.js',
      exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
      usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
    }
  ],
  ignore: ['**/__tests__/**', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/*.d.ts', '**/homepage/homepage.component.js', '**/header/header.component.js']
};

/* eslint-enable global-require */
