import * as uuid from 'uuid';
import handler from './util/handler';
import dynamoDb from './util/dynamodb';

// creating an note, POST /notes.
export const main = handler(async (event) => {
  // request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,

    Item: {
      // The attributes of the note to be created
      userId: '123', // The id of the author, for now it's hardcoded, later we'll set it to authenticated user
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
