// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import {
  SQSClient,
  paginateListQueues,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";

// const client = new DynamoDBClient({});
// const ddbDocClient = DynamoDBDocumentClient.from(client);

const client = new SQSClient({});

// Get the DynamoDB table name from environment variables
const queueUrl = process.env.QUEUE_URL;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      DelaySeconds: 10,
      MessageAttributes: {},
      MessageBody: event.body,
    });

    const response = await client.send(command);

    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
