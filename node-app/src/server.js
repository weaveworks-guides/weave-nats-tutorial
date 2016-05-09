"use strict";

var _ = require('lodash');

var nats = require('nats');

var nc = nats.connect({ servers: [
  'nats://nats-a:4222',
  'nats://nats-b:4222',
  'nats://nats-c:4222'
]});

var restify = require('restify');
var Logger = require('bunyan');

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

var server = restify.createServer({ name: 'nats-echo-fe', log: log });

server.use(restify.queryParser());

server.put('/echo/:name', function (req, res, next) {

  nc.publish('echo', JSON.stringify(req.params));

  res.send(req.params);
  return next();
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
