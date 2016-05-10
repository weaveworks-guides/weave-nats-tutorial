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

## For EC2 Container Service

> Prerequisites:
>
>  - Must have AWS CLI installed and configured with credentials.
>  - Ideally should have ownership of the AWS account.
>  - Will also need EC2 key name.

```
aws cloudformation create-stack \
  --stack-name weave-nats-demo \
  --parameters ParameterKey=KeyName,ParameterValue=<YourKeyNameKey> \
  --capabilities CAPABILITY_IAM \
  --template-body "file:////${PWD}/cloudformation.json"
```
