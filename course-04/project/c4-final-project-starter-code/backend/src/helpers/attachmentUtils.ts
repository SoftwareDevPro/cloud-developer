import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStorage logic

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingAWSSDK.html
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const logger = createLogger('attachmentUtils')
const bucket = process.env.ATTACHMENT_S3_BUCKET
const signedUrlExp = process.env.SIGNED_URL_EXPIRATION
  
export class AttachmentUtils {

    getUploadUrl(todoId: string) {
        logger.info("getUploadUrl", { todoId: todoId })
        
        return s3.getSignedUrl('putObject', {
          Bucket: bucket,
          Key: todoId,
          Expires: +signedUrlExp
        })
    }
}
