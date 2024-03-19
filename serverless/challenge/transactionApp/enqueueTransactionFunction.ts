import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const client = new SQSClient({});

const queueUrl = process.env.QUEUE_URL;

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }

  if (!event.body) {
    return { statusCode: 400, body: "" };
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
