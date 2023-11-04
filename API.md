# Nitro AWS CDK Library

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### NitroAsset <a name="NitroAsset" id="nitro-aws-cdk-lib.NitroAsset"></a>

Asset of nitro.

This Construct can resolve nitro output path.

*Example*

```typescript
const nitro = new NitroAsset(this, "NitroAsset", {
  path: "../my-nitro-app" // your nitro project path
})
const edgeFunction = new cloudfront.experimental.EdgeFunction(
  this,
  "EdgeFunction",
  {
    runtime: lambda.Runtime.NODEJS_16_X,
    handler: "index.handler",
    code: nitro.serverHandler,
  }
);
const bucket = new s3.Bucket(this, "Bucket", {
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const s3Origin = new origins.S3Origin(bucket);
const distribution = new cloudfront.Distribution(this, "Distribution", {
  defaultBehavior: {
    origin: s3Origin,
    edgeLambdas: [
      {
        functionVersion: edgeFunction.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
      },
    ],
  },
  additionalBehaviors: nitro.staticAsset.resolveCloudFrontBehaviors({
    resolve: () => ({
      origin: s3Origin,
    }),
  }),
});
new s3deployment.BucketDeployment(this, "Deployment", {
  sources: [nitro.staticAsset],
  destinationBucket: bucket,
  distribution,
});
new CfnOutput(this, "URL", {
  value: `https://${distribution.distributionDomainName}`,
});
```


#### Initializers <a name="Initializers" id="nitro-aws-cdk-lib.NitroAsset.Initializer"></a>

```typescript
import { NitroAsset } from 'nitro-aws-cdk-lib'

