'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let tslint = require('gulp-tslint');
let sourcemaps = require('gulp-sourcemaps');
let gulpTypings = require("gulp-typings");
let babel = require("gulp-babel");
let util = require('gulp-util');

let tsProject = ts.createProject('tsconfig.json');

const config = {
  dirs: {
    src: './src/**/*.ts',
    build: './dist'
  },
  typings: {
    config: './typings.json'
  },
  lint: {
    files: [
      './src/**/*.ts',
      '!./src/tests/proxy/**/*.ts',
      '!./src/proxy/util/**/*.ts',
      '!./src/proxy/predicates.ts'
    ]
  }
};

gulp.task('typings', () => {
  return gulp.src(config.typings.config)
    .pipe(gulpTypings())
});

gulp.task('transpile', ['typings'], () => {
  return gulp.src(config.dirs.src)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dirs.build));
});

gulp.task('lint', () => {
  return gulp.src(config.lint.files)
    .pipe(tslint())
    .pipe(tslint.report({
      emitError: true,
      summarizeFailureOutput: true
    }))
});

gulp.task('watch', ['transpile'], () => {
  return gulp.watch(config.dirs.src, ['transpile']);
});

gulp.task('build', ['transpile', 'lint']);
gulp.task('default', ['build']);

