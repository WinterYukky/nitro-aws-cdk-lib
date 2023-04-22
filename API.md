# Nitro AWS CDK Library

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### NitroAsset <a name="NitroAsset" id="nitro-aws-cdk-lib.NitroAsset"></a>

Asset of nitro.

This Construct can resolve nitro output path.

*Example*

```typescript
const nitro = new NitroAsset(this, "NitroAsset", {
  path: "../nuxt3" // your nitro project path
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

new NitroAsset(scope: Construct, id: string, props: AssetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.aws_s3_assets.AssetProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="nitro-aws-cdk-lib.NitroAsset.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_s3_assets.AssetProps

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
    runtime: lambda.Runtime.NODEJS_16_X,
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


