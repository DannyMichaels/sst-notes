import * as iam from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';

/*
- We are creating a new stack for our auth infrastructure. We don't need to create a separate stack but
we are using it as an example to show how to work with multiple stacks.
- The Auth construct creates a Cognito User Pool for us. We are using the signInAliases prop to
state that we want our users to be login with their email.
- The Auth construct also creates an Identity Pool. The attachPermissionsForAuthUsers
function allows us to specify the resources our authenticated users have access to.
- In this case, we want them to access our API. We'll be passing that in as a prop
- And we want them to access our S3 bucket. We'll look at this in detail below.
- Finally, we output the ids of the auth resources that've been created.
*/

export default class AuthStack extends sst.Stack {
  auth; // Public reference to the auth instance

  constructor(scope, id, props) {
    super(scope, id, props);

    const { api, bucket } = props;

    // Create a Cognito User Pool and Identity Pool
    this.auth = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          // Users can login with their email and password
          signInAliases: { email: true },
        },
      },
    });

    this.auth.attachPermissionsForAuthUsers([
      api, // allow access to the API
      // Policy granting accesss to a specific folder in the bucket
      new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*',
        ],
      }),
    ]);

    // Show the auth resources in the output
    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId,
    });
  }
}
