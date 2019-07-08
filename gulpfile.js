const gulp = require('gulp');

const css = require('gulp-cssmin');
const del = require('del');
const zip = require('gulp-zip');
const babel = require('gulp-babel');
const packgeJSON = require('./package.json');
const sourcemaps = require('gulp-sourcemaps');
const runElectron = require('gulp-run-electron');

const config = {
	name: packgeJSON.name,
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
		appIMG: 'app/img',
		img: 'images',
		temp: 'temp',
		database: 'db',
	},
	release: {
		dist: 'dist',
		release: 'release',
		os: {
			win64: (dist, name) => `${dist}/${name}-win32-x64/**/*`,
			win32: (dist, name) => `${dist}/${name}-win32-ia32/**/*`,
		},
	},
};

/* Zip */
const zipReleaseOs = (osName) => () => {
	return gulp.src(
		[
			config.release.os[osName](config.release.dist, config.name),
		])
		.pipe(zip(`${config.name}-${osName}.zip`))
		.pipe(gulp.dest(config.release.release));
};

const zipRelease = gulp.parallel(zipReleaseOs('win32'), zipReleaseOs('win64'));

/* Clear */
const clearBuild = () => {
	return del([
		config.build.img,
		config.build.app,
		config.build.temp,
		config.build.database,
	]);
};

const clearRelease = () => {
	return del([
		config.release.dist,
		config.release.release,
	]);
};

const clearAll = gulp.parallel(clearBuild, clearRelease);

/* Copy */
const copyIMG = () => {
	return gulp.src(config.assets.img).pipe(gulp.dest(config.build.appIMG));
};

const copyHTML = () => {
	return gulp.src(config.scripts.mainHTML).pipe(gulp.dest(config.build.app));
};

const copy = gulp.series(clearAll, copyHTML, copyIMG);

/* Build */
const buildCSS = () => gulp
	.src(config.styles.css)
	.pipe(css())
	.pipe(gulp.dest(config.build.app));

const buildJS = () => gulp
	.src([
		config.scripts.tests,
		config.scripts.mainJS,
		config.scripts.javascript,
	])
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(config.build.app));

const build = gulp.series(copy, buildCSS, buildJS);

/* Electron */
const runApp = () => {
	return gulp.src(config.build.app).pipe(runElectron(['.']));
};

/* Watch */
const watchApp = () => {
	gulp.watch([
		config.assets.img,
		config.styles.css,
		config.scripts.tests,
		config.scripts.mainJS,
		config.scripts.mainHTML,
		config.scripts.javascript,
	], gulp.series(build, runApp));
};

/* Start */
const start = gulp.series(build, gulp.parallel(watchApp, runApp));

/* Release */
const release = gulp.series(zipRelease);

exports.build = build;
exports.start = start;
exports.clear = clearAll;
exports.release = release;
