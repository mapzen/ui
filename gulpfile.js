'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')

var paths = {
  styles: 'stylesheets/**/*.scss'
}

gulp.task('default', ['watch'])

gulp.task('sass', function () {
  gulp.src(paths.styles)
    .pipe(sass())
    .pipe(gulp.dest('demo/stylesheets'))
})

gulp.task('watch', function () {
  gulp.watch(paths.styles, ['sass'])
})
