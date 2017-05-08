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
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache');


gulp.task('browser-sync', function(){
	browserSync({
		proxy: { target: "WebFastStart", },
		notify: false
	});
})


/////////////// DEVELOPED ///////////////
/////////////// LIBS ///////////////
// таблицы стилей библиотек
gulp.task('style-libs', function(){
	return gulp.src(['src/css/*.css', '!src/css/style.css', '!src/css/fonts.css'])
	.pipe(concat('libs.css'))
	.pipe(gulp.dest('src/css'))
})


// js библиотеки
gulp.task('scripts-libs', function(){
	return gulp.src(['src/libs/**/*.js'])
	.pipe(rename({dirname: ''}))
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('src/js'))
})


// таблицы стилей
gulp.task('sass', function(){
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


// js код
gulp.task('js', function(){
	return gulp.src(['src/js/**/*.js'])
	.pipe(rename({dirname: ''}))
	.pipe(concat('common.js'))
	.pipe(gulp.dest('src/js'))
})




/////////////// TASKS ///////////////
// запускать 1 раз или при добавлении новых библиотек 
gulp.task('libs', ['style-libs', 'scripts-libs']);


// чистка кеша
gulp.task('clear', function () {
    return cache.clearAll();
})


// default task
gulp.task('default', ['browser-sync', 'sass', 'js'], function() {
	
	gulp.watch('src/**/**/**/*.sass',['sass'])
	gulp.watch('src/**/*.+(php|html|js)',browserSync.reload)
});






/////////////// BUILD ///////////////
// удаление директории
gulp.task('del:build', function() {
	del.sync('dist');
});

gulp.task('style:build', function() {
	return gulp.src(['src/css/libs.css', 'src/css/style.css'])
	.pipe(cssnano())
	.pipe(gulp.dest('dist/css'))
});

gulp.task('js:build', function() {
	return gulp.src(['src/js/scripts.js', 'src/libs/libs.js'])
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
});

gulp.task('imagemin:build', function() {
	return gulp.src(['src/img/**/**/**/*', '!src/img/**/**/**/*.psd'])
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

// build task
gulp.task('build', ['del:build', 'style:build', 'js:build', 'imagemin:build'], function() {

	var buildFiles = gulp.src([
			'src/**/**/**/*',
			'!src/css/**/**/*',
			'!src/js/**/**/*',
			'!src/sass/**/**/*',
			'!src/libs/**/**/*',
			'!src/img/**/**/*',
			'src/css/fonts.css',
		]).pipe(gulp.dest('dist/'));

	var buildFontsCSS = gulp.src(['src/css/fonts.css',]).pipe(gulp.dest('dist/css/'));


});