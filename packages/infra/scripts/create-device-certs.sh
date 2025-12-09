#!/usr/bin/env bash


# input device name

APP_NAME="watersystem"
SUBJ="/C=NL/ST=North Holland/L=Amsterdam/O=unmakingprojects/CN=AWS IoT Certificate"

mkdir -p certs
cd certs

##################################
# Create a CA certificate
# @see https://docs.aws.amazon.com/iot/latest/developerguide/create-your-CA-cert.html

openssl genrsa -out root_CA_key.key 2048

openssl req -x509 -new -nodes \
  -key root_CA_key.key \
  -sha256 -days 1024 \
  -subj "${SUBJ}" \
  -addext "basicConstraints=CA:TRUE" \
  -out root_CA_cert.pem

##################################
# Register your CA certificate
# @see https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/register-CA-cert.html

REGISTRATION_CODE=$(aws iot get-registration-code | jq -r '.registrationCode')

openssl genrsa -out verification_key.key 2048

openssl req -new \
  -key verification_key.key \
  -subj "${SUBJ%%CN=*}CN=${REGISTRATION_CODE}" \
  -out verification_csr.csr

openssl x509 -req \
    -in verification_csr.csr \
    -CA root_CA_cert.pem \
    -CAkey root_CA_key.key \
    -CAcreateserial \
    -out verification_cert.pem \
    -days 500 -sha256

##################################
# Create a client certificate using your CA certificate
# @see https://docs.aws.amazon.com/iot/latest/developerguide/create-device-cert.html

openssl genrsa -out device_key.key 2048

openssl req -new \
  -key device_key.key \
  -subj "${SUBJ}" \
  -out device_csr.csr

openssl x509 -req \
    -in device_csr.csr \
    -CA root_CA_cert.pem \
    -CAkey root_CA_key.key \
    -CAcreateserial \
    -out device_cert.pem \
    -days 500 -sha256



echo "script done - ${APP_NAME}"