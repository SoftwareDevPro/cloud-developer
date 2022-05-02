import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodoAccess')
  
// TODO: Implement the dataLayer logic
export class TodoAccess {

    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly table = process.env.TODOS_TABLE
    ){}
    
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      logger.info("createTodo", { todo: JSON.stringify(todo) });

      await this.docClient.put({
        TableName: this.table,
        Item: todo,
      }).promise()
      
    return todo   
  }

  async deleteTodo(userId: string, todoId: string) {
    logger.info("deleteTodo", { userId: userId, todoId: todoId });

    const params = {
        TableName: this.table,
        Key: { todoId, userId }
    }

    await this.docClient.delete(params, function(err) {
      if (err) {
          logger.error("failed to delete item")
      } else {
        logger.info("item deleted ")
      }
    }).promise()
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
      logger.info("getTodosForUser", { userId: userId  });
  
      const result = await this.docClient.query({
        TableName: this.table,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
      }).promise()
        
      const items = result.Items
  
      return items as TodoItem[]
  }

  async updateTodo(update: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
      logger.info("updateTodo", { userId: userId, todoId: todoId, done: update.done });

      await this.docClient.update({
          TableName: this.table,
          Key: { 
            todoId: todoId, 
            userId: userId 
          },
          ExpressionAttributeNames: {"#todo_name": "name"},
          UpdateExpression: "set #todo_name = :name, dueDate = :dueDate, done = :done",
          ExpressionAttributeValues: {
              ":name": update.name,
              ":dueDate": update.dueDate,
              ":done": update.done,
          },
          ReturnValues: "UPDATED_NEW"
      }).promise()
        
      return update   
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem[]> {
      logger.info("getTodo", { userId: userId, todoId: todoId });
      
      const result = await this.docClient.query({
        TableName: this.table,
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':todoId': todoId
        }
      }).promise()
      
      const items = result.Items
  
      return items as TodoItem[]
  }

  async createAttachmentPresignedUrl(update: any): Promise<TodoItem> {
    logger.info("createAttachmentPresignedUrl");
    
    await this.docClient.update({
        TableName: this.table,
        Key: { 
          todoId: update.todoId, 
          userId: update.userId 
        },
        ExpressionAttributeNames: {"#A": "attachmentUrl"},
        UpdateExpression: "set #A = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": update.attachmentUrl,
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()
        
      return update  
  }      

}