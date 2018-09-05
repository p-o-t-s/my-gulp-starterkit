/**
 * ビルドツールが参照する定義です。
 */
const srcPath = './src';
const distPath = './dist';
const assetsSrcPath = './src/assets';
const assetsDistPath = './dist/assets';

module.exports = {
  src: srcPath,
  dist: distPath,
  entry: {
    assets: {
      src: srcPath,
      dist: distPath,
    },
    assetsJS: {
      src: assetsSrcPath + '/js/**/*.js',
      dist: assetsDistPath + '/js/**/*.js'
    },
    clean: {
      src: './src',
      dist: './dist/**/*',
    },
    css: {
      src: assetsSrcPath + '/css/style.scss',
      dist: assetsDistPath + '/css',
      distFileName: 'style.css'
    },
    cssWatch: {
      src: assetsSrcPath + '/css/**/*.scss',
      dist: assetsDistPath
    },
    jsHome: {
      src: assetsSrcPath + '/js/home.js',
      dist: assetsDistPath + '/js',
      distFileName: 'home.js'
    },
    jsApp: {
      src: [
        assetsSrcPath + '/js/lib/**/*.js',
        assetsSrcPath + '/js/main.js'
      ],
      dist: assetsDistPath + '/js',
      distFileName: 'app.js'
    }
  }
};