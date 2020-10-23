
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var show = require('./routes/show-properties');
var performer = require('./routes/performer-properties');
var performance = require('./routes/performance-properties');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var trial = function() {
    console.log(describe);
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/show', show.returnJSON);
app.get('/performer', performer.returnJSON);
app.get('/performance', performance.returnJSON);

app.get('/trial', trial);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
