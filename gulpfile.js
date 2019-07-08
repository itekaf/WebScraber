const gulp = require('gulp');
const maps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const css = require('gulp-cssmin');
const clean = require('gulp-clean');
const runElectron = require('gulp-run-electron');

const config = {
	styles: {
		css: 'src/**/*.css',
	},
	scripts: {
		mainJS: 'main.js',
		mainHTML: 'src/*.html',
		javascript: 'src/**/*.js',
		tests: '!src/**/*.test.js',
	},
	assets: {
		img: 'src/img/**/*',
	},
	release: {
		img: 'images/**/*',
		database: 'db/**/*',
		temp: 'temp/**/*',
		app: 'app/**/*',
	},
};

/* Clear */
const clear = () => {
	return gulp.src(
		[
			config.release.img,
			config.release.database,
			config.release.temp,
		],
		{
			read: false,
		})
		.pipe(clean());
};

/* Build */
const buildCSS = () => gulp
	.src(config.styles.css)
	.pipe(css())
	.pipe(gulp.dest('app/'));

const buildJS = () => gulp
	.src([
		config.scripts.tests,
		config.scripts.mainJS,
		config.scripts.javascript,
	], {
		sourcemaps: true,
	})
	.pipe(maps.init())
	.pipe(babel())
	.pipe(maps.write('.'))
	.pipe(gulp.dest('app/'));

const build = gulp.series(clear, buildCSS, buildJS);

/* Copy */
const copyIMG = () => {
	return gulp.src(config.assets.img).pipe(gulp.dest('app/img'));
};

const copyHTML = () => {
	return gulp.src(config.scripts.mainHTML).pipe(gulp.dest('app/'));
};

const copy = gulp.parallel(copyHTML, copyIMG);

/* Electron */
const runApp = () => {
	return gulp.src('app').pipe(runElectron(['.']));
};

/* Watch */
const start = () => {
	gulp.watch([
		config.assets.img,
		config.styles.css,
		config.scripts.tests,
		config.scripts.mainJS,
		config.scripts.mainHTML,
		config.scripts.javascript,
	], gulp.series(copy, build, runApp));
};

exports.build = build;
exports.copy = copy;
exports.start = start;
