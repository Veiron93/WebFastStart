'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	uncss = require('gulp-uncss'),
    uglify = require('gulp-uglifyjs'),
    del = require('del');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function(){
	browserSync({
		proxy: {
    	target: "", // домен
		},
		notify: false
	});
});

gulp.task('sass', function () {
	return gulp.src('app/sass/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('autoprefixer', () =>
	gulp.src('app/css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
	}))
		.pipe(gulp.dest('app/css'))
);


gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/**/**/**/*.html', browserSync.reload);
	gulp.watch('app/**/**/**/*.js', browserSync.reload);
	gulp.watch('app/**/**/**/*.php', browserSync.reload);
});

gulp.task('clean:build', function() {
	return del.sync('dist/*');
});

gulp.task('css:build', function () {
	return gulp.src('app/css/*.css')
		.pipe(uncss({ html: ['app/**/*.html', 'app/**/*.php'] }))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css/'))
});

gulp.task('js:build', function() {
	return gulp.src('app/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
       
});

gulp.task('del_file:build', function() {
	del.sync('dist/css/default_style.css');
	del.sync('dist/css/mixin.css');
	del.sync('dist/css/vars.css');
});

gulp.task('build', ['clean:build','css:build','js:build'], function() {

	var buildHtml = gulp.src('app/**/**/**/*.html')
		.pipe(gulp.dest('dist'))

	var buildPHP = gulp.src('app/**/**/**/*.php')
		.pipe(gulp.dest('dist'))

	var buildDB = gulp.src('app/db/*')
		.pipe(gulp.dest('dist/db'))

	var buildFonts = gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'))

	var buildLibs = gulp.src('app/libs/*')
		.pipe(gulp.dest('dist/libs'))

	var buildBlocks = gulp.src('app/blocks/*')
		.pipe(gulp.dest('dist/blocks/*'))

	del.sync('dist/css/default_style.css');
	del.sync('dist/css/mixin.css');
	del.sync('dist/css/vars.css');

});