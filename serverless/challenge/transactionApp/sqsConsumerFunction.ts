import { SQSEvent } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Transaction } from "./transactionType";
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const client = new DynamoDBClient({ maxAttempts: 0 });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
  console.info("received:", event);

  for (const rec of event.Records) {
    try {
      const item: Transaction = {
        ...JSON.parse(rec.body),
      };

      // Try saving the item to the destination DynamoDB table
      await ddbDocClient.send(
        new PutItemCommand({
          TableName: tableName,
          Item: marshall(item),
        })
      );
    } catch (err) {
      console.log(err);
      // return { batchItemFailures: 1 };
    }
  }
};
