# PEAT
A HTML templating workflow for use with PEAT App

Uses gulp to run the html through:
* [CSS Inliner](https://www.npmjs.com/package/gulp-style-inject)
* [Handlebars](https://www.npmjs.com/package/gulp-compile-handlebars)
* [HEML](https://heml.io/)
* [HTML Minify](https://www.npmjs.com/package/gulp-htmlmin)

TODO:
* Add gulp task to only pull Handlebar partials into template and leave behind the variables and helpers in their {{ 