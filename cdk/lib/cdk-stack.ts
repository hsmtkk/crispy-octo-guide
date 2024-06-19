import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as route53 from 'aws-cdk-lib/aws-route53';

const MY_DOMAIN = "novbyte.site";
const MY_FQDN = "crispy-octo-guide" + "." + MY_DOMAIN;

export class CrispyOctoGuideStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "vpc", {
      availabilityZones: ["ap-northeast-1a", "ap-northeast-1d"],
      natGateways: 0,
    });

    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: MY_DOMAIN,
    })

    const certificate = new certificatemanager.Certificate(this, "certificate", {
      domainName: MY_FQDN,
      validation: certificatemanager.CertificateValidation.fromDns(zone),
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "fargateService", {
      capacityProviderStrategies: [
        {
          base: 1,
          capacityProvider: "FARGATE_SPOT",
          weight: 1,
        }
      ],
      certificate: certificate,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("../app"),
      },
      taskSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      vpc: vpc,
    });
  }
}
