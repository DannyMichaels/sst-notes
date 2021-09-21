import handler from './util/handler';
import dynamoDb from './util/dynamodb';

// GET note/{id}
export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,

    // 'Key' defines the partition key and sort key of the item to be retrieved

    Key: {
      userId, // the id of the author
      // noteId: event.pathParameters.id, // the id of the note from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) throw new Error('Item not found.');

  // Return the retrieved item
  return result.Item;
});
