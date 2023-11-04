import { awscdk } from "projen";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "WinterYukky",
  authorAddress: "49480575+WinterYukky@users.noreply.github.com",
  cdkVersion: "2.104.0",
  defaultReleaseBranch: "main",
  name: "nitro-aws-cdk-lib",
  keywords: ["cdk", "awscdk", "aws-cdk"],
  projenrcTs: true,
  repositoryUrl: "https://github.com/WinterYukky/nitro-aws-cdk-lib.git",
  devDeps: ["prettier", "eslint-config-prettier"],
  eslintOptions: {
    dirs: [],
    prettier: true,
  },
  jestOptions: {
    jestVersion: "^27.0.0",
  },
});
project.synth();
