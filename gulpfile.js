const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

const config = {
  dirs: {
    src: './src/**/*.js',
    build: './dist'
  },
  eslint: {
    formatter: 'stylish'
  }
};

gulp.task('build', () => {
  return gulp.src(config.dirs.src)
    .pipe(babel())
    .pipe(gulp.dest(config.dirs.build));
});

gulp.task('lint', () => {
  return gulp.src(config.dirs.src)
    .pipe(eslint())
    .pipe(eslint.format(config.eslint.formatter))
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint', 'build']);
