import { readdirSync, rmdirSync, mkdirSync } from "fs";
import { App, Stack } from "aws-cdk-lib";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment } from "aws-cdk-lib/aws-s3-deployment";
import { NitroAsset } from "../src";

describe("Another directory", () => {
  const app = new App();
  const stack = new Stack(app, "TestStack");
  const asset = new NitroAsset(stack, "AnotherDirectory", {
    path: "test/data/another-directory",
  });
  it("Should detect server directory", () => {
    const files = readdirSync(asset.serverHandler.path);
    expect(files).toEqual(["index.mjs"]);
  });
  it("Should detect public directory", () => {
    expect(asset.staticAsset.files).toEqual(["favicon.ico"]);
    expect(asset.staticAsset.directories).toEqual(["_nuxt"]);
  });
});

describe("Server only", () => {
  try {
    rmdirSync("test/data/server-only/.output/public");
  } finally {
    mkdirSync("test/data/server-only/.output/public");
  }
  const app = new App();
  const stack = new Stack(app, "TestStack");
  const asset = new NitroAsset(stack, "ServerOnly", {
    path: "test/data/server-only",
  });
  it("files are should empty", () => {
    expect(asset.staticAsset.files).toEqual([]);
  });
  it("directories are should empty", () => {
    expect(asset.staticAsset.directories).toEqual([]);
  });
  it("should create dotfile", () => {
    const files = readdirSync(asset.staticAsset.path);
    expect(files).toEqual(["dotfile"]);
  });
});

describe("NitroStaticAsset.resolveCloudFrontBehaviors", () => {
  const app = new App();
  const stack = new Stack(app, "TestStack");
  const asset = new NitroAsset(stack, "ResolveCloudFrontBehaviors", {
    path: "test/data/resolve-cloud-front-behaviors",
  });
  const bucket = new Bucket(stack, "Bucket");
  const s3Origin = new S3Origin(bucket);
  const additionalBehaviors = asset.staticAsset.resolveCloudFrontBehaviors({
    resolve: () => ({
      origin: s3Origin,
    }),
  });
  new BucketDeployment(stack, "Deployment", {
    sources: [asset.staticAsset],
    destinationBucket: bucket,
  });
  it("files are as it", () => {
    expect(additionalBehaviors).toMatchObject({
      "favicon.ico": { origin: s3Origin },
    });
  });
  it("directories are marked with an asterisk", () => {
    expect(additionalBehaviors).toMatchObject({
      "_nuxt/*": { origin: s3Origin },
    });
  });
});
