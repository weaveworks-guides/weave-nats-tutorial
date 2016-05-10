"use strict";

var _ = require('lodash');

var Logger = require('bunyan');
var restify = require('restify');
var nats = require('nats');
var fs = require('fs');

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

server.get('/', function indexHTML(req, res, next) {
  fs.readFile(__dirname + '/index.html', function (err, data) {

    if (err) {
      next(err);
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});

server.put('/echo/:name', function (req, res, next) {

  nc.publish('ping', JSON.stringify(req.params));

  res.send(req.params);
  return next();
});

server.get('/events', function (req, res, next) {

  var stats = {
    hostname: { },
    ruby_version: { },
    echo_name: { },
  };

  function sendEvent(type, data, _req) {
    log.info(data, type);
    _req.write('data: ' + JSON.stringify({ type: type, data: data }) + '\n\n');
  }

  function aggregateEvents(d) {

    function seen(k, v) {
      if (stats[k][v] !== undefined) {
        stats[k][v] += 1;
      } else {
        stats[k][v] = 1;
      }
    }

    seen('echo_name', d.msg.name);
    seen('ruby_version', d.env.RUBY_VERSION)
    seen('hostname', d.env.HOSTNAME)

    return _.clone(stats);
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var sid = nc.subscribe('pong', function(msg) {
    var data = JSON.parse(msg);
    delete data.env.BUNDLER_VERSION;
    delete data.env.BUNDLE_APP_CONFIG;
    delete data.env.BUNDLE_APP_CONFIG;
    delete data.env.BUNDLE_BIN;
    delete data.env.BUNDLE_SILENCE_ROOT_WARNING;
    delete data.env.PATH;
    delete data.env.RUBYGEMS_VERSION;
    delete data.env.RUBY_DOWNLOAD_SHA256;
    sendEvent('pongz', data, res);
    sendEvent('stats', aggregateEvents(data), res);
  });
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
