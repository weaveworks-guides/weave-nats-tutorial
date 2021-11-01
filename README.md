# Container Chat with NATS

**Note:** The guides in here haven't been updated in a while.
They might or might not work for you. We are keeping them around for informational purposes.

For up-to-date documentation around products and projects started by Weaveworks, please refer to:

Weaveworks products: <https://weave.works/docs>

Open Source projects started at Weaveworks:

- Cortex (CNCF): <https://cortexmetrics.io/docs>
- Flagger (CNCF): <https://docs.flagger.app>
- Flux (CNCF): <https://fluxcd.io/docs>
- Grafanalib: <https://grafanalib.rtfd.org>
- Ignite: <https://ignite.rtfd.org>
- Weave GitOps: <https://docs.gitops.weave.works>
- wksctl: <https://wksctl.rtfd.org>

---

## Docker for Mac

Setup:
```
weave launch
./compose up
./compose ps
```

Access Weave Scope:
```
open http://localhost:4040
```

![Weave Scope - NATS cluster and client apps](https://www.dropbox.com/s/tnbhu7xbpnkdb5w/Screenshot%202016-05-10%2019.17.41.png?dl=1)
![Weave Scope - NATS cluster and node details](https://www.dropbox.com/s/d2k1ds3hi6yurte/Screenshot%202016-05-10%2019.17.46.png?dl=1)
![Weave Scope - all containers by Weave Net DNS names](https://www.dropbox.com/s/3lohev31l2o0uin/Screenshot%202016-05-10%2019.18.04.png?dl=1)

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
weave stop
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
