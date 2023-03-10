#!/usr/bin/env bash

mkdir certs
cd certs

##################################
# Create a CA certificate
# @see https://docs.aws.amazon.com/iot/latest/developerguide/create-your-CA-cert.html

openssl genrsa -out root_CA_key_filename.key 2048

openssl req -x509 -new -nodes \
  -key root_CA_key_filename.key \
  -sha256 -days 1024 \
  -subj "/C=JP/ST=Tokyo/L=Chiyodaku/O=MyCompany/CN=AWS IoT Certificate" \
  -out root_CA_cert_filename.pem


##################################
# Register your CA certificate
# @see https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/register-CA-cert.html

REGISTRATION_CODE=$(aws iot get-registration-code | jq -r '.registrationCode')

openssl genrsa -out verification_cert_key_filename.key 2048

openssl req -new \
  -key verification_cert_key_filename.key \
  -subj "/C=JP/ST=Tokyo/L=Chiyodaku/O=MyCompany/CN=$REGISTRATION_CODE" \
  -out verification_cert_csr_filename.csr

openssl x509 -req \
    -in verification_cert_csr_filename.csr \
    -CA root_CA_cert_filename.pem \
    -CAkey root_CA_key_filename.key \
    -CAcreateserial \
    -out verification_cert_filename.pem \
    -days 500 -sha256


##################################
# Create a client certificate using your CA certificate
# @see https://docs.aws.amazon.com/iot/latest/developerguide/create-device-cert.html

openssl genrsa -out device_cert_key_filename.key 2048

openssl req -new \
  -key device_cert_key_filename.key \
  -subj "/C=JP/ST=Tokyo/L=Chiyodaku/O=MyCompany/CN=AWS IoT Certificate" \
  -out device_cert_csr_filename.csr

openssl x509 -req \
    -in device_cert_csr_filename.csr \
    -CA root_CA_cert_filename.pem \
    -CAkey root_CA_key_filename.key \
    -CAcreateserial \
    -out device_cert_filename.pem \
    -days 500 -sha256

echo "script done"