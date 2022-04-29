import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { AttachmentUtils } from '../../helpers/attachmentUtils';
import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const attachmentUtils = new AttachmentUtils();

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    logger.info("processing event", { event: event })

    const updateUrl = attachmentUtils.getUploadUrl(todoId)
    const userId = getUserId(event)
    const url = {
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }

    await createAttachmentPresignedUrl(url, userId, todoId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        updateUrl
      })
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
