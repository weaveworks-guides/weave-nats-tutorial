"use strict";

var _ = require('lodash');

var Logger = require('bunyan');
var restify = require('restify');
var nats = require('nats');

var log = new Logger({
  name: 'nats-echo-fe',
  streams: [{
      stream: process.stdout,
      level: 'debug'
  }],
  serializers: {
    req: Logger.stdSerializers.req,
    res: restify.bunyan.serializers.res,
  }
});

var nc = nats.connect({ servers: [
  'nats://nats-a:4222',
  'nats://nats-b:4222',
  'nats://nats-c:4222'
]});

var server = restify.createServer({ name: 'nats-echo-fe', log: log });

server.use(restify.queryParser());

server.put('/echo/:name', function (req, res, next) {

  nc.publish('ping', JSON.stringify(req.params));

  res.send(req.params);
  return next();
});

var sid = nc.subscribe('pong', function(msg) {
  log.info(JSON.parse(msg), 'PONG PONG PONG');
});

server.get('/', function (req, res, next) {
  res.setHeader('content-type', 'application/x-yaml');
  res.write("data: " + JSON.stringify({foo: bar}));
});

server.listen(8080, function () {
  log.info({name: server.name, url: server.url}, 'listening');
});

server.pre(function (request, response, next) {
  request.log.info({req: request}, 'started');
  return next();
});

server.on('after', function (req, res, route) {
  req.log.info({res: res}, 'finished');
});
