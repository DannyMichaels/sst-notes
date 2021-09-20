import handler from './util/handler';
import dynamoDb from './util/dynamodb';

// PUT /notes/{id}
export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be updated
    Key: {
      userId: '123',
      noteId: event.pathParameters.id, // The id of the note from the path.
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in update expression
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    ExpressionAttributeValues: {
      ':attachment': data.attachment || null,
      ':content': data.content || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.update(params);
  let updatedNote = result.Attributes ?? null;

  return { status: true, note: updatedNote };
});
