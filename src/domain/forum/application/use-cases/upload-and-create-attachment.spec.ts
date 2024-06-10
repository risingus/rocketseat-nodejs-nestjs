import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'

let imMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakaUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    imMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakaUploader = new FakeUploader
    sut = new UploadAndCreateAttachmentUseCase(imMemoryAttachmentsRepository, fakaUploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })


    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: imMemoryAttachmentsRepository.items[0]
    })
    expect(fakaUploader.uploads).toHaveLength(1)
    expect(fakaUploader.uploads[0]).toEqual(expect.objectContaining({
      fileName: 'profile.png'
    }))
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from('')
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)

  })
})
