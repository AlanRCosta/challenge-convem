// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ maxAttempts: 0 });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const sqsConsumerHandler = async (event) => {
  console.info("received:", event);

  for (const rec of event.Records) {
    try {
      const item = {
        ...JSON.parse(rec.body),
        id: randomUUID(),
        timestamps: {
          ddb: new Date().toISOString(),
          sqs: new Date(parseInt(rec.attributes.SentTimestamp)).toISOString(),
        },
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
      return { batchItemFailures: 1 };
    }
  }
  // All log statements are written to CloudWatch
};
