#!/usr/bin/env bash

ORIGIN=$(aws iot describe-endpoint --endpoint-type  iot:Data-ATS | jq -r '.endpointAddress')
THING_NAME="AwsCdkExample-thing"
URL="https://$ORIGIN:8443/things/$THING_NAME"

curl \
    --tlsv1.2 \
    --cacert ./certs/root_CA_cert_filename.pem \
    --cert ./certs/device_cert_filename.pem \
    --key ./certs/device_cert_key_filename.key \
    --dump-header - \
    $URL \