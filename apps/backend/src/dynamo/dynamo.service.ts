import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoService {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const raw = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.client = DynamoDBDocumentClient.from(raw, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  async put(tableName: string, item: Record<string, any>) {
    await this.client.send(new PutCommand({ TableName: tableName, Item: item }));
    return item;
  }

  async get(tableName: string, key: Record<string, any>) {
    const result = await this.client.send(new GetCommand({ TableName: tableName, Key: key }));
    return result.Item ?? null;
  }

  async update(tableName: string, key: Record<string, any>, updates: Record<string, any>) {
    const entries = Object.entries(updates);
    if (entries.length === 0) return null;

    const expression = 'SET ' + entries.map((_, i) => `#k${i} = :v${i}`).join(', ');
    const names = Object.fromEntries(entries.map(([k], i) => [`#k${i}`, k]));
    const values = Object.fromEntries(entries.map(([, v], i) => [`:v${i}`, v]));

    const result = await this.client.send(
      new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: expression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      }),
    );
    return result.Attributes;
  }

  async delete(tableName: string, key: Record<string, any>) {
    await this.client.send(new DeleteCommand({ TableName: tableName, Key: key }));
  }

  async query(
    tableName: string,
    indexName: string,
    keyCondition: string,
    values: Record<string, any>,
    names?: Record<string, string>,
  ) {
    const result = await this.client.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyCondition,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
      }),
    );
    return result.Items ?? [];
  }

  async scan(tableName: string, filter?: string, values?: Record<string, any>, names?: Record<string, string>) {
    const result = await this.client.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: filter,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
      }),
    );
    return result.Items ?? [];
  }
}
