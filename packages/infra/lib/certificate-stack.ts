// Certificate for sensors  ( for now only the rassberyPI )
import {
  CfnOutput,
  Stack,
  StackProps
} from 'aws-cdk-lib'
import {
  CfnCACertificate,
  CfnCertificate,
  CfnPolicy,
  CfnPolicyPrincipalAttachment,
  CfnThing,
  CfnThingPrincipalAttachment
} from 'aws-cdk-lib/aws-iot'
import { Construct } from 'constructs'
import * as fs from 'fs'
import * as path from 'path'
export class CertificateStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps
  ) {
    super(scope, id)
    const certsPath = path.resolve(
      __dirname,
      '../scripts/certs'
    )

    const caCert = new CfnCACertificate(
      this,
      'SensorCACertificate',
      {
        caCertificatePem: fs.readFileSync(
          path.join(
            certsPath,
            'root_CA_cert.pem'
          ),
          'utf8'
        ),
        status: 'ACTIVE',
        verificationCertificatePem:
          fs.readFileSync(
            path.join(
              certsPath,
              'verification_cert.pem'
            ),
            'utf8'
          ),
        autoRegistrationStatus: 'ENABLE'
      }
    )

    const deviceCert = new CfnCertificate(
      this,
      'SensorCertificate',
      {
        status: 'ACTIVE',
        certificatePem: fs.readFileSync(
          path.join(certsPath, 'device_cert.pem'),
          'utf8'
        ),
        caCertificatePem: fs.readFileSync(
          path.join(
            certsPath,
            'root_CA_cert.pem'
          ),
          'utf8'
        )
      }
    )
    deviceCert.node.addDependency(caCert)

    const thing = new CfnThing(
      this,
      'RaspberryPiThing',
      {
        thingName: 'raspberry-watersystem'
      }
    )

    const policy = new CfnPolicy(
      this,
      'WaterSystemPolicy',
      {
        policyName: 'WaterSystemPolicy',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['iot:Connect'],
              Resource: `arn:aws:iot:${this.region}:${this.account}:client/raspberry-*`
            },
            {
              Effect: 'Allow',
              Action: [
                'iot:Publish',
                'iot:Receive'
              ],
              Resource: `arn:aws:iot:${this.region}:${this.account}:topic/watersystem/*`
            },
            {
              Effect: 'Allow',
              Action: ['iot:Subscribe'],
              Resource: `arn:aws:iot:${this.region}:${this.account}:topicfilter/watersystem/*`
            }
          ]
        }
      }
    )

    new CfnPolicyPrincipalAttachment(
      this,
      'PolicyAttachment',
      {
        policyName: policy.policyName!,
        principal: deviceCert.attrArn
      }
    )
    new CfnThingPrincipalAttachment(
      this,
      'ThingAttachment',
      {
        thingName: thing.thingName!,
        principal: deviceCert.attrArn
      }
    )
  }
}
