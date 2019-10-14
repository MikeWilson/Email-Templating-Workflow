const hemlfn = require('heml');
const fs = require('fs');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const handlebarsfn = require('gulp-compile-handlebars');
const gulp = require('gulp');
const chalk = require('chalk');
const styleInject = require("gulp-style-inject");
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');

function CSS() {
    return gulp.src("temp/*.html")
        .pipe(styleInject())
        .pipe(gulp.dest("./temp"));
}

function heml(cb) {

    var options = {
        validate: 'soft', // validation levels - 'strict'|'soft'|'none'
        cheerio: {}, // config passed to cheerio parser
        juice: {},
        beautify: {}, // config passed to js-beautify html method
        elements: [
            // any custom elements you want to use
        ]
    };

    hemlfn(fs.readFileSync('temp/temp.html', 'utf8'), options)
        .then(({
            html,
            metadata,
            errors
        }) => {
            console.log(chalk.blue('------------------'))
            console.log(chalk.green(`HEML Size: ${metadata.size}`));
            console.log(chalk.blue('------------------'))
            fs.writeFile('dist/index.html', html, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
            });
        })
    cb();
}

function handlebars(cb) {
    var templateData = JSON.parse(fs.readFileSync('src/data/data.json')),
        options = {
            ignorePartials: true,
            batch: ['./src/partials'],
            helpers: {}
        };

    return gulp.src('src/pages/email.html')
        .pipe(handlebarsfn(templateData, options))
        .pipe(rename('temp.html'))
        .pipe(gulp.dest('temp/'));
}

function server(cb) {
    browserSync.init({
        server: `dist/`
    });
    cb();
}

function reload(cb) {
    browserSync.reload();
    cb();
}

function watch() {
    gulp.watch('src/**/*.*', gulp.series(handlebars, CSS, heml, reload));
}
 
function minify() {
    return gulp.src('dist/index.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist/'));
}
 
function fileSize() {
    console.log('Size after build:');
    return gulp.src('dist/index.html')
        .pipe(size())
        .pipe(gulp.dest('dist/'))
}

exports.build = gulp.series(handlebars, CSS, heml, minify, fileSize);

exports.develop = gulp.series(handlebars, CSS, heml, server, watch);
