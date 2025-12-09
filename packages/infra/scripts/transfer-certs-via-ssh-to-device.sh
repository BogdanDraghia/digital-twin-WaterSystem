
read -p "device username: " DEVICE_USER

DEVICE_USER="${DEVICE_USER}"

read -p "hostname IP: " DEVICE_HOST
DEVICE_HOST="${DEVICE_HOST}"


CERTS_DIR="~/certs/"


# Download Amazon CA 
curl -o AmazonRootCA1.pem https://www.amazontrust.com/repository/AmazonRootCA1.pem

# transfer the files to the device ( for this app, a raspberry)
scp certs/device_cert.pem certs/device_key.key AmazonRootCA1.pem ${DEVICE_HOST}@${DEVICE_HOST}:${CERTS_DIR}
echo "files device_cert.pem, certs/device_key.key and transfered to the host AmazonRootCA1.pem"

# clean files
rm AmazonRootCA1.pem