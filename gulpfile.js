var gulp=require('gulp');
var webserver=require('gulp-webserver');//webserver服务器模块
var url=require('url');
var fs=require('fs');//fs=filesystem
var sass=require('gulp-sass');
var webpack=require('gulp-webpack');
var named=require('vinyl-named');
var uglify=require('gulp-uglify');
var minifyCss=require('gulp-minify-css');
//版本管理
var rev=require('gulp-rev');
var revCollector=require('gulp-rev-collector');
var watch=require('gulp-watch');
//队列模块
var sequence=require('gulp-watch-sequence');



gulp.task('copy-index',function(){
	return gulp.src('./src/index.html').pipe(gulp.dest('./www'));
})

gulp.task('copy-img',function(){
	return gulp.src('./src/images/*.*').pipe(gulp.dest('./www/images'));
})

gulp.task('webserver', function() {
  gulp.src('./www')
    .pipe(webserver({
      livereload: true,
      //directoryListing:true,
      open:true,
      middleware:function(req,res,next){
      	//获取浏览器中的url，将url进行解析操作
      	var urlObj = url.parse(req.url,true),
      	method = req.method;
      	//如果url里输出了/skill.php,/project.php或者是/work，
      	//那么我们就可以查找到urlObj.pathname为/skill.php,/project.php,/work
      	//然后我们就可以通过这个变化的url地址内容去判断并且返回相应的
      	//skill.json/project.json/work.json等数据文件的内容
      	switch(urlObj.pathname){
      		case '/skill':
      			// Content-Type可以指定返回的文件的格式类型
      			res.setHeader('Content-Type','application/json');
      			//需要通过fileSystem文件操作函数，去读取指定目录下的json文件，并将读取到的内容返回到浏览器端
      			fs.readFile('./src/mock/skill.json','utf-8',function(err,data){
      				res.end(data);
      			});
      		return;
      		case '/project':
      			res.setHeader('Content-Type','application/json');
      			fs.readFile('./src/mock/project.json','utf-8',function(err,data){
      				res.end(data);
      			});
      		return;
      		case '/work':
      			res.setHeader('Content-Type','application/json');
      			fs.readFile('./src/mock/work.json','utf-8',function(err,data){
      				res.end(data);
      			});
      		return;
      	}
      	next(); // next是实现的循环
      } // end middleware

    })); // end gulp
});


gulp.task('sass',function(){
	return gulp.src('./src/styles/index.scss')
	.pipe(sass()).pipe(minifyCss())
	.pipe(gulp.dest('./www/css'));
})

gulp.task('packjs',function(){
	return gulp.src('./src/scripts/index.js').pipe(named()).pipe(webpack()).pipe(uglify())
	.pipe(gulp.dest('./www/js'));
})

var cssDistFiles=['./www/css/index.css'];
var jsDistFiles=['./www/js/index.js'];

gulp.task('verCss',function(){
	return gulp.src(cssDistFiles).pipe(rev()).pipe(gulp.dest('./www/css'))
	.pipe(rev.manifest()).pipe(gulp.dest('./www/ver/css'))
})
gulp.task('verJs',function(){
	return gulp.src(jsDistFiles).pipe(rev()).pipe(gulp.dest('./www/js'))
	.pipe(rev.manifest()).pipe(gulp.dest('./www/ver/js'))
})

gulp.task('html',function(){
	gulp.src(['./www/ver/**/*.json','./www/*.html']).pipe(revCollector({
		replaceReved:true
	})).pipe(gulp.dest('./www'))
})



gulp.task('watch',function(){
	gulp.watch('./src/index.html',['copy-index']);
	gulp.watch('./src/images/*.*',['copy-img']);
	var queue=sequence(300);
	watch('./src/scripts/**/*.js',{
		name:"JS",
		emitOnGlob:false
	},queue.getHandler('packjs','verJs','html'));
	watch('./src/styles/**',{
		name:"CSS",
		emitOnGlob:false
	},queue.getHandler('sass','verCss','html'));
})

gulp.task('default',['webserver','watch']);

