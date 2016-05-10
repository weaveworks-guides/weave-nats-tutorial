#!/usr/bin/env ruby

require 'nats/client'
require 'json'

opts = { servers: [
  'nats://nats-a:4222',
  'nats://nats-b:4222',
  'nats://nats-c:4222'
]}

NATS.start(opts) do |c|

  puts "connected to #{c.connected_server}"

  c.on_reconnect do
    puts "reconnected to #{c.connected_server}"
  end

  NATS.subscribe('ping') do |msg|
    NATS.publish('pong', JSON.dump({ msg: JSON.load(msg), env: ENV.to_h }))
  end
end
