'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let tslint = require('gulp-tslint');

let tsProject = ts.createProject('tsconfig.json');

const config = {
  dirs: {
    src: './src/**/*.ts',
    build: './dist'
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

gulp.task('transpile', () => {
  return gulp.src(config.dirs.src)
    .pipe(tsProject())
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

