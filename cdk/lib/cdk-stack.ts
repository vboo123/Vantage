import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class VantageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for Deals
    const dealsTable = new dynamodb.Table(this, 'DealsTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'itemCategory', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'VantageUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
    });

    // Cognito User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'VantageUserPoolClient', {
      userPool,
      generateSecret: false, // Mobile apps typically don't use client secrets
    });

    // Deal Parser Lambda
    const dealParserLambda = new lambda.Function(this, 'DealParserFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/lambda/deal_parser')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        DEALS_TABLE_NAME: dealsTable.tableName,
      },
    });

    // Permissions
    dealsTable.grantWriteData(dealParserLambda);

    // Bedrock Permission
    dealParserLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'], // Scope this down in production to specific model ARNs
    }));

    // Outputs
    new cdk.CfnOutput(this, 'DealsTableName', {
      value: dealsTable.tableName,
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'DealParserFunctionName', {
      value: dealParserLambda.functionName,
    });
  }
}
