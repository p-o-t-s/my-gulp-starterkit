if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const config = require('./config');
const {series, parallel, registry, task, src, dest, watch} = require('gulp');
const babel = require('gulp-babel');
const minimist = require('minimist');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const saveLicense = require('uglify-save-license');
const del = require('del');
const eslint = require('gulp-eslint');

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};
const entryExists = (options) => {
  if (options.entry && options.entry in config.entry) {
    return true;
  }

  return false;
};

const knownOptions = {
  string: [
    'env',
    'entry'
  ],
  default: {
    env: process.env.NODE_ENV || 'development',
    entry: config.entry || null
  }
};
const options = minimist(process.argv.slice(2), knownOptions);

if (!entryExists(options)) {
  throw new Error('Entry: ' + options.entry + ' was not exists.');
}

const entry = config.entry[options.entry];

/**
 * @see https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
 */
function clean () {
  return del([entry.dist]);
}

function cssSass () {
  return src(entry.src)
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceMap: true
    }))
    .pipe(postcss())
    .pipe(gulpif('distFileName' in entry && process.env.NODE_ENV === 'production', rename(function (path) {
      path.extname = '.min' + path.extname;
    })))
    .pipe(dest(entry.dist));
}

function cssWatch () {
  watch(entry.src, series(
    cssSass
  ));
}

function jsESLint () {
  return src(entry.src)
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function jsESLintWatch () {
  watch(entry.src, series(
    entry
  ));
}

function jsBabel () {
  return src(entry.src)
    .pipe(gulpif(!isProduction(), sourcemaps.init()))

    .pipe(babel())
    .pipe(concat(entry.distFileName))

    .pipe(gulpif(!isProduction(), sourcemaps.write()))
    .pipe(dest(entry.dist));
}

function jsConcat () {
  return src(entry.src)
    .pipe(concat(entry.distFileName))
    .pipe(dest(entry.dist));
}

function jsMinify (done) {
  if (isProduction()) {
    console.log('Do minify.');

    return src(entry.dist + '/' + entry.distFileName)
      .pipe(rename(function (path) {
        path.extname = '.min' + path.extname;
      }))
      .pipe(uglify({
        output: {
          comments: saveLicense
        }
      }))
      .pipe(dest(entry.dist));
  }

  done();
}

function sourceMap () {

}

exports.clean = series(
  clean
);
exports.css = series(
  cssSass
);
exports.cssWatch = cssWatch;
exports.js = series(
  jsBabel
);
exports.jsESLint = series(
  jsESLint,
);
exports.jsESLintWatch = jsESLintWatch;
exports.jsConcat = series(
  jsConcat
);
exports.jsMinify = series(
  jsMinify
);