new NitroAsset(scope: Construct, id: string, props: NitroAssetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.props">props</a></code> | <code><a href="#nitro-aws-cdk-lib.NitroAssetProps">NitroAssetProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.props"></a>

- *Type:* <a href="#nitro-aws-cdk-lib.NitroAssetProps">NitroAssetProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="nitro-aws-cdk-lib.NitroAsset.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="nitro-aws-cdk-lib.NitroAsset.isConstruct"></a>

```typescript
import { NitroAsset } from 'nitro-aws-cdk-lib'

NitroAsset.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="nitro-aws-cdk-lib.NitroAsset.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.property.serverHandler">serverHandler</a></code> | <code>aws-cdk-lib.aws_lambda.AssetCode</code> | Server handler of nitro for lambda function. |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.property.staticAsset">staticAsset</a></code> | <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset">NitroStaticAsset</a></code> | static asset of nitro for s3 deployment. |

---

##### `node`<sup>Required</sup> <a name="node" id="nitro-aws-cdk-lib.NitroAsset.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `serverHandler`<sup>Required</sup> <a name="serverHandler" id="nitro-aws-cdk-lib.NitroAsset.property.serverHandler"></a>

```typescript
public readonly serverHandler: AssetCode;
```

- *Type:* aws-cdk-lib.aws_lambda.AssetCode

Server handler of nitro for lambda function.

---

*Example*

```typescript
declare const nitro: NitroAsset;
new cloudfront.experimental.EdgeFunction(
  this,
  "EdgeFunction",
  {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: "index.handler",
    code: nitro.serverHandler,
  }
);
```


##### `staticAsset`<sup>Required</sup> <a name="staticAsset" id="nitro-aws-cdk-lib.NitroAsset.property.staticAsset"></a>

```typescript
public readonly staticAsset: NitroStaticAsset;
```

- *Type:* <a href="#nitro-aws-cdk-lib.NitroStaticAsset">NitroStaticAsset</a>

static asset of nitro for s3 deployment.

When public dir is empty, this asset includes only empty dotfile.

---

*Example*

```typescript
declare const nitro: NitroAsset;
declare const bucket: s3.Bucket;
new s3deployment.BucketDeployment(this, "Deployment", {
  sources: [nitro.staticAsset],
  destinationBucket: bucket,
});
```



## Structs <a name="Structs" id="Structs"></a>

### NitroAssetProps <a name="NitroAssetProps" id="nitro-aws-cdk-lib.NitroAssetProps"></a>

NitroAssetProps.

*Example*

```typescript
const nitro = new NitroAsset(this, "NitroAsset", {
  path: "../my-nitro-app" // your nitro project path
})
```


#### Initializer <a name="Initializer" id="nitro-aws-cdk-lib.NitroAssetProps.Initializer"></a>

```typescript
import { NitroAssetProps } from 'nitro-aws-cdk-lib'

const nitroAssetProps: NitroAssetProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.assetHash">assetHash</a></code> | <code>string</code> | Specify a custom hash for this asset. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.assetHashType">assetHashType</a></code> | <code>aws-cdk-lib.AssetHashType</code> | Specifies the type of hash to calculate for this asset. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.bundling">bundling</a></code> | <code>aws-cdk-lib.BundlingOptions</code> | Bundle the asset by executing a command in a Docker container or a custom bundling provider. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.exclude">exclude</a></code> | <code>string[]</code> | File paths matching the patterns will be excluded. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.followSymlinks">followSymlinks</a></code> | <code>aws-cdk-lib.SymlinkFollowMode</code> | A strategy for how to handle symlinks. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.ignoreMode">ignoreMode</a></code> | <code>aws-cdk-lib.IgnoreMode</code> | The ignore behavior to use for `exclude` patterns. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.deployTime">deployTime</a></code> | <code>boolean</code> | Whether or not the asset needs to exist beyond deployment time; |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.readers">readers</a></code> | <code>aws-cdk-lib.aws_iam.IGrantable[]</code> | A list of principals that should be able to read this asset from S3. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.path">path</a></code> | <code>string</code> | The disk location of the asset. |
| <code><a href="#nitro-aws-cdk-lib.NitroAssetProps.property.outputDir">outputDir</a></code> | <code>string</code> | Path to output directory. |

---

##### `assetHash`<sup>Optional</sup> <a name="assetHash" id="nitro-aws-cdk-lib.NitroAssetProps.property.assetHash"></a>

```typescript
public readonly assetHash: string;
```

- *Type:* string
- *Default:* based on `assetHashType`

Specify a custom hash for this asset.

If `assetHashType` is set it must
be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
be SHA256 hashed and encoded as hex. The resulting hash will be the asset
hash.

NOTE: the hash is used in order to identify a specific revision of the asset, and
used for optimizing and caching deployment activities related to this asset such as
packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
need to make sure it is updated every time the asset changes, or otherwise it is
possible that some deployments will not be invalidated.

---

##### `assetHashType`<sup>Optional</sup> <a name="assetHashType" id="nitro-aws-cdk-lib.NitroAssetProps.property.assetHashType"></a>

```typescript
public readonly assetHashType: AssetHashType;
```

- *Type:* aws-cdk-lib.AssetHashType
- *Default:* the default is `AssetHashType.SOURCE`, but if `assetHash` is explicitly specified this value defaults to `AssetHashType.CUSTOM`.

Specifies the type of hash to calculate for this asset.

If `assetHash` is configured, this option must be `undefined` or
`AssetHashType.CUSTOM`.

---

##### `bundling`<sup>Optional</sup> <a name="bundling" id="nitro-aws-cdk-lib.NitroAssetProps.property.bundling"></a>

```typescript
public readonly bundling: BundlingOptions;
```

- *Type:* aws-cdk-lib.BundlingOptions
- *Default:* uploaded as-is to S3 if the asset is a regular file or a .zip file, archived into a .zip file and uploaded to S3 otherwise

Bundle the asset by executing a command in a Docker container or a custom bundling provider.

The asset path will be mounted at `/asset-input`. The Docker
container is responsible for putting content at `/asset-output`.
The content at `/asset-output` will be zipped and used as the
final asset.

---

##### `exclude`<sup>Optional</sup> <a name="exclude" id="nitro-aws-cdk-lib.NitroAssetProps.property.exclude"></a>

```typescript
public readonly exclude: string[];
```

- *Type:* string[]
- *Default:* nothing is excluded

File paths matching the patterns will be excluded.

See `ignoreMode` to set the matching behavior.
Has no effect on Assets bundled using the `bundling` property.

---

##### `followSymlinks`<sup>Optional</sup> <a name="followSymlinks" id="nitro-aws-cdk-lib.NitroAssetProps.property.followSymlinks"></a>

```typescript
public readonly followSymlinks: SymlinkFollowMode;
```

- *Type:* aws-cdk-lib.SymlinkFollowMode
- *Default:* SymlinkFollowMode.NEVER

A strategy for how to handle symlinks.

---

##### `ignoreMode`<sup>Optional</sup> <a name="ignoreMode" id="nitro-aws-cdk-lib.NitroAssetProps.property.ignoreMode"></a>

```typescript
public readonly ignoreMode: IgnoreMode;
```

- *Type:* aws-cdk-lib.IgnoreMode
- *Default:* IgnoreMode.GLOB

The ignore behavior to use for `exclude` patterns.

---

##### `deployTime`<sup>Optional</sup> <a name="deployTime" id="nitro-aws-cdk-lib.NitroAssetProps.property.deployTime"></a>

```typescript
public readonly deployTime: boolean;
```

- *Type:* boolean
- *Default:* false

Whether or not the asset needs to exist beyond deployment time;

i.e.
are copied over to a different location and not needed afterwards.
Setting this property to true has an impact on the lifecycle of the asset,
because we will assume that it is safe to delete after the CloudFormation
deployment succeeds.

For example, Lambda Function assets are copied over to Lambda during
deployment. Therefore, it is not necessary to store the asset in S3, so
we consider those deployTime assets.

---

##### `readers`<sup>Optional</sup> <a name="readers" id="nitro-aws-cdk-lib.NitroAssetProps.property.readers"></a>

```typescript
public readonly readers: IGrantable[];
```

- *Type:* aws-cdk-lib.aws_iam.IGrantable[]
- *Default:* No principals that can read file asset.

A list of principals that should be able to read this asset from S3.

You can use `asset.grantRead(principal)` to grant read permissions later.

---

##### `path`<sup>Required</sup> <a name="path" id="nitro-aws-cdk-lib.NitroAssetProps.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string

The disk location of the asset.

The path should refer to one of the following:
- A regular file or a .zip file, in which case the file will be uploaded as-is to S3.
- A directory, in which case it will be archived into a .zip file and uploaded to S3.

---

##### `outputDir`<sup>Optional</sup> <a name="outputDir" id="nitro-aws-cdk-lib.NitroAssetProps.property.outputDir"></a>

```typescript
public readonly outputDir: string;
```

- *Type:* string
- *Default:* ".output"

Path to output directory.

---

## Classes <a name="Classes" id="Classes"></a>

### NitroStaticAsset <a name="NitroStaticAsset" id="nitro-aws-cdk-lib.NitroStaticAsset"></a>

- *Implements:* aws-cdk-lib.aws_s3_deployment.ISource

Static asset of nitro.

This Construct provides to resolve
additionalBehaviors of CloudFront Distribution easy.

#### Initializers <a name="Initializers" id="nitro-aws-cdk-lib.NitroStaticAsset.Initializer"></a>

```typescript
import { NitroStaticAsset } from 'nitro-aws-cdk-lib'

new NitroStaticAsset(path: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.Initializer.parameter.path">path</a></code> | <code>string</code> | *No description.* |

---

##### `path`<sup>Required</sup> <a name="path" id="nitro-aws-cdk-lib.NitroStaticAsset.Initializer.parameter.path"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.bind">bind</a></code> | Binds the source to a bucket deployment. |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.resolveCloudFrontBehaviors">resolveCloudFrontBehaviors</a></code> | helper function for aggregate behaviors every files and directories. |

---

##### `bind` <a name="bind" id="nitro-aws-cdk-lib.NitroStaticAsset.bind"></a>

```typescript
public bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig
```

Binds the source to a bucket deployment.

###### `scope`<sup>Required</sup> <a name="scope" id="nitro-aws-cdk-lib.NitroStaticAsset.bind.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `context`<sup>Optional</sup> <a name="context" id="nitro-aws-cdk-lib.NitroStaticAsset.bind.parameter.context"></a>

- *Type:* aws-cdk-lib.aws_s3_deployment.DeploymentSourceContext

---

##### `resolveCloudFrontBehaviors` <a name="resolveCloudFrontBehaviors" id="nitro-aws-cdk-lib.NitroStaticAsset.resolveCloudFrontBehaviors"></a>

```typescript
public resolveCloudFrontBehaviors(resolver: ICloudFrontBehaviorResolver): {[ key: string ]: BehaviorOptions}
```

helper function for aggregate behaviors every files and directories.

*Example*

```typescript
declare const nitro: NitroAsset;
declare const s3Origin: origins.S3Origin;
new cloudfront.Distribution(this, "Distribution", {
  defaultBehavior: {
    origin: s3Origin,
  },
  additionalBehaviors: nitro.staticAsset.resolveCloudFrontBehaviors({
    resolve: () => ({
      origin: s3Origin,
    }),
  }),
});
```


###### `resolver`<sup>Required</sup> <a name="resolver" id="nitro-aws-cdk-lib.NitroStaticAsset.resolveCloudFrontBehaviors.parameter.resolver"></a>

- *Type:* <a href="#nitro-aws-cdk-lib.ICloudFrontBehaviorResolver">ICloudFrontBehaviorResolver</a>

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.property.directories">directories</a></code> | <code>string[]</code> | Directories under publicDir. |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.property.files">files</a></code> | <code>string[]</code> | files under publicDir. |
| <code><a href="#nitro-aws-cdk-lib.NitroStaticAsset.property.path">path</a></code> | <code>string</code> | *No description.* |

---

##### `directories`<sup>Required</sup> <a name="directories" id="nitro-aws-cdk-lib.NitroStaticAsset.property.directories"></a>

```typescript
public readonly directories: string[];
```

- *Type:* string[]

Directories under publicDir.

---

##### `files`<sup>Required</sup> <a name="files" id="nitro-aws-cdk-lib.NitroStaticAsset.property.files"></a>

```typescript
public readonly files: string[];
```

- *Type:* string[]

files under publicDir.

---

##### `path`<sup>Required</sup> <a name="path" id="nitro-aws-cdk-lib.NitroStaticAsset.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string

---


## Protocols <a name="Protocols" id="Protocols"></a>

### ICloudFrontBehaviorResolver <a name="ICloudFrontBehaviorResolver" id="nitro-aws-cdk-lib.ICloudFrontBehaviorResolver"></a>

- *Implemented By:* <a href="#nitro-aws-cdk-lib.ICloudFrontBehaviorResolver">ICloudFrontBehaviorResolver</a>

Resolver that for additionalBehaviors of CloudFront Distribution.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#nitro-aws-cdk-lib.ICloudFrontBehaviorResolver.resolve">resolve</a></code> | *No description.* |

---

##### `resolve` <a name="resolve" id="nitro-aws-cdk-lib.ICloudFrontBehaviorResolver.resolve"></a>

```typescript
public resolve(key: string): BehaviorOptions
```

###### `key`<sup>Required</sup> <a name="key" id="nitro-aws-cdk-lib.ICloudFrontBehaviorResolver.resolve.parameter.key"></a>

- *Type:* string

---


