'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglifyjs'),
    del = require('del'),
	rename  = require('gulp-rename'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	cache = require('gulp-cache');


gulp.task('browser-sync', function(){
	browserSync({
		proxy: { target: "WebFastStart", },
		notify: false
	});
})

// таблицы стилей библиотек
gulp.task('style-libs', function(){
	return gulp.src(['src/css/*.css', '!src/css/style.css'])
	.pipe(rename({dirname: ''}))
	.pipe(concat('libs.css'))
	.pipe(cssnano())
	.pipe(gulp.dest('src/css'))
})

// таблицы стилей
gulp.task('style', function(){
	return gulp.src(['src/**/**/**/**/*.sass', '!src/sass/vars.sass', '!src/sass/default.sass', '!src/sass/mixins.sass'])
	.pipe(plumber({errorHandler: notify.onError("ERROR: <%= error.message %>")}))
	.pipe(sass())
	.pipe(rename({dirname: ''}))
	.pipe(concat('style.css'))
	.pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream:true}))
})

// js библиотеки
gulp.task('scripts-libs', function(){
	return gulp.src(['src/libs/*.js'])
	.pipe(rename({dirname: ''}))
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/libs'))
})

// js код
gulp.task('scripts', function(){
	return gulp.src(['src/js/*.js'])
	.pipe(rename({dirname: ''}))
	.pipe(concat('scripts.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
})



gulp.task('default', ['browser-sync', 'style', 'scripts' ], function() {
	gulp.watch('src/**/**/**/**/*.sass',['style'])
	gulp.watch('src/**/**/**/**/*.+(php|html|js)',browserSync.reload)
});

gulp.task('build', [''], function() {

	

});


gulp.task('clear', function () {
    return cache.clearAll();
})