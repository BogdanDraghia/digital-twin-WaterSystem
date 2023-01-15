import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs';
import path = require('path')
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// Dyanmo Db instance
export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'WaterSystemApi',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname+"/../graphql/", 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
    });

    const demoTable = new dynamodb.Table(this, 'DemoTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
    const demoDS = api.addDynamoDbDataSource('demoDataSource', demoTable);

    demoDS.createResolver('QueryGetDemosResolver', {
      typeName: 'Query',
      fieldName: 'getDemos',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });
    
    // Resolver for the Mutation "addDemo" that puts the item into the DynamoDb table.
    demoDS.createResolver('MutationAddDemoResolver', {
      typeName: 'Mutation',
      fieldName: 'addDemo',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').auto(),
        appsync.Values.projecting('input'),
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    

  }
}
