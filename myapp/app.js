var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const multer=require('multer');
const multerObj=multer({dest:'./public/upload'});
var logger = require('morgan');
const ejs=require('ejs');
const cookieSession=require('cookie-session')

var app = express();
app.use(multerObj.any());
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
// app.engine('.html',ejs.__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//2cookie session

(function(){
	 keys=[];
	for (var i = 0; i < 110000; i++) {
		keys[i]='sig_'+Math.random();
	};
	app.use(cookieSession({
		name:'sess_id',
		keys:keys,
		maxAge:200*60*1000
	}))
})();

app.use(cookieParser('sess_id'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use("/admin",require('./routes/index'));          //访问前端的路由，全部指向pulic/index    (前端打包好的)
app.use(require('connect-history-api-fallback')({
    verbose: true,
    index: '/index.html',
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    rewrites: [
        { from: /^\/admin/, to: () => {
        	console.log(1);
        	return path.join(__dirname, 'public/index.html');
        } },
        { from: /^\/login/, to: () => {console.log(2)} },
    ],
    path: /^\/admin/,
}));

// app.use("/login",express.static(path.join(__dirname, 'public/index.html')));
app.use("/register",require('./routes/index'));

app.use('/api/admin', require('./routes/admin/admin'));
app.use('/api', require('./routes/web/index'));
app.use('/zhuanti', require('./routes/zhuanti'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  console.log(req.url)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
