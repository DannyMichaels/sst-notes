import * as sst from '@serverless-stack/resources';

/*
We are creating a new stack in our SST app. We'll be using it to create all our
storage related infrasturcture (DynamoDB and S3). There's no specific reason why we are creating
a separate stack for these resources. It's only meant as a way of organizing our sources
and illustrating how to create separate stacks in our app.
*/
export default class StorageStack extends sst.Stack {
  // Public reference to the bucket
  bucket;
  // Public reference to the table
  table; // allows us to reference this resource in our other stacks

  constructor(scope, id, props) {
    super(scope, id, props);

    // Create an S3 bucket
    this.bucket = new sst.Bucket(this, 'Uploads');

    /* We are using SST's Table construct to create our DynamoDB table.
     it has two fields:
     1 userId: the id of the user that the note belongs to.
     2. noteId: the id of the note */
    this.table = new sst.Table(this, 'Notes', {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      // each dynamoDB table has a primary key. This cannot be changed once set.
      // the primary key uniquely identifies each item in the table, so that no two items can have same key.
      // DynamoDB supports two kinds: Partition key, Partition key and sort key (composite)
      primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
    });
  }
}
