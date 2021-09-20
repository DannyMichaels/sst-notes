/*
  - We are creating a handler function that we'll use as a wrapper around our Lambda functions.
  - It takes our Lambda function as the arguement
  - We then run the Lambda function in a try/catch block.
  - On success, we JSON.stringify the result and return it with a 200 status code.
  - If there is an error then we return the error message with a 500 status code.
*/

/*
It's important to note that the handler.js needs to be imported before we import anything else.
This is because we'll be adding some error handling to it later that needs to be initialized when
our Lambda function is first invoked.
*/

export default function handler(lambda) {
  return async function (event, context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (err) {
      console.log(err);
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
}
