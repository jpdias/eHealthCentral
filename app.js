var express = require('express');
var http  = require('http');
var path = require('path');
var log = require('./libs/log')(module);
var app = module.exports = express();
var config = require('./libs/config');

app.set('port', process.env.PORT || config.get('port'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hjs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));
if('development'== app.get('env')){
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
}

require('./routes');


http.createServer(app).listen(app.get('port'), function(){

  log.info('\n----------------------\nNode.js server listening on port '+app.get('port'));
})
