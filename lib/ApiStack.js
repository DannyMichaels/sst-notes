import * as sst from '@serverless-stack/resources';

export default class ApiStack extends sst.Stack {
  // Public reference to the API
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props;

    // Create the API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizationType: 'AWS_IAM', // use AWS_IAm across all our routes
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
      routes: {
        'GET /notes': 'src/list.main', // get all notes
        'POST /notes': 'src/create.main', // create new note
        'GET /notes/{id}': 'src/get.main', // get one note by id
        'PUT /notes/{id}': 'src/update.main', // update note
        'DELETE /notes/{id}': 'src/delete.main', // delete note

        'POST /billing': 'src/billing.main', // stripe charge
      },
    });

    // Allow the API to access the table
    this.api.attachPermissions([table]);

    // Show the API endpoint in the output
    this.addOutputs({
      apiEndpoint: this.api.url,
    });
  }
}
