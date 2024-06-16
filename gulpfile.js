const gulp = require("gulp");
const clean = require("gulp-clean");
const path = require("path");

// Task to copy files from src/ to dst/
gulp.task("copy-files", function () {
  return gulp.src("src/**/*").pipe(gulp.dest("build"));
});

// Task to clean dst/ folder
gulp.task("clean-dst", function () {
  return gulp.src("build", { read: false, allowEmpty: true }).pipe(clean());
});

// Task to clean removed files from dst/
gulp.task("clean-removed-files", function (cb) {
  const srcPath = "src/**/*";
  const dstPath = "build";

  gulp
    .src(srcPath, { read: false })
    .pipe(gulp.watch(srcPath, { events: ["unlink"], delay: 100 }))
    .on("unlink", function (filepath) {
      const filePathFromSrc = path.relative(path.resolve("src"), filepath);
      const destFilePath = path.resolve(dstPath, filePathFromSrc);
      gulp.src(destFilePath, { read: false, allowEmpty: true }).pipe(clean());
    });

  cb();
});

// Task to watch for changes in src/ and copy files to dst/
gulp.task("watch", function () {
  gulp.watch("src/**/*", gulp.series("copy-files", "clean-removed-files"));
});

// Default task
gulp.task("default", gulp.series("clean-dst", "copy-files", "watch"));
