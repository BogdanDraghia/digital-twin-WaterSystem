#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { InfraStack } from '../lib/infra-stack'
import { CertificateStack } from '../lib/certificate-stack'

const app = new cdk.App()

// const env = {
//   account: process.env.CDK_DEFAULT_ACCOUNT,
//   region: process.env.CDK_DEFAULT_REGION
// }

new InfraStack(app, 'InfraStack', {})

new CertificateStack(app, 'CertificateStack', {})
