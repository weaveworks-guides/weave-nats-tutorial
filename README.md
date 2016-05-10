# Container Chat with NATS

## Docker for Mac

Setup:
```
weave launch
./compose up
```

Access Weave Scope:
```
open http://localhost:4040
```

Access the Container Chat app:
```
open http://localhost:8080
```

Send some requests in:
```
curl -XPUT localhost:8080/echo/BOOM
curl -XPUT localhost:8080/echo/BOOM
curl -XPUT localhost:8080/echo/YEAH
```

Scale the backend:
```
./compose scale
```

Send more requests:
```
curl -XPUT localhost:8080/echo/MOAR
curl -XPUT localhost:8080/echo/MOAR
```

Make change to Ruby or JavaScript code, run `./compose up` to update!

Kill it, if you had enough:
```
./compose down
```
