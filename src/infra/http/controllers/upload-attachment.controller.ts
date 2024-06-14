import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { BadGatewayException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2  // 2Mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' })
        ]
      })
    ) file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      body: file.buffer,
      fileType: file.mimetype
    })


    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new UnauthorizedException(error.message)
        default: throw new BadGatewayException(error.message)
      }
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id
    }

  }
}