const gulp = require('gulp');
const maps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const css = require('gulp-cssmin');
const clean = require('gulp-clean');

/* Clear */
gulp.task('clear', () => {
	return gulp.src([
		'images/**/*',
		'db/**/*',
		'temp/**/*'], {read: false})
		.pipe(clean());
});

/* Watch */
gulp.watch([
	'src/**/*.css',
	'main.js',
	'src/**/*.js',
	'!src/**/*.test.js',
], gulp.series('build'));

/* Build */
gulp.task('build-css', () => gulp
	.src('src/**/*.css')
	.pipe(css())
	.pipe(gulp.dest('app/')));

gulp.task('build-js', () => gulp
	.src(['main.js', 'src/**/*.js', '!src/**/*.test.js'])
	.pipe(maps.init())
	.pipe(babel())
	.pipe(maps.write('.'))
	.pipe(gulp.dest('app/'))
);

gulp.task('build-watch', gulp.watch([
	'main.js',
	'src/*.html',
	'src/**/*.js',
	'src/**/*.css',
	'src/img/**/*',
	'src/assets/**/*',
	'!src/**/*.test.js',
], gulp.series('copy', 'build')));
gulp.task('build', gulp.series('clear', 'build-css', 'build-js'));

/* Copy */
gulp.task('copy-img', () => {
	return gulp.src('src/img/**/*').pipe(gulp.dest('app/img'));
});

gulp.task('copy-html', () => {
	return gulp.src('src/*.html').pipe(gulp.dest('app/'));
});

gulp.task('copy-assets', () => {
	return gulp.src('src/assets/**/*').pipe(gulp.dest('app/assets'));
});

gulp.task('copy', gulp.series('copy-html', 'copy-assets', 'copy-img'));


