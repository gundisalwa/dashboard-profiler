var path = require('path'),
    gulp = require('gulp'),
    gp = require("gulp-load-plugins")({lazy:false});

/**
 * TODO: 
 * - Add index.html injection ?
 * - Add source maps thingie ?
 * 
 */


/**
 * Clean
 */
gulp.task('clean', function () {  
  return gulp.src('build', {read: false})
    .pipe(gp.clean());
});


/**
 * Scripts
 */
gulp.task('scripts', function(){
  return gulp.src([ '!./app/**/*_test.js', './app/**/*.js' ])
    .pipe(gp.angularFilesort())
    .pipe(gp.jshint())
    .pipe(gp.jshint.reporter('default'))
    .pipe(gp.concat('app.js'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
//  .pipe(gp.uglify({outSourceMap: true}))
//  .pipe(gp.rename('app.min.js'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .on('error', gp.util.log);
});

/**
 * Templates
 */
gulp.task('templates',function(){
  return gulp.src(['!./app/index.html', './app/**/*.html'])
    .pipe(gp.angularTemplatecache('templates.js',{standalone:true}))
    .pipe(gulp.dest('./build'));
});

/**
 * CSS
 */
gulp.task('css', function(){
  return gulp.src('./app/**/*.css')
    //.pipe(gp.csslint())
    //.pipe(gp.csslint.reporter())
    .pipe(gp.concat('app.css'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .pipe(gp.minifyCss())
    .pipe(gp.rename('app.min.css'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .on('error', gp.util.log);
});


/**
 * Vendors
 */
gulp.task('vendorJS', function(){
  //concatenate vendor JS files
  return gp.bowerFiles()
    .pipe(gp.filter('**/*.js'))
    .pipe(gp.concat('vendors.js'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .pipe(gp.uglify())
    .pipe(gp.rename('vendors.min.js'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .on('error', gp.util.log);
});
gulp.task('vendorCSS', function(){
  //concatenate vendor CSS files
  return gp.bowerFiles()
    .pipe(gp.filter('**/*.css'))      
    .pipe(gp.concat('vendors.css'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .pipe(gp.minifyCss())
    .pipe(gp.rename('vendors.min.css'))
    .pipe(gulp.dest('./build'))
    .pipe(gp.filesize())
    .on('error', gp.util.log);
});


/**
 * Index
 */
gulp.task('copy-index', function() {
  return gulp.src('./app/index.html')    
    .pipe(gulp.dest('./build'));
});


gulp.task('watch',function(){
  gulp.watch([
        'build/**/*.html',        
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe(gp.connect.reload());
    });
  gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
  gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
  gulp.watch('./app/**/*.css',['css']);
  gulp.watch('./app/index.html',['copy-index']);

});

gulp.task('connect', gp.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('default',['connect','scripts','templates','css','copy-index','vendorJS','vendorCSS','watch']);