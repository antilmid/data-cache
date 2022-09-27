const ts = require('gulp-typescript');
const gulp = require('gulp');
const path = require('path');
const tsconf = require('./tsconfig.json');

const {ENV} = process.env;


function compile() {
  return gulp.src('src/**/*.ts').pipe(ts(tsconf.compilerOptions)).pipe(gulp.dest(path.resolve(__dirname, 'dist')));
}
const watchBack = gulp.series(compile, (cb)=> {
  console.log('开始')
  // 清除缓存
  Object.keys(require.cache).forEach((keyname)=>{
    if(keyname.match(new RegExp(`(${path.resolve(__dirname, './dist')}|${path.resolve(__dirname, './sandbox')})`))) {
      delete require.cache[keyname];
    }
  });
  require('./sandbox/index.js');
  cb();
});


if(ENV === 'dev') {
  gulp.watch(['src/**/*.ts', 'sandbox/**/*'], watchBack);
}

exports.default = ENV === 'dev' ? watchBack : compile;