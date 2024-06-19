import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "fargateService", {
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("../app"),
      }
    });
  }
}
