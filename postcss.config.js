module.exports = (ctx) => ({
  parser: ctx.parser ? 'sugarss' : false,
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    'postcss-css-variables': {},
    'autoprefixer': {
      remove: false,
      grid: true
    },
    'css-mqpacker': {
      sort: true
    },
    cssnano: ctx.env === 'production' ? {
      zindex: false,
      autoprefixer: false,
      mergeRules: false
    } : false
  }
});