import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodo, deleteTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    
    logger.info("processing event", { event: event })

    const userId = getUserId(event)
  
    const item = await getTodo(userId, todoId)
  
    if (item.length === 0) {
      logger.error("invalid todo", { todoId: todoId })
      return {
        statusCode: 404,
        body: 'todo does not exist'
      }
    }

    await deleteTodo(userId, todoId)
  
    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)
