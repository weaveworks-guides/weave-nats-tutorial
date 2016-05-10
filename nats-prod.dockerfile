FROM nats
ADD ./cluster.conf /etc/cluster.conf
CMD [ "-c", "/etc/cluster.conf", "-p", "4222", "-D", "-V" ]
