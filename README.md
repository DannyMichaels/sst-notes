# notes

live deploy: https://d268r3kvwnb0lh.cloudfront.net

# stack

SST - serverless stack
auto deploys: Seed

## backend

- Lambda
- DynamoDB (database)
- API gateway

## Frotend:

- Library: React
- AWS-Amplify
- Stripe
- UI: bootstrap
- Error reporting: Sentry

# Project Layout

An SST app is made up of two parts.

- `lib/` - App Infrastructure
  the code that describes the infrastructue of your serverless app is placed in the `lib/` directory of your project. SST uses `AWS CDK`, to create the infrastructure.
- `src/` - App Code
  The lambda function code that's run when your API is invoked is placed in the src/ directory of your porject.

## Create an SST APP

Later on we'll be adding a `frontend/` directory for our frontend React app.

# Getting Started with Serverless Stack (SST)

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ npm install
```

## Commands

### `npm run start`

Starts the local Lambda development environment.

### `npm run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

### `npm run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).

# sst-notes

# example response:

```
{"userId":"123","noteId":"56b5de90-19b4-11ec-bef7-31af33c95455","content":"New World","attachment":"new.jpg","createdAt":1632102288121}

routes:
GET /notes
POST /notes
GET /notes/{id}
PUT /notes/id
DELETE /notes/id
```

# auto-deploys

Handled by Seed @ console.seed.run
