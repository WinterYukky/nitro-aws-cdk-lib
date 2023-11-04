import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { BehaviorOptions } from "aws-cdk-lib/aws-cloudfront";
import { AssetCode, Code } from "aws-cdk-lib/aws-lambda";
import {
  DeploymentSourceContext,
  ISource,
  Source,
  SourceConfig,
} from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

/**
 * Resolver that for additionalBehaviors of CloudFront Distribution.
 */
export interface ICloudFrontBehaviorResolver {
  resolve(key: string): BehaviorOptions;
}

/**
 * Static asset of nitro.
 * This Construct provides to resolve
 * additionalBehaviors of CloudFront Distribution easy.
 */
export class NitroStaticAsset implements ISource {
  /**
   * Directories under publicDir.
   */
  public readonly directories: string[];
  /**
   * files under publicDir.
   */
  public readonly files: string[];
  private readonly source: ISource;
  constructor(public readonly path: string) {
    const objects = readdirSync(path);
    this.directories = objects.filter((obj) =>
      statSync(join(path, obj)).isDirectory()
    );
    this.files = objects.filter((obj) => statSync(join(path, obj)).isFile());
    if (objects.length === 0) {
      writeFileSync(join(path, "dotfile"), "");
    }
    this.source = Source.asset(path);
  }

  bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig {
    return this.source.bind(scope, context);
  }

  /**
   * helper function for aggregate behaviors every files and directories.
   * @param resolver
   * @returns aggregated additionalBehaviors
   * @example
   * declare const nitro: NitroAsset;
   * declare const s3Origin: origins.S3Origin;
   * new cloudfront.Distribution(this, "Distribution", {
   *   defaultBehavior: {
   *     origin: s3Origin,
   *   },
   *   additionalBehaviors: nitro.staticAsset.resolveCloudFrontBehaviors({
   *     resolve: () => ({
   *       origin: s3Origin,
   *     }),
   *   }),
   * });
   */
  resolveCloudFrontBehaviors(
    resolver: ICloudFrontBehaviorResolver
  ): Record<string, BehaviorOptions> {
    return {
      ...this.directories.reduce<Record<string, BehaviorOptions>>(
        (acc, obj) => ({
          ...acc,
          [`${obj}/*`]: resolver.resolve(obj),
        }),
        {}
      ),
      ...this.files.reduce<Record<string, BehaviorOptions>>(
        (acc, obj) => ({
          ...acc,
          [obj]: resolver.resolve(obj),
        }),
        {}
      ),
    };
  }
}

interface NitroJSON {
  date: string;
  preset: string;
  commands: {
    preview?: string;
    deploy?: string;
  };
  output: {
    serverDir: string;
    publicDir: string;
  };
}

export interface NitroAssetProps {
  /**
   * Path to nitro project path.
   */
  readonly path: string;
  /**
   * Path to output directory.
   *
   * @default ".output"
   */
  readonly outputDir?: string;
}

/**
 * Asset of nitro. This Construct can resolve nitro output path.
 * @example
 * const nitro = new NitroAsset(this, "NitroAsset", {
 *   path: "../nuxt3" // your nitro project path
 * })
 * const edgeFunction = new cloudfront.experimental.EdgeFunction(
 *   this,
 *   "EdgeFunction",
 *   {
 *     runtime: lambda.Runtime.NODEJS_16_X,
 *     handler: "index.handler",
 *     code: nitro.serverHandler,
 *   }
 * );
 * const bucket = new s3.Bucket(this, "Bucket", {
 *   removalPolicy: RemovalPolicy.DESTROY,
 *   autoDeleteObjects: true,
 * });
 * const s3Origin = new origins.S3Origin(bucket);
 * const distribution = new cloudfront.Distribution(this, "Distribution", {
 *   defaultBehavior: {
 *     origin: s3Origin,
 *     edgeLambdas: [
 *       {
 *         functionVersion: edgeFunction.currentVersion,
 *         eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
 *       },
 *     ],
 *   },
 *   additionalBehaviors: nitro.staticAsset.resolveCloudFrontBehaviors({
 *     resolve: () => ({
 *       origin: s3Origin,
 *     }),
 *   }),
 * });
 * new s3deployment.BucketDeployment(this, "Deployment", {
 *   sources: [nitro.staticAsset],
 *   destinationBucket: bucket,
 *   distribution,
 * });
 * new CfnOutput(this, "URL", {
 *   value: `https://${distribution.distributionDomainName}`,
 * });
 */
export class NitroAsset extends Construct {
  /**
   * Server handler of nitro for lambda function.
   *
   * @example
   * declare const nitro: NitroAsset;
   * new cloudfront.experimental.EdgeFunction(
   *   this,
   *   "EdgeFunction",
   *   {
   *     runtime: lambda.Runtime.NODEJS_18_X,
   *     handler: "index.handler",
   *     code: nitro.serverHandler,
   *   }
   * );
   */
  readonly serverHandler: AssetCode;
  /**
   * static asset of nitro for s3 deployment.
   * When public dir is empty, this asset includes only empty dotfile.
   *
   * @example
   * declare const nitro: NitroAsset;
   * declare const bucket: s3.Bucket;
   * new s3deployment.BucketDeployment(this, "Deployment", {
   *   sources: [nitro.staticAsset],
   *   destinationBucket: bucket,
   * });
   */
  readonly staticAsset: NitroStaticAsset;

  constructor(scope: Construct, id: string, props: NitroAssetProps) {
    super(scope, id);
    const outputDir = resolve(props.path, props.outputDir ?? ".output");
    const nitroJSON = JSON.parse(
      readFileSync(resolve(outputDir, "nitro.json")).toString()
    ) as NitroJSON;

    this.serverHandler = Code.fromAsset(
      resolve(outputDir, nitroJSON.output.serverDir)
    );
    this.staticAsset = new NitroStaticAsset(
      resolve(outputDir, nitroJSON.output.publicDir)
    );
  }
}
