import handler from './util/handler';
import dynamoDb from './util/dynamodb';

// get all notes (that belong to user). GET /notes

export const main = handler(async (event) => {
  // get only notes for the authorized user
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    // partition key
    KeyConditionExpression: 'userId = :userId',
    // 'ExpressionAttribueValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
