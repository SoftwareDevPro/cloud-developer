import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getTodo, updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

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
  
    const items = await updateTodo(updatedTodo, userId, todoId)
    
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)
