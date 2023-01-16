import * as fs from "fs";
import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as iot from "aws-cdk-lib/aws-iot";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs";

export class CertificateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    const caCert = new iot.CfnCACertificate(this, "CACertificate", {
      caCertificatePem: fs.readFileSync(
        path.resolve(__dirname+"/../certs/root_CA_cert_filename.pem"),
        "utf8"
      ),
      status: "ACTIVE",
      verificationCertificatePem: fs.readFileSync(
        path.resolve(__dirname+"/../certs/verification_cert_filename.pem"),
        "utf8"
      ),
    });

    const cert = new iot.CfnCertificate(this, "Certificate", {
      status: "ACTIVE",
      certificatePem: fs.readFileSync(
        path.resolve(__dirname+"/../certs/device_cert_filename.pem"),
        "utf8"
      ),
      caCertificatePem: fs.readFileSync(
        path.resolve(__dirname+"/../certs/root_CA_cert_filename.pem"),
        "utf8"
      ),
    });
    cert.node.addDependency(caCert);

    const thing = new iot.CfnThing(this, "Thing", {
      thingName: "AwsCdkExample-thing",
    });

    const policy = new iot.CfnPolicy(this, "Policy", {
      policyDocument: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["iot:GetThingShadow", "iot:UpdateThingShadow","iot:Connect","iot:Publish","iot:Subscribe"],
            resources: [
              `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topicfilter/*`,
              `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topic/$aws/things/*`
            ],
          }),
        ],
      }).toJSON(),
    });

    new iot.CfnThingPrincipalAttachment(this, "TPA", {
      thingName: thing.ref,

      principal: cdk.Token.asString(cert.getAtt("Arn")),
    });

    new iot.CfnPolicyPrincipalAttachment(this, "PPA", {
      policyName: cdk.Token.asString(policy.getAtt("Id")),
      principal: cdk.Token.asString(cert.getAtt("Arn")),
    });
    const func = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = (event) => {
          console.log("It is test for lambda action of AWS IoT Rule.", event);
        };`
      ),
    });
    
    // new iot.CfnTopicRule(this, 'TopicRule', {
    //   sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp, temperature FROM 'device/+/data'"),
    //   actions: [new actions.LambdaFunctionAction(func)],
    // });
  }
}
