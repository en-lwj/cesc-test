var gulp = require("gulp");
var gutil = require('gulp-util');
var greplace = require('gulp-replace');
var concat = require('gulp-concat')
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpackConfigDev = require("./webpack.config.dev.js");
var webpackConfigTest = require("./webpack.config.test.js");
var WebpackDevServer = require("webpack-dev-server");
var path = require("path");
var fs = require("fs");
var version = '1.0.0';
var bump = require("gulp-bump");
var runSequence = require("run-sequence").use(gulp);
var copy = require("gulp-copy");
var zip = require("gulp-zip");
var rimraf = require("rimraf");
var git = require('gulp-git');

/**
 * 启动hot dev server
 */
gulp.task('webpack-dev', [], function () {
    var config = Object.create(webpackConfigDev);
    //这两项配置原本是在webpack.config.dev.js里边配置，可是通过gulp启动devserver，那种配置无效，只能在此处写入
    //官网的解释是webpack-dev-server没有权限读取webpack的配置
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:9022/", "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler, {
        contentBase: "../",
        publicPath: "/src/", // 此路径下的打包文件可在浏览器中访问。
        hot: true,
        compress: false,
        stats: {colors: true},
        proxy: {}
    });
    server.listen(9022, "localhost", function () {
        console.log("服务器启动：localhost:9022/src")
    });
    // server.close();
});

/**
 * 使正式环境配置打包
 */
gulp.task('webpack-build', [], function (cb) {
    var config = Object.create(webpackConfig);
    webpack(config, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({}));
        var assets = stats.compilation.assets;
        var cssName = '';
        var jsName = '';
        for (var file in assets) {
            if (file.endsWith('css')) {
                cssName = file;
            }
            else if (file.endsWith('bundle.js')) {
                jsName = file;
            }
        }
        gulp.src('../release/index.html')
            .pipe(greplace('../lib', './lib'))
            .pipe(gulp.dest('../release/'));
        cb();
    });
});

/**
 * 使测试环境配置打包
 */
gulp.task('webpack-test', [], function (cb) {
    var config = Object.create(webpackConfigTest);
    webpack(config, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({}));
        var assets = stats.compilation.assets;
        var cssName = '';
        var jsName = '';
        for (var file in assets) {
            if (file.endsWith('css')) {
                cssName = file;
            }
            else if (file.endsWith('bundle.js')) {
                jsName = file;
            }
        }
        gulp.src('../release/index.html')
            .pipe(greplace('../lib', './lib'))
            .pipe(gulp.dest('../release/'));
        cb();
    });
});
gulp.task('copy-vendors', function () {
    gulp.src('../src/img/**/**').pipe(gulp.dest('../release/img'));
    gulp.src('../lib/**/**').pipe(gulp.dest('../release/lib'));
    gulp.src('../package.json').pipe(gulp.dest('../release'));
});
gulp.task('clean', function (cb) {
    rimraf('../release', cb);
});
gulp.task("default", ["webpack-dev"]);
gulp.task("build", () => {
    runSequence(["clean"], ["copy-vendors"], ['webpack-build']);
});
gulp.task("test", () => {
    runSequence(["clean"], ["copy-vendors"], ['webpack-test']);
});
