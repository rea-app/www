var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");
var ghPages = require('gulp-gh-pages-will');


gulp.task('deploy', function() {
  return gulp.src('./static/**/*').pipe(ghPages());
});

// Set the banner content
// var banner = [
//   "/*!\n",
//   " * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
//   " * Copyright 2013-" + new Date().getFullYear(),
//   " <%= pkg.author %>\n",
//   " * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n",
//   " */\n",
//   "",
// ].join("");

// Compile LESS files from /less into /css
gulp.task("less", function() {
  return gulp
    .src("less/new-age.less")
    .pipe(less())
    // .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("static/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("less", function() {
  return gulp
    .src("less/main.less")
    .pipe(less())
    // .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("static/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Minify compiled CSS
gulp.task("minify-css", ["less"], function() {
  return gulp
    .src("static/css/new-age.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("static/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("minify-css", ["less"], function() {
  return gulp
    .src("static/css/main.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("static/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Minify JS
gulp.task("minify-js", function() {
  return gulp
    .src("js/new-age.js")
    .pipe(uglify())
    // .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("static/js"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task("copy", function() {
  gulp
    .src([
      "node_modules/bootstrap/dist/**/*",
      "!**/npm.js",
      "!**/bootstrap-theme.*",
      "!**/*.map",
    ])
    .pipe(gulp.dest("static/vendor/bootstrap"));

  gulp
    .src([
      "node_modules/jquery/dist/jquery.js",
      "node_modules/jquery/dist/jquery.min.js",
    ])
    .pipe(gulp.dest("static/vendor/jquery"));
  
    // gulp
    // .src([
    //   "static/*",
    // ])
    // .pipe(gulp.dest("static/dist"));
  
});

// Run everything
gulp.task("default", ["less", "minify-css", "minify-js", "copy"]);

// Configure the browserSync task
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./static",
    },
  });
});

// Dev task with browserSync
gulp.task(
  "dev",
  ["browserSync", "less", "minify-css", "minify-js"],
  function() {
    gulp.watch("less/*.less", ["less"]);
    gulp.watch("static/css/*.css", ["minify-css"]);
    gulp.watch("js/*.js", ["minify-js"]);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("static/*.html", browserSync.reload);
    gulp.watch("static/js/**/*.js", browserSync.reload);
  }
);
