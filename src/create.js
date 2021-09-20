import handler from './util/handler';
import dynamoDb from './util/dynamodb';
import * as uuid from 'uuid';

// creating an note, POST /notes.
export const main = handler(async (event) => {
  // request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  // federated identity id (or Identity Pool user id). not the user id that is assigned in our user pool.

  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,

    Item: {
      // The attributes of the note to be created
      userId: userId, // The id of the author.
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
