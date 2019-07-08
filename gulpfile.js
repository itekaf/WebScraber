const gulp = require('gulp');
const css = require('gulp-cssmin');
const del = require('del');
const babel = require('gulp-babel');
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
	build: {
		app: 'app',
		img: 'images',
		temp: 'temp',
		database: 'db',
	},
	release: {
		dist: 'dist',
	},
};

/* Clear */
const clear = () => {
	return del([
		config.build.img,
		config.build.app,
		config.build.temp,
		config.build.database,
		config.release.dist,
	]);
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
	.pipe(babel())
	.pipe(gulp.dest('app/'));

const build = gulp.series(buildCSS, buildJS);

/* Copy */
const copyIMG = () => {
	return gulp.src(config.assets.img).pipe(gulp.dest('app/img'));
};

const copyHTML = () => {
	return gulp.src(config.scripts.mainHTML).pipe(gulp.dest('app/'));
};

const copy = gulp.series(clear, copyHTML, copyIMG);

/* Electron */
const runApp = () => {
	return gulp.src('app').pipe(runElectron(['.']));
};

const preStart = gulp.series(copy, build, runApp);

/* Watch */
const start = () => {
	gulp.watch([
		config.assets.img,
		config.styles.css,
		config.scripts.tests,
		config.scripts.mainJS,
		config.scripts.mainHTML,
		config.scripts.javascript,
	], gulp.series(preStart));
};

exports.build = build;
exports.copy = copy;
exports.preStart = preStart;
exports.start = start;